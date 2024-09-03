import { CreationAttributes, Op, Transaction, WhereAttributeHash } from 'sequelize'
import momentTimezone from 'moment-timezone'
import { db } from '../models'
import { Reminder } from '../models/reminder.model'

export const createReminder = async (
	params: CreationAttributes<Reminder> & {
		startAt: string | Date
		fullName: string
		telephone?: string | null
		confirmationUrl?: string | null
		buildingInfo: string
		timeZone: string
	},
	regexps: {
		replacerName: RegExp
		replacerDateTime: RegExp
		replacerTelephoneCompany: RegExp
		replacerConfirmationUrl: RegExp
		replacerBuilding: RegExp
	},
	transaction?: Transaction
) => {
	const messageToClient = params.message
	let reminderMessage = messageToClient.replace(regexps.replacerName, `${params.fullName}`)
	reminderMessage = reminderMessage.replace(
		regexps.replacerDateTime,
		params.startAt ? momentTimezone(params.startAt).tz(params.timeZone).format('YYYY年MM月DD日HH時mm分') : ''
		// moment(params.startAt).format('YYYY年MM月DD日HH時mm分')
	)
	reminderMessage = reminderMessage.replace(regexps.replacerTelephoneCompany, `${params.telephone ?? ''}`)
	reminderMessage = reminderMessage.replace(regexps.replacerConfirmationUrl, `${params.confirmationUrl ?? ''}`)
	reminderMessage = reminderMessage.replace(regexps.replacerBuilding, params.buildingInfo)
	return await db.Reminder.create(
		{
			memberId: params.memberId,
			message: reminderMessage,
			remindDT: params.remindDT,
			key: params.key
		},
		{ transaction }
	)
}

export const getReminders = async (where: WhereAttributeHash, transaction?: Transaction) => {
	return db.Reminder.findAll({
		where: where,
		include: {
			association: db.Reminder.associations.Member,
			where: {
				lineId: { [Op.not]: null },
				isFriends: true
			},
			required: true,
			attributes: ['lineId']
		},
		transaction
	})
}

export const destroyReminders = async (reminderIds: number[], transaction?: Transaction) => {
	if (reminderIds.length == 0) {
		return
	}
	return db.Reminder.destroy({
		where: { reminderId: { [Op.in]: reminderIds } },
		transaction
	})
}
