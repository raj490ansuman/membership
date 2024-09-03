import { Client, AudienceGroupStatus, AudienceGroups } from '@line/bot-sdk'
import moment from 'moment'
import { type Attributes, QueryTypes } from 'sequelize'
import { lineConfig } from '../config'
import { SocketUtil } from '../utilities'
import { db } from '../models'
import type { Audience } from '../models/audience.model'
import type { Member } from '../models/member.model'

const lineBotClient = new Client({
	channelSecret: lineConfig.LINE_CHANNEL_SECRET,
	channelAccessToken: lineConfig.LINE_CHANNEL_ACCESS_TOKEN
})

///Audience
export const createAudience = async (createParams: audienceCreateType) => {
	const audienceName = createParams.audienceName
	if (!audienceName) {
		throw new Error('audience name not provided')
	}
	const lineIds = await findMembersForAudience(createParams)
	if (lineIds.length == 0) {
		throw new Error('lineId not provided')
	}
	const members = lineIds.map((a) => ({ id: a.lineId as string }))
	const audienceAPI = await lineBotClient.createUploadAudienceGroup({
		description: createParams.audienceName,
		audiences: members
	})

	await db.Audience.create({
		audienceGroupId: audienceAPI.audienceGroupId,
		description: createParams.audienceName,
		audienceCount: members.length,
		searchCondition: createParams
	})

	SocketUtil.emitAudience({ audienceGroupId: audienceAPI.audienceGroupId })

	return members
}

export const listAudiences = async () => {
	const audiencesDB = await db.Audience.findAll({ attributes: ['audienceGroupId', 'remarks', 'searchCondition'] })
	const audiencesAPI = await getAudiencesFromAPI(1)
	const result: (Attributes<Audience> & { status: AudienceGroupStatus; created: number })[] = []
	audiencesDB.forEach((aDB) => {
		const aAPI = audiencesAPI.find((aud) => aud.audienceGroupId == aDB.audienceGroupId)
		if (aAPI != undefined) {
			result.push({
				audienceGroupId: aAPI.audienceGroupId,
				description: aAPI.description,
				status: aAPI.status,
				audienceCount: aAPI.audienceCount,
				created: aAPI.created,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				expireTimestamp: aAPI.expireTimestamp,
				searchCondition: aDB.searchCondition,
				remarks: aDB.remarks
			})
		}
	})
	result.sort((a, b) => b.created - a.created)
	return result
}

export const searchAudience = async (searchParams: audienceSearchType) => {
	const resultCount = await findMembersForAudience(searchParams)
	return { count: resultCount.length }
}

export const deleteAudience = async (audienceGroupId: string) => {
	await lineBotClient.deleteAudienceGroup(audienceGroupId)
	await db.Audience.destroy({ where: { audienceGroupId: audienceGroupId } })
	return
}

const getAudiencesFromAPI = async (page = 1, description?: string): Promise<AudienceGroups> => {
	const fragment = await lineBotClient.getAudienceGroups(page, description, undefined, 40, undefined, false)
	if (fragment.hasNextPage) {
		return fragment.audienceGroups.concat(await getAudiencesFromAPI(page + 1))
	} else {
		return fragment.audienceGroups
	}
}

