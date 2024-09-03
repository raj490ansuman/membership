import moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { Attributes, Op, QueryTypes, Transaction, UniqueConstraintError } from 'sequelize'
import { BAD_REQUEST, CONFLICT_ERROR, lineConfig, PERMISSION_ERROR, RESPONSE_SUCCESS, SYSTEM_ERROR } from '../config'
import { AppError, CommonUtil, EncUtils, SocketUtil } from '../utilities'
import { db } from '../models'
import type { Member } from '../models/member.model'
import {
	AttributeService,
	AuthenticationService,
	LineService,
	MemberCsvService,
	MemberService,
	VisitsService
} from '../services'

export const getMember = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const memberId = parseInt(req.params.memberId)
		if (!memberId) {
			throw new AppError(SYSTEM_ERROR, 'invalid memberId', false)
		}
		const member = await MemberService.findMemberById(memberId)
		const memberData = member?.toJSON() as any // TODO: Bind this to type

		// TODO: These should be actually reurned in the MemberService.getMember
		memberData.countVisit = VisitsService.countUniqueDayMemberVisits(member?.visits)
		memberData.lastVisit = memberData.visits?.length ? memberData.visits?.[0]?.visitDate : null
		memberData.kakeruPoints = memberData.points?.length ? memberData.points : []

		res.send(memberData)
	} catch (e) {
		next(e)
	}
}
export const generateMemberCSV = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const managerId = AuthenticationService.getManagerIdFromCookie(req)

		if (!managerId) {
			throw new AppError(PERMISSION_ERROR, 'no session', false)
		}

		const isCampaign = req.body.isCampaign ?? undefined //default false

		// TODO: Dynamically parse incoming filters to generate member search filter
		// Reference: MemberController.browseMembers

		if (!req.body.password) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}

		const manager = await AuthenticationService.getManager(managerId)
		if (manager == null) {
			throw new AppError(SYSTEM_ERROR, `manager ${managerId} does not exist`, false)
		}

		const isMatch = await EncUtils.comparePassword(req.body.password, manager.pwhash)
		if (!isMatch) {
			throw new AppError(PERMISSION_ERROR, 'invalid password', false)
		}

		const memberWhere: any = MemberCsvService.generateMemberSearchFilter(
			{ displayName: { [Op.not]: null } },
			{ isCampaign }
		)

		const members: Member[] = await MemberCsvService.getMemberDataList(memberWhere)
		const memberAttributes = await AttributeService.listMemberAttributes()

		const csvData = await MemberCsvService.generateMemberCsvData(members, memberAttributes)
		res.setHeader('Content-Type', 'text/csv')
		res.setHeader('Content-Disposition', 'attachment; filename=campaign_candidates.csv')
		res.status(RESPONSE_SUCCESS).end(csvData)
	} catch (e) {
		next(e)
	}
}
export const browseMembers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Sanitize sortKey
		const sortKeys = ['memberId', 'displayName', 'memberSince', 'lastVisit', 'createdAt', 'updatedAt']
		let sortKey = 'memberId'
		if (sortKeys.includes(req.query.sortKey as string)) {
			// if sortKey is a valid base sortKey
			sortKey = req.query.sortKey as string
		} else if (!isNaN(Number(req.query.sortKey ?? ''.toString().split('memberAttributeId')[1]))) {
			// if sortKey is a memberAttributeIdX
			sortKey = req.query.sortKey as string
		}

		const pagination: paginationParams = {
			pp: parseInt(req.query.pp as string) || 20,
			p: parseInt(req.query.p as string) || 1,
			sort: req.query.sort === 'asc' ? 'asc' : 'desc',
			sortKey: sortKey
		}

		const {
			lineName,
			createdAtMin,
			createdAtMax,
			memberSinceMin,
			memberSinceMax,
			lastVisitMin,
			lastVisitMax,
			messages,
			isFriends,
			isRegistered
		} = req.query as Record<string, string | undefined>

		const whereClauses = []
		if (lineName) whereClauses.push('displayName LIKE :lineName')
		if (createdAtMin) whereClauses.push('createdAt >= :createdAtMin')
		if (createdAtMax) whereClauses.push('createdAt <= :createdAtMax')
		if (memberSinceMin) whereClauses.push('memberSince >= :memberSinceMin')
		if (memberSinceMax) whereClauses.push('memberSince <= :memberSinceMax')
		if (messages && messages != '') {
			if (messages.toLocaleLowerCase() === 'read') {
				whereClauses.push('members.unreadCount = 0')
			} else {
				whereClauses.push('members.unreadCount > 0')
			}
		}
		if (isFriends) whereClauses.push('isFriends = :isFriends')
		if (isRegistered !== undefined) {
			if (String(isRegistered) === 'true') {
				whereClauses.push('members.memberCode IS NOT NULL')
			} else {
				whereClauses.push('members.memberCode IS NULL')
			}
		}
		if (lastVisitMin && lastVisitMax) {
			whereClauses.push('lastVisit BETWEEN :visitMinMoment AND :visitMaxMoment')
		} else if (lastVisitMin) {
			whereClauses.push('lastVisit >= :visitMinMoment')
		} else if (lastVisitMax) {
			whereClauses.push('lastVisit <= :visitMaxMoment')
		}

		// Get all member attributes
		const memberAttributes = await AttributeService.listMemberAttributes({ isAdminDisplayed: true })

		const addressAttributeIds = memberAttributes
			.filter((attribute) => attribute.isAttributeTypeAddress())
			.map((a) => a.memberAttributeId.toString())

		// Filter incoming custom registration filters
		const memberAttributeFilterKeys = Object.keys(req.query).filter((key) => key.startsWith('memberAttribute'))
		const memberAttributeWhereReplacements: { [key: string]: any } = {}

		memberAttributeFilterKeys.forEach((filterKey) => {
			const filterValue = req.query[filterKey as string]
			if (!filterValue || filterValue?.length === 0) return

			// Trim beginning filter name but will still preserve Min/Max if exists
			const memberAttributeId = filterKey.substring('memberAttribute'.length)

			// Handle multiple selection filter
			if (Array.isArray(filterValue)) {
				// Check each option in multiple selection
				const selectedValues = filterValue.map(
					(value) => `memberAttributeId${memberAttributeId} LIKE '%${value}%'`
				)
				if (selectedValues.length > 1) {
					whereClauses.push(selectedValues.join(' OR '))
				} else {
					whereClauses.push(...selectedValues)
				}
				return
			}

			// Handle filtering by uploaded image input
			const filterValueAsStr = String(filterValue)
			if (filterValueAsStr.includes('Image')) {
				if (filterValueAsStr.includes('hasImage')) {
					return whereClauses.push(`memberAttributeId${memberAttributeId} IS NOT NULL`)
				} else if (filterValueAsStr.includes('noImage')) {
					return whereClauses.push(`memberAttributeId${memberAttributeId} IS NULL`)
				}
			}

			// Store the filter name and value since we know it's a singular filter value
			if (typeof filterValue === 'string' && !isNaN(Date.parse(filterValue))) {
				// filterValue is a valid datetime string
				memberAttributeWhereReplacements[filterKey as string] = filterValue
			} else {
				memberAttributeWhereReplacements[filterKey as string] = `%${filterValue}%`
			}

			// Handle ranged Min and Max filters
			if (memberAttributeId.endsWith('Min')) {
				const actualId = memberAttributeId.substring(0, memberAttributeId.length - 3) // Trim trailing 'Min'
				whereClauses.push(`memberAttributeId${actualId} >= :${filterKey}`)
			} else if (memberAttributeId.endsWith('Max')) {
				const actualId = memberAttributeId.substring(0, memberAttributeId.length - 3) // Trim trailing 'Max'
				whereClauses.push(`memberAttributeId${actualId} <= :${filterKey}`)
			} else if (addressAttributeIds.includes(memberAttributeId)) {
				const memberAttribute = memberAttributes.find((a) => a.memberAttributeId === Number(memberAttributeId))
				if (!memberAttribute)
					throw new AppError(SYSTEM_ERROR, 'invalid member attribute id' + memberAttributeId)
				const attributeIdsOfSameSection = memberAttributes
					.filter((attribute) => attribute.section === memberAttribute.section)
					.map((a) => a.memberAttributeId)
				whereClauses.push(
					`CONCAT(
						${attributeIdsOfSameSection.map((aId) => `IFNULL(memberAttributeId${aId}, '')`).join(', ')}
					) LIKE :${filterKey}`
				)
				memberAttributeWhereReplacements[filterKey as string] = `%${filterValue}%`
			} else {
				// Simple matching of alphanumeric input
				whereClauses.push(`memberAttributeId${memberAttributeId} LIKE :${filterKey}`)
				memberAttributeWhereReplacements[filterKey as string] = `%${filterValue}%`
			}
		})

		const whereReplacements = {
			...(lineName ? { lineName: `%${lineName}%` } : {}),
			...(createdAtMin ? { createdAtMin } : {}),
			...(createdAtMax ? { createdAtMax } : {}),
			...(memberSinceMin ? { memberSinceMin } : {}),
			...(memberSinceMax ? { memberSinceMax } : {}),
			...(isFriends ? { isFriends } : {}),
			...(lastVisitMin
				? { visitMinMoment: moment(lastVisitMin).set({ hour: 0, minute: 0, second: 0 }).toDate() }
				: {}),
			...(lastVisitMax
				? { visitMaxMoment: moment(lastVisitMax).set({ hour: 23, minute: 59, second: 59 }).toDate() }
				: {}),
			...memberAttributeWhereReplacements
		}

		let select = `members.memberId,
			members.unreadCount,
			members.displayName,
			members.memberSince,
			members.memberCode,
			members.picUrl,
			members.curRM,
			members.isRegistered,
			members.isFriends,
			members.isCampaign,
			members.createdAt,
			members.updatedAt,
			members.activeUntil,
			members.kakeruPoint,
			members.remarks,
			MAX(visits.visitDate) AS lastVisit,
			COUNT(DISTINCT DATE(visits.visitDate)) AS countVisit`

		memberAttributes.forEach((item) => {
			select += `, memberAttributeId${item?.memberAttributeId}`
		})

		const havingClausesConstructed = whereClauses.length ? 'HAVING ' + whereClauses.join(' AND ') : ''

		const members = await db.sequelize.query(
			`SELECT ${select}
			FROM members as members
			LEFT JOIN memberVisits AS visits
				ON members.memberId = visits.memberId 
			GROUP BY members.memberId ${havingClausesConstructed}
			ORDER BY ${pagination.sortKey} ${pagination.sort}
			LIMIT :limit OFFSET :offset 
				`,
			{
				replacements: {
					...whereReplacements,
					sortKey: pagination.sortKey,
					sort: pagination.sort,
					limit: pagination.pp,
					offset: (pagination.p - 1) * pagination.pp
				},
				type: QueryTypes.SELECT
			}
		)
		res.send({ ...pagination, rows: members ?? [] })
	} catch (e) {
		next(e)
	}
}
export const listMembers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await MemberService.listMembers().then((members) => res.send(members))
	} catch (e) {
		next(e)
	}
}

