import { col, CreationAttributes, Transaction } from 'sequelize'
import { SYSTEM_ERROR } from '../config'
import { AppError, CommonUtil } from '../utilities'
import { db } from '../models'
import type { Chat } from '../models/chat.model'
import type { Member } from '../models/member.model'
import type * as LineService from './line.service'

export const createChatFromMember = async (
	{
		member,
		contents,
		contentType,
		source
	}: { member: Member; contents: string; contentType: chatContentType; source: 'user' },
	transaction?: Transaction
) => {
	let messages: CreationAttributes<Chat>[] = []
	const textMessageMaxLength = 1000
	if (contentType == 'text' && contents.length > textMessageMaxLength) {
		const segments = CommonUtil.divideString(contents, textMessageMaxLength)
		messages = segments.map((segment) => ({ memberId: member.memberId, contents: segment, contentType, source }))
		const bulkCreateBatchSize = 50
		if (messages.length == 1) {
			await db.Chat.create(messages[0], { transaction })
		} else if (messages.length > 1) {
			for (let i = 0; i < messages.length; i += bulkCreateBatchSize) {
				const batch = messages.slice(i, i + bulkCreateBatchSize)
				await db.Chat.bulkCreate(batch, { transaction })
			}
		}
		await member.increment('unreadCount', { transaction })
		return
	} else {
		return await Promise.all([
			db.Chat.create({ memberId: member.memberId, contents, contentType, source }, { transaction }),
			member.increment('unreadCount', { transaction })
		])
	}
}

export const getChat = async (memberId: number, transaction?: Transaction) => {
	const [affectedCount] = await db.Member.update(
		{ unreadCount: 0 },
		{
			where: { memberId },
			transaction
		}
	)
	const chats = await db.Chat.findAll({
		where: { memberId },
		order: [[col('chatId'), 'asc']],
		transaction
	})
	return [affectedCount, chats]
}

export const replyChat = async (
	memberId: number,
	contents: string,
	methods: { sendMessage: (typeof LineService)['sendMessage'] },
	transaction?: Transaction
) => {
	const member = await db.Member.findByPk(memberId, { transaction })

	if (member == null || member.lineId == null)
		throw new AppError(SYSTEM_ERROR, `member ${memberId} does not exist or no lineId`, false)

	await Promise.all([
		methods.sendMessage(member.lineId as string, contents),
		db.Chat.create(
			{ memberId: member.memberId, contents: contents, contentType: 'text', source: 'manager' },
			{ transaction }
		)
	])
}
