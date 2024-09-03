import {
	Transaction,
	Attributes,
	WhereAttributeHash,
	Op,
	CreationAttributes,
	QueryTypes,
	col,
	literal
} from 'sequelize'
import { systemConfig, SYSTEM_ERROR } from '../config'
import { db } from '../models'
import type { Member } from '../models/member.model'
import { AppError, CommonUtil, FileUtils, writeLog } from '../utilities'
import type * as LineService from './line.service'
import type { RichMenuTabGroup } from '../models/richmenuTabGroup.model'
import { safeParseCustomMemberAttributeData } from './attribute.service'

export const findMemberByLineProfileNoInstance = async (memberId: number, transaction?: Transaction) =>
	db.sequelize.query('SELECT * FROM members WHERE memberId = :memberId LIMIT 1', {
		replacements: { memberId },
		type: QueryTypes.SELECT,
		plain: true,
		mapToModel: true,
		transaction
	}) as Promise<Attributes<Member>>

export const findMemberByLineProfile = async (memberLine: lineProfile, transaction?: Transaction) => {
	let member = await db.Member.findOne({
		where: { lineId: memberLine.userId },
		transaction
	})
	if (member == null)
		member = await db.Member.create(
			{
				lineId: memberLine.userId,
				displayName: memberLine.displayName,
				picUrl: memberLine.pictureUrl,
				curRM: 'defaultRM',
				isFriends: true
			},
			{ transaction }
		)

	member.set({
		isFriends: true,
		displayName: memberLine.displayName,
		picUrl: memberLine.pictureUrl
	})
	if (member.changed()) await member.save({ transaction })
	const memberAttributes = await db.MemberAttribute.listMemberAttributes()
	if (memberAttributes.length > 0)
		return member.reload({
			attributes: { include: memberAttributes.map((c) => `memberAttributeId${c.memberAttributeId}`) }
		})
	return member
}
export const findMemberByCode = async (memberCode: string, transaction?: Transaction) =>
	db.Member.findOne({
		where: { memberCode: memberCode },
		include: [
			{
				association: db.Member.associations.points,
				attributes: { include: ['processedAt'], exclude: ['pointId', 'memberId'] },
				separate: true,
				order: [[col('processedAt'), 'desc']]
			},
			{
				association: db.Member.associations.visits,
				attributes: ['visitDate', 'memberVisitId'],
				separate: true,
				order: [[col('visitDate'), 'desc']]
			}
		],
		transaction
	})

export const findMemberByLineId = async (lineId: string, transaction?: Transaction) =>
	db.Member.findOne({
		where: { lineId: lineId },
		transaction
	})

// Get member instance model
export const findMemberById = async (memberId: number, transaction?: Transaction) => {
	const memberAttributes = await db.MemberAttribute.listMemberAttributes()
	return await db.Member.findByPk(memberId, {
		attributes: {
			include: memberAttributes.map((cR) => `memberAttributeId${cR.memberAttributeId}`),
			exclude: ['lineId']
		},
		include: [
			{
				association: db.Member.associations.points,
				attributes: { include: ['processedAt'], exclude: ['pointId', 'memberId'] },
				separate: true,
				order: [[col('processedAt'), 'desc']]
			},
			{
				association: db.Member.associations.visits,
				attributes: ['visitDate', 'memberVisitId'],
				separate: true,
				order: [[col('visitDate'), 'desc']]
			}
		],
		transaction
	})
}

export const countOtherMemberByEmail = async (
	memberId: number,
	email: string,
	emailAttributeId: number,
	transaction?: Transaction
) =>
	db.Member.count({
		where: {
			memberId: { [Op.ne]: memberId },
			memberCode: { [Op.not]: null },
			[literal(`attributeId${emailAttributeId}`) as unknown as string]: email
		},
		transaction
	})

export const browseMembers = async (
	{ pagination, memberWhere }: { pagination: paginationParams; memberWhere: WhereAttributeHash },
	transaction?: Transaction
) => {
	const count = await db.Member.count({
		where: memberWhere,
		transaction
	})
	if (count == 0) return { count, rows: [] }
	const rows = await db.Member.findAll({
		where: memberWhere,
		attributes: {
			exclude: ['lineId']
		},
		include: {
			separate: true,
			attributes: ['campaignQuestionId', 'contents']
		},
		limit: pagination.pp,
		offset: (pagination.p - 1) * pagination.pp,
		order: [[pagination.sortKey, pagination.sort]],
		transaction
	})
	return { count, rows }
}

export const listMembers = async (memberWhere?: WhereAttributeHash, transaction?: Transaction) =>
	db.Member.findAll({
		where: memberWhere,
		attributes: { exclude: ['lineId'] },
		transaction
	})