/**
 * Handle recording member visits via in-store qr-code scan
 */
export async function recordMemberVisitByQrCode(req: Request, res: Response, next: NextFunction) {
	let transaction = null
	const { memberCode, isMemberVisit } = req.body
	try {
		if (!memberCode) {
			throw new AppError(CONFLICT_ERROR, `membercode ${memberCode} is invalid`)
		}
		let member: Member | null = await MemberService.findMemberByCode(memberCode)

		if (member == null) {
			return res.sendStatus(CONFLICT_ERROR)
		} else if (!isMemberVisit) {
			return res.sendStatus(BAD_REQUEST)
		}

		transaction = await db.sequelize.transaction()
		const visitRecord = await VisitsService.recordMemberVisitByStoreQrCode(member, transaction)
		member = visitRecord.member
		await transaction.commit()
		await member.reload()
		SocketUtil.emitMember({ memberId: member.memberId })

		const countVisit = VisitsService.countUniqueDayMemberVisits(member.visits)

		// MemberService.getMember method orders visits by DESC visitDate
		const lastVisit = countVisit ? member.visits?.[0] : null

		// const memberEc = await EccubePluginService.checkMemberOnEccubePlugin(member.lineId)
		const memberJSON: any = member?.toJSON()
		// delete memberEc.point
		delete memberJSON.password
		delete memberJSON.lineId

		res.send({
			...memberJSON,
			lastVisit: lastVisit?.visitDate || null,
			memberVisitId: lastVisit?.memberVisitId || null,
			countVisit,
			pointsRedeemed: visitRecord.pointsRedeemed
		})
	} catch (e: any) {
		if (transaction != null) await transaction.rollback()
		if (e instanceof UniqueConstraintError) {
			res.sendStatus(CONFLICT_ERROR)
		} else {
			next(e)
		}
	}
}
/**
 * Handle recording member visits via member code barcode scan and manual member code input
 */
