import json2csv from 'json2csv'
import { WhereAttributeHash, Transaction, col, Op, where, fn } from 'sequelize'
import { db } from '../models'
import type { MemberAttribute } from '../models/memberAttribute.model'
import moment from 'moment'
import { countUniqueDayMemberVisits } from './visits.service'
import { listMemberAttributes } from './attribute.service'

export const generateMemberCsvData = async (members: Record<string, any>[], memberAttributes: MemberAttribute[]) => {
	const csvData = members.map((memberInfo) => {
		const countVisit = countUniqueDayMemberVisits(memberInfo.visits)
		const lastVisit = countVisit ? memberInfo.visits?.[0] : null

		const memberInfoExport: Record<string, string> = {
			ID: `${memberInfo.memberId ?? ''}`,
			会員コード: memberInfo.memberCode ?? '',
			LINE名: memberInfo.displayName ?? '',
			備考欄: memberInfo.remarks ?? '',
			来店回数: (countVisit || 'ー') + '回',
			最終来店日: lastVisit ? moment(lastVisit?.visitDate).format('YYYY年M月D日') : 'ー',
			ポイント: memberInfo.kakeruPoint ? String(memberInfo.kakeruPoint) : '0',
			友だち登録日: memberInfo.createdAt ? moment(memberInfo.createdAt).format('YYYY年M月D日') : 'ー',
			会員登録日: memberInfo.memberSince ? moment(memberInfo.memberSince).format('YYYY年M月D日') : 'ー',
			有効期限: memberInfo.activeUntil ? moment(memberInfo.activeUntil).format('YYYY年M月D日') : 'ー'
		}
		memberAttributes.forEach((memberAttribute) => {
			const memberAttributeValue = memberInfo[`memberAttributeId${memberAttribute?.memberAttributeId}`]
			if (memberAttribute?.archType === 'date' || memberAttribute?.type === 'datetime') {
				memberInfoExport[memberAttribute?.label] = memberAttributeValue
					? moment(memberAttributeValue).format('YYYY年M月D日')
					: 'ー'
			} else if (memberAttribute.isAttributeTypeAddress()) {
				if (memberAttribute.isAttributeAddressMain()) {
					memberInfoExport[memberAttribute?.label] = memberAttributes
						.filter((a) => a.section === memberAttribute.section)
						.map((a) => memberInfo[`memberAttributeId${a?.memberAttributeId}`])
						.join('')
				}
			} else {
				memberInfoExport[memberAttribute?.label] = memberAttributeValue
			}
		})
		return memberInfoExport
	})
	const fields = [
		'ID',
		'会員コード',
		'LINE名',
		...memberAttributes
			// we only want to export the first address
			.filter((a) => !a.isAttributeTypeAddress() || (a.isAttributeTypeAddress() && a.isAttributeAddressMain()))
			.map((cR) => cR?.label),
		'備考欄',
		'来店回数',
		'最終来店日',
		'ポイント',
		'友だち登録日',
		'会員登録日',
		'有効期限'
	]
	const opts = { fields: fields, withBOM: true, excelStrings: true }
	const csv = json2csv.parse(csvData, opts)
	return csv
}

export const getMemberDataList = async (memberWhere: WhereAttributeHash, transaction?: Transaction) => {
	const memberAttributes = await listMemberAttributes()

	return db.Member.findAll({
		where: memberWhere,
		attributes: {
			include: memberAttributes.map((cR) => `memberAttributeId${cR.memberAttributeId}`),
			exclude: ['lineId']
		},
		raw: true,
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

export function generateMemberSearchFilter(
	params: WhereAttributeHash,
	{
		isCampaign,
		// hasWon,
		// candidateAtMin,
		// candidateAtMax,
		memberSinceMin,
		memberSinceMax,
		memberId,
		memberIds,
		telephone,
		address,
		email,
		name
	}: Record<string, string | boolean | number | undefined>
): WhereAttributeHash {
	const memberWhere: any = params
	if (isCampaign) {
		memberWhere.isCampaign = isCampaign === 'true' || isCampaign === true ? true : false
	}
	// if (hasWon != undefined) {
	// 	if (hasWon === 'true' || hasWon === true) {
	// 		memberWhere.candidateAt = { [Op.not]: null }
	// 	} else if (hasWon === 'false' || hasWon === false) {
	// 		memberWhere.candidateAt = null
	// 	}
	// }

	// if (candidateAtMin && candidateAtMax) {
	// 	memberWhere.candidateAt = { [Op.between]: [candidateAtMin, candidateAtMax] }
	// } else if (candidateAtMin) {
	// 	memberWhere.candidateAt = { [Op.gte]: candidateAtMin }
	// } else if (candidateAtMax) {
	// 	memberWhere.candidateAt = { [Op.lte]: candidateAtMax }
	// }

	if (memberSinceMin && memberSinceMax) {
		memberWhere.memberSince = { [Op.between]: [memberSinceMin, memberSinceMax] }
	} else if (memberSinceMin) {
		memberWhere.memberSince = { [Op.gte]: memberSinceMin }
	} else if (memberSinceMax) {
		memberWhere.memberSince = { [Op.lte]: memberSinceMax }
	}

	if (memberId != undefined && memberId != '') {
		memberWhere.memberId = { [Op.eq]: memberId }
	} else if (Array.isArray(memberIds) && memberIds.length > 0) {
		memberWhere.memberId = { [Op.in]: memberIds }
	}

	if (typeof telephone == 'string' && telephone.length > 0) {
		memberWhere.telephone = { [Op.substring]: telephone }
	}
	if (typeof address == 'string' && address.length > 0) {
		if (memberWhere[Op.or] == null) {
			memberWhere[Op.or] = []
		}
		memberWhere[Op.or].push(
			{ address: { [Op.substring]: address } },
			{ postalCode: { [Op.substring]: address } },
			{ building: { [Op.substring]: address } }
		)
	}
	if (typeof email == 'string' && email.length > 0) {
		memberWhere.email = { [Op.substring]: email }
	}
	if (typeof name == 'string' && name.length > 0) {
		if (memberWhere[Op.and] == undefined) {
			memberWhere[Op.and] = []
		}
		//TODO: reimplement this
		memberWhere[Op.and].push({
			[Op.or]: [
				where(
					fn(
						'LOWER',
						fn(
							'CONCAT',
							fn('IFNULL', col('Member.lastName'), ''),
							fn('IFNULL', col('Member.firstName'), '')
						)
					),
					{ [Op.substring]: `%${name.replace(/\s+/g, '').toLocaleLowerCase()}%` }
				),
				where(
					fn(
						'LOWER',
						fn(
							'CONCAT',
							fn('IFNULL', col('Member.lastNameKana'), ''),
							fn('IFNULL', col('Member.firstNameKana'), '')
						)
					),
					{ [Op.substring]: `%${name.replace(/\s+/g, '').toLocaleLowerCase()}%` }
				),
				{ displayName: { [Op.substring]: name } }
			]
		})
	}
	return memberWhere
}