export const createMember = async (params: CreationAttributes<Member>, transaction?: Transaction) =>
	db.Member.create(params, { transaction })

export const updateMember = async (
	{ memberId, params }: { memberId: number; params: Attributes<Member> },
	transaction?: Transaction
) => db.Member.update(params, { where: { memberId: memberId }, transaction })

export const deleteMember = async (
	memberId: number,
	unlinkRichMenuFromUser: (typeof LineService)['unlinkRichMenuFromUser'],
	transaction?: Transaction
) =>
	db.Member.findByPk(memberId, {
		include: [
			{
				association: db.Member.associations.chats
			}
		],
		transaction
	})
		.then(async (member) => {
			if (member == null) throw new AppError(SYSTEM_ERROR, `member ${memberId} not exist`, false)
			if (member.curRM == 'memberRM' && member.lineId) await unlinkRichMenuFromUser({ userId: member.lineId })
			return member
		})
		.then((member) => member.destroy({ transaction }))

export const updateMemberCustomAttributes = async ({
	member,
	updatedAttributes,
	files,
	transaction
}: {
	member: Member
	updatedAttributes: { [memberAttributeId: string]: unknown }
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined
	transaction: Transaction
}) => {
	try {
		const memberAttributes = await db.MemberAttribute.listMemberAttributes({ isAdminDisplayed: true })
		const sanitizedAttributeValues = CommonUtil.sanitizeValidMemberAttributes(updatedAttributes)
		if (Object.keys(sanitizedAttributeValues).length == 0) return

		const dataMember: typeof updatedAttributes = {}
		const oldImagesNames: string[] = []
		memberAttributes.forEach((item) => {
			const key = `memberAttributeId${item.memberAttributeId}`
			if (!Object.hasOwn(updatedAttributes, key)) return

			dataMember[key as keyof typeof dataMember] = safeParseCustomMemberAttributeData({
				item,
				data: updatedAttributes[key as keyof typeof updatedAttributes],
				files
			})

			// Remove old image since we're replacing it with a new
			if (item.type === 'image') {
				const oldImageName = member[key as keyof Member]
				if (!oldImageName) return
				oldImagesNames.push(
					systemConfig.PATH_FILE_UPLOAD_MEMBER_ATTRIBUTE_ID(String(item.memberAttributeId)) +
						`/${oldImageName}`
				)
			}
		})
		// Async operation that we don't need to wait for
		if (oldImagesNames.length > 0)
			// eslint-disable-next-line promise/catch-or-return
			Promise.allSettled(oldImagesNames.map((oldImagePath) => FileUtils.deleteFile(oldImagePath)))

		// Only add enabled custom registrations
		if (Object.keys(dataMember).length) {
			let updateQuery = 'UPDATE members SET'
			Object.keys(dataMember)?.forEach((item, index) => {
				updateQuery += ` ${item} = :${item}`
				// If not the last item, append with comma
				if (Object.keys(dataMember)?.length !== index + 1) {
					updateQuery += ','
				}
			})
			updateQuery += ' WHERE memberId = :memberId'

			await db.sequelize.query(updateQuery, {
				replacements: { ...dataMember, memberId: member.memberId },
				type: QueryTypes.UPDATE,
				transaction
			})
		}
	} catch (e) {
		// We don't need to handle this here, but log it
		writeLog({ msg: 'Error trying to setMemberAttributes:', err: e }, 'error')
		throw e
	}
}
export const bulkRemoveMemberAttributeByIds = async (memberAttributeIds: number[], transaction?: Transaction) =>
	db.MemberAttribute.destroy({
		where: { memberAttributeId: { [Op.in]: memberAttributeIds } },
		transaction
	})
export const removeMemberAttributeById = async (memberAttributeId: number, transaction: Transaction) =>
	db.sequelize.getQueryInterface().removeColumn('members', `memberAttributeId${memberAttributeId}`, {
		transaction
	})

export const setRichmenuOfMember = async (
	{ member, type }: { member: Member; type: richmenuType },
	linkRichMenuToUser: (typeof LineService)['linkRichMenuToUser'],
	transaction?: Transaction
) => {
	const richMenuTabGroupWhere: WhereAttributeHash<RichMenuTabGroup> = {}
	if (type === 'defaultRM') richMenuTabGroupWhere.displayPriority = 'DEFAULT'
	else richMenuTabGroupWhere.displayPriority = 'USER'
	const memberRM = await db.Richmenu.findOne({
		where: { tabIndex: 0 },
		transaction,
		include: {
			association: db.Richmenu.associations.RichMenuTabGroup,
			where: richMenuTabGroupWhere
		}
	})
	if (memberRM != null && memberRM.richMenuId !== null)
		await linkRichMenuToUser({ userId: member.lineId as string, richmenuId: memberRM.richMenuId })
}