export async function recordMemberVisitByMemberCode(req: Request, res: Response, next: NextFunction) {
	let transaction = null
	const { memberCode, isMemberVisit } = req.body
	try {
		if (!memberCode) {
			throw new AppError(CONFLICT_ERROR, `membercode ${memberCode} is invalid`)
		}
		let member: Member | null = await MemberService.findMemberByCode(memberCode)

		if (member == null) {
			return res.sendStatus(CONFLICT_ERROR)
		}

		if (isMemberVisit) {
			transaction = await db.sequelize.transaction()
			member = await VisitsService.recordMemberVisitByMemberCode(member, transaction)
			await transaction.commit()
			await member.reload()
			SocketUtil.emitMember({ memberId: member.memberId })
		}

		const countVisit = VisitsService.countUniqueDayMemberVisits(member.visits)

		// MemberService.getMember method orders visits by DESC visitDate
		const lastVisit = countVisit ? member.visits?.[0] : null

		// const memberEc = await EccubePluginService.checkMemberOnEccubePlugin(member.lineId)
		const memberJSON: any = member?.toJSON()
		// delete memberEc.point
		delete memberJSON.password
		delete memberJSON.lineId

		res.send({
			// ...memberEc,
			...memberJSON,
			lastVisit: lastVisit?.visitDate || null,
			memberVisitId: lastVisit?.memberVisitId || null,
			countVisit
		})
	} catch (e: any) {
		if (transaction != null) await transaction.rollback()
		if (e instanceof UniqueConstraintError) {
			res.sendStatus(CONFLICT_ERROR)
		} else {
			next(e)
		}
	}
}
export const updateMember = async (req: Request, res: Response, next: NextFunction) => {
	const transaction = await db.sequelize.transaction()
	try {
		const { activeUntil, remarks, memberSince, kakeruPoint, kakeruPointIsAdd, visitDate, memberVisitId } = req.body
		const memberId = parseInt(req.params.memberId)
		if (!memberId || isNaN(memberId)) throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		const member = await MemberService.findMemberById(memberId)
		if (member == null) {
			throw new AppError(SYSTEM_ERROR, 'invalid member', false)
		}
		if (activeUntil != undefined && moment(activeUntil).isValid()) {
			member.set({ activeUntil: activeUntil })
		}
		if (remarks != undefined) {
			member.set({ remarks: remarks })
		}
		if (memberSince) {
			member.set({ memberSince: memberSince })
		}
		const params = req.body as Attributes<Member>
		await MemberService.updateMemberCustomAttributes({
			member: member,
			updatedAttributes: params,
			files: req.files,
			transaction
		})
		let updateKakeruPoints = null

		const isStoreVisitUpdate = visitDate !== (null || undefined) && memberVisitId !== (null || undefined)
		const isPointUpdateOnly = !isStoreVisitUpdate && kakeruPoint && !isNaN(kakeruPoint) && kakeruPointIsAdd != null

		if (isStoreVisitUpdate || isPointUpdateOnly) {
			// Visits default to 0 since they may or may not have point change
			const pointChange = isStoreVisitUpdate ? kakeruPoint || 0 : kakeruPoint
			updateKakeruPoints = member.addOrDeductPoint(parseInt(pointChange), kakeruPointIsAdd == true)
			if (updateKakeruPoints < 0) {
				throw new AppError(SYSTEM_ERROR, 'total point amount cannot be negative')
			}
			member.set({ kakeruPoint: updateKakeruPoints })

			// Check if point is already associated with visit
			let existingPoint = null
			if (!isPointUpdateOnly) {
				existingPoint = await db.Point.findOne({ where: { visitId: memberVisitId, source: 'kakeru' } })
			}

			if (!existingPoint) {
				await member.createPoint(
					{
						visitId: isStoreVisitUpdate ? memberVisitId : null, // Associate with visit if applicable
						point: pointChange * (kakeruPointIsAdd ? 1 : -1),
						source: 'kakeru'
					},
					{ transaction }
				)
			} else {
				// Update existing associated point
				await existingPoint.update(
					{
						point: pointChange * (kakeruPointIsAdd ? 1 : -1)
					},
					{ transaction }
				)
			}
		}
		if (member.changed()) {
			await member.save({ transaction })
		}
		await transaction.commit()
		SocketUtil.emitMember({ memberId })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		await transaction.rollback()
		next(e)
	}
}
export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
	let transaction: Transaction | null = null
	try {
		const memberId = parseInt(req.params.memberId)
		if (!memberId) {
			throw new AppError(SYSTEM_ERROR, 'invalid memberId', false)
		}
		transaction = await db.sequelize.transaction()
		await MemberService.deleteMember(memberId, LineService.unlinkRichMenuFromUser)
		const memberAttributes = await AttributeService.listMemberAttributes()

		await Promise.all(
			memberAttributes?.map((item) =>
				db.sequelize.query(
					`SELECT memberAttributeId${item?.memberAttributeId} as '${item?.memberAttributeId}' FROM members WHERE memberAttributeId${item?.memberAttributeId} IS NOT NULL LIMIT 1`,
					{
						type: QueryTypes.SELECT,
						plain: true,
						transaction
					}
				)
			)
		)
			.then(async (res) => {
				const arrayIds: Array<number> = []
				res?.forEach((i) => {
					if (i && typeof i === 'object') arrayIds?.push(Number(Object.keys(i)?.[0]))
				})

				await db.MemberAttribute.update(
					{ isDelete: true },
					{
						where: {
							memberAttributeId: {
								[Op.notIn]: arrayIds
							}
						},
						transaction: transaction
					}
				)
				return
			})
			.catch(() => {
				throw new AppError(SYSTEM_ERROR, 'error update isDelete', false)
			})
		await transaction?.commit()
		SocketUtil.emitMember({ memberId })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		if (transaction != null) {
			await transaction.rollback()
		}
		next(e)
	}
}

export async function syncFollowers(req: Request, res: Response, next: NextFunction) {
	try {
		let fetchSize =
			typeof req.body.fetchSize === 'string'
				? parseInt(req.body.fetchSize)
				: req.body.fetchSize ?? lineConfig.SYNC_FOLLOWERS_DEFAULT_FETCH_SIZE
		// clamping batchSize between min, max
		fetchSize = CommonUtil.clampNumber(
			fetchSize,
			lineConfig.SYNC_FOLLOWERS_MIN_FETCH_SIZE,
			lineConfig.SYNC_FOLLOWERS_MAX_FETCH_SIZE
		)
		const iterations = await LineService.syncFollowers(fetchSize)
		res.send(`syncFollowers finished with ${iterations} iterations`)
	} catch (e) {
		next(e)
	}
}
