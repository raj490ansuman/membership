import { CreationAttributes, Op, Transaction, WhereAttributeHash } from 'sequelize'
import { db } from '../models'
import { Spectator } from '../models/spectator.model'

export const listSpectatorsByWatch = async (
	watch: 'campaign' | 'member' | 'registration',
	transaction?: Transaction
) => {
	let spectatorWhere: WhereAttributeHash | null = null
	switch (watch) {
		case 'campaign':
			spectatorWhere = { isSpectatingCampaign: true }
			break
		case 'member':
			spectatorWhere = { isSpectatingMember: true }
			break
		case 'registration':
			spectatorWhere = { isSpectatingRegistration: true }
			break
		default:
			break
	}
	if (spectatorWhere != null) {
		return await db.Spectator.findAll({
			where: spectatorWhere,
			attributes: ['memberId'],
			include: {
				association: db.Spectator.associations.Member,
				attributes: ['lineId']
			},
			transaction
		})
	} else {
		return []
	}
}

export const listSpectatorCandidates = async (transaction?: Transaction) => {
	const existingSpectators = await db.Spectator.findAll({
		attributes: ['spectatorId', 'memberId'],
		transaction
	})
	let spectators = []
	if (existingSpectators.length == 0) {
		spectators = await db.Member.findAll({
			where: { lineId: { [Op.not]: null }, isFriends: true },
			attributes: ['memberId', 'displayName', 'picUrl'],
			transaction
		})
	} else {
		spectators = await db.Member.findAll({
			where: {
				memberId: { [Op.notIn]: existingSpectators.map((s) => s.memberId) },
				lineId: { [Op.not]: null },
				isFriends: true
			},
			attributes: ['memberId', 'displayName', 'picUrl'],
			transaction
		})
	}
	return spectators
}

export const listSpectators = async (transaction?: Transaction) =>
	db.Spectator.findAll({
		attributes: { exclude: ['createdAt', 'updatedAt'] },
		include: {
			association: db.Spectator.associations.Member,
			attributes: ['memberId', 'memberCode', 'displayName', 'picUrl', 'memberInfo']
		},
		transaction
	})

export const bulkEditSpectators = async (members: CreationAttributes<Spectator>[], transaction?: Transaction) => {
	const membersDB = await db.Member.findAll({
		attributes: ['memberId'],
		where: {
			memberId: { [Op.in]: members.map((m) => m.memberId as number) },
			isFriends: true
		},
		transaction
	})
	if (membersDB.length > 0) {
		members = members.filter((m) => membersDB.some((mDB) => m.memberId == mDB.memberId))
		return await db.Spectator.bulkCreate(members, {
			fields: ['memberId', 'isSpectatingMember', 'isSpectatingCampaign', 'isSpectatingRegistration'],
			updateOnDuplicate: ['isSpectatingMember', 'isSpectatingCampaign', 'isSpectatingRegistration'],
			transaction
		})
	} else {
		return []
	}
}

export const deleteSpectator = async (spectatorId: number, transaction?: Transaction) =>
	db.Spectator.destroy({ where: { spectatorId }, transaction })

export const getSpectatorNotificationTemplates = async (transaction?: Transaction) => {
	const spectatorNotificationTemplates = await db.SystemSetting.findAll({
		where: {
			name: {
				[Op.in]: ['watchMemberTemplate', 'watchRegistrationTemplate', 'watchRegistrationCancelTemplate']
			}
		},
		transaction
	})
	return {
		watchMemberTemplate: spectatorNotificationTemplates.find((t) => t.name == 'watchMemberTemplate') ?? null,
		watchRegistrationTemplate:
			spectatorNotificationTemplates.find((t) => t.name == 'watchRegistrationTemplate') ?? null,
		watchRegistrationCancelTemplate:
			spectatorNotificationTemplates.find((t) => t.name == 'watchRegistrationCancelTemplate') ?? null
	}
}

export const getSpectatorNotificationTemplate = async (key: string, transaction?: Transaction) =>
	db.SystemSetting.findByPk(key, { transaction })