const findMembersForAudience = async (searchParams: audienceSearchType & { [key: string]: any }) => {
	let bindParams: Record<string, string | number | boolean> = {}
	const membersWhere = []

	if ('isCampaign' in searchParams && searchParams.isCampaign != undefined) {
		membersWhere.push('isCampaign = :isCampaign')
		bindParams.isCampaign = searchParams.isCampaign
	}
	if (searchParams.candidateAtMin && searchParams.candidateAtMax) {
		membersWhere.push('candidateAt BETWEEN :candidateAtMin AND :candidateAtMax')
		bindParams.candidateAtMin = moment(searchParams.candidateAtMin).format('YYYY-MM-DD HH:mm:ss')
		bindParams.candidateAtMax = moment(searchParams.candidateAtMax).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.candidateAtMin) {
		membersWhere.push('candidateAt >= :candidateAtMin')
		bindParams.candidateAtMin = moment(searchParams.candidateAtMin).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.candidateAtMax) {
		membersWhere.push('candidateAt <= :candidateAtMax')
		bindParams.candidateAtMax = moment(searchParams.candidateAtMax).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.hasWon != undefined) {
		membersWhere.push(searchParams.hasWon ? 'candidateAt IS NOT NULL' : 'candidateAt IS NULL')
	}
	if (searchParams.address) {
		membersWhere.push('(address LIKE :address OR building LIKE :address OR postalCode LIKE :address)')
		bindParams.address = `%${searchParams.address}%`
	}
	if (searchParams.createdAtMin && searchParams.createdAtMax) {
		membersWhere.push('createdAt BETWEEN :createdAtMin AND :createdAtMax')
		bindParams.createdAtMin = moment(searchParams.createdAtMin).format('YYYY-MM-DD HH:mm:ss')
		bindParams.createdAtMax = moment(searchParams.createdAtMax).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.createdAtMin) {
		membersWhere.push('createdAt >= :createdAtMin')
		bindParams.createdAtMin = moment(searchParams.createdAtMin).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.createdAtMax) {
		membersWhere.push('createdAt <= :createdAtMax')
		bindParams.createdAtMax = moment(searchParams.createdAtMax).format('YYYY-MM-DD HH:mm:ss')
	}
	if (searchParams.memberSinceMin && searchParams.memberSinceMax) {
		membersWhere.push('memberSince BETWEEN :memberSinceMin AND :memberSinceMax')
		bindParams.memberSinceMin = moment(searchParams.memberSinceMin).format('YYYY-MM-DD HH:mm:ss')
		bindParams.memberSinceMax = moment(searchParams.memberSinceMax).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.memberSinceMin) {
		membersWhere.push('memberSince >= :memberSinceMin')
		bindParams.memberSinceMin = moment(searchParams.memberSinceMin).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.memberSinceMax) {
		membersWhere.push('memberSince <= :memberSinceMax')
		bindParams.memberSinceMax = moment(searchParams.memberSinceMax).format('YYYY-MM-DD HH:mm:ss')
	}
	if (searchParams.lastVisitMin && searchParams.lastVisitMax) {
		membersWhere.push('lastVisit BETWEEN :lastVisitMin AND :lastVisitMax')
		bindParams.lastVisitMin = moment(searchParams.lastVisitMin).format('YYYY-MM-DD HH:mm:ss')
		bindParams.lastVisitMax = moment(searchParams.lastVisitMax).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.lastVisitMin) {
		membersWhere.push('lastVisit >= :lastVisitMin')
		bindParams.lastVisitMin = moment(searchParams.lastVisitMin).format('YYYY-MM-DD HH:mm:ss')
	} else if (searchParams.lastVisitMax) {
		membersWhere.push('lastVisit <= :lastVisitMax')
		bindParams.lastVisitMax = moment(searchParams.lastVisitMax).format('YYYY-MM-DD HH:mm:ss')
	}
	if (searchParams.categoryId) {
		membersWhere.push('Registration.categoryId = :categoryId')
		bindParams.categoryId = searchParams.categoryId
	}
	if (searchParams.occasionId) {
		membersWhere.push('Registration.occasionId = :occasionId')
		bindParams.occasionId = searchParams.occasionId
	}

	if (searchParams.messages) {
		if (searchParams.messages.toLocaleLowerCase() === 'read') {
			membersWhere.push('unreadCount = 0')
		} else {
			membersWhere.push('unreadCount > 0')
		}
	}
	if (searchParams.isFriends !== undefined) {
		membersWhere.push('isFriends = :isFriends')
		bindParams.isFriends = searchParams.isFriends
	}
	if (searchParams.isRegistered !== undefined) {
		if (String(searchParams.isRegistered) === 'true') {
			membersWhere.push('memberCode IS NOT NULL')
		} else {
			membersWhere.push('memberCode IS NULL')
		}
	}
	// convert parameter string to int
	for (const key in bindParams) {
		// eslint-disable-next-line security/detect-object-injection
		const val = bindParams[key]
		// eslint-disable-next-line security/detect-object-injection
		bindParams[key] = !isNaN(val as number) ? parseInt(val as string) : val
	}

	// Get all member attributes
	const memberAttributes = await db.MemberAttribute.listMemberAttributes({ isAdminDisplayed: true })

	const addressAttributeIds = memberAttributes
		.filter((attribute) => attribute.isAttributeTypeAddress())
		.map((a) => a.memberAttributeId.toString())

	// Filter incoming custom registration filters
	const memberAttributeFilterKeys = Object.keys(searchParams).filter((key) => key.startsWith('memberAttributeFilter'))
	const memberAttributeWhereReplacements: { [key: string]: any } = {}

	memberAttributeFilterKeys.forEach((filterKey) => {
		const filterValue = searchParams[filterKey as string]
		if (!filterValue || filterValue?.length === 0) return

		// Trim beginning filter name but will still preserve Min/Max if exists
		const memberAttributeId = filterKey.substring('memberAttributeFilter'.length)

		// Handle multiple selection filter
		if (Array.isArray(filterValue)) {
			// Check each option in multiple selection
			const selectedValues = filterValue.map((value) => `memberAttributeId${memberAttributeId} LIKE '%${value}%'`)
			if (selectedValues.length > 1) {
				membersWhere.push(selectedValues.join(' OR '))
			} else {
				membersWhere.push(...selectedValues)
			}
			return
		}

		// Handle filtering by uploaded image input
		const filterValueAsStr = String(filterValue)
		if (filterValueAsStr.includes('Image')) {
			if (filterValueAsStr.includes('hasImage')) {
				return membersWhere.push(`memberAttributeId${memberAttributeId} IS NOT NULL`)
			} else if (filterValueAsStr.includes('noImage')) {
				return membersWhere.push(`memberAttributeId${memberAttributeId} IS NULL`)
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
			membersWhere.push(`memberAttributeId${actualId} >= :${filterKey}`)
		} else if (memberAttributeId.endsWith('Max')) {
			const actualId = memberAttributeId.substring(0, memberAttributeId.length - 3) // Trim trailing 'Max'
			membersWhere.push(`memberAttributeId${actualId} <= :${filterKey}`)
		} else if (addressAttributeIds.includes(memberAttributeId)) {
			const memberAttribute = memberAttributes.find((a) => a.memberAttributeId === Number(memberAttributeId))
			if (!memberAttribute) throw new Error('invalid member attribute id' + memberAttributeId)
			const attributeIdsOfSameSection = memberAttributes
				.filter((attribute) => attribute.section === memberAttribute.section)
				.map((a) => `memberAttributeId${a.memberAttributeId}`)
			membersWhere.push(`CONCAT(${attributeIdsOfSameSection.join(', ')}) LIKE :${filterKey}`)
		} else {
			// Simple matching of alphanumeric input
			membersWhere.push(`memberAttributeId${memberAttributeId} LIKE :${filterKey}`)
		}
	})

	bindParams = {
		...bindParams,
		...memberAttributeWhereReplacements
	}

	let querySqlData = ''

	let select = `
	members.lineId,
	members.createdAt,
	members.memberSince,
	members.unreadCount,
	members.memberCode,
	members.isFriends,
	MAX(visits.visitDate) AS lastVisit`

	memberAttributes.forEach((item) => {
		select += `, members.memberAttributeId${item?.memberAttributeId}`
	})

	querySqlData = `SELECT DISTINCT ${select}
			FROM members as members
			LEFT JOIN memberVisits AS visits
				ON members.memberId = visits.memberId 
			WHERE lineId IS NOT NULL
			GROUP BY members.memberId ${membersWhere.length > 0 ? 'HAVING ' + membersWhere.join(' AND ') : ''}`

	const membersData: Attributes<Member>[] = await db.sequelize.query(`${querySqlData}`, {
		replacements: bindParams,
		type: QueryTypes.SELECT
	})

	const memberLineIds = membersData.filter((m) => m.lineId != null)
	return memberLineIds
}
