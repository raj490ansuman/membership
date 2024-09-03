import {
	Client,
	FlexContainer,
	FlexMessage,
	ImageMessage,
	Message,
	Profile,
	RichMenu,
	TextMessage,
	TemplateContent,
	TemplateMessage
} from '@line/bot-sdk'
import mime from 'mime-types'
import { lineConfig } from '../config'
import { CommonUtil, writeLog, AxiosUtil } from '../utilities'
import { db } from '../models'

const lineBotClient = new Client({
	channelSecret: lineConfig.LINE_CHANNEL_SECRET,
	channelAccessToken: lineConfig.LINE_CHANNEL_ACCESS_TOKEN
})

const checkIfFriends = async (lineId: string) =>
	lineBotClient
		.getProfile(lineId)
		.then((profile) => (profile ? true : false))
		.catch(() => false)

const getProfile = async (lineId: string) => lineBotClient.getProfile(lineId).catch(() => null)

const sendReminders = async (registrations: { lineId: string; message: string }[]) =>
	await Promise.all(
		registrations.map(async (r) => {
			await sendMessage(r.lineId, r.message).catch((err) =>
				writeLog(
					`failed to send message on sendReminders ${r.lineId}, ${r.message.length}. ${err.message}`,
					'crit'
				)
			)
		})
	)

const replyMessage = async (replyToken: string, messages: Message | Message[], isNotificationDisabled = false) =>
	lineBotClient.replyMessage(replyToken, messages, isNotificationDisabled)

const sendMessage = async (lineId: string, message: string) =>
	lineBotClient.pushMessage(lineId, CreateTextMessage(message))
const sendFlexMessage = async (lineId: string, message: FlexContainer) =>
	lineBotClient.pushMessage(lineId, CreateFlexMessage(message))
const sendImageMessage = async (lineId: string, url: string) =>
	lineBotClient.pushMessage(lineId, CreateImageMessage(url))
const sendTemplateMessage = async (lineId: string, altText: string, template: TemplateContent) =>
	lineBotClient.pushMessage(lineId, CreateTemplateMessage(altText, template))

const sendMulticastMessage = async (lineIds: string[], message: string) => {
	lineIds.length == 1
		? lineBotClient.pushMessage(lineIds[0], CreateTextMessage(message))
		: lineBotClient.multicast(lineIds, CreateTextMessage(message))
}

const CreateFlexText = (t: string, wrap = true, align: 'start' | 'center' | 'end' = 'start'): FlexMessage => {
	return {
		type: 'flex',
		altText: t,
		contents: {
			type: 'bubble',
			direction: 'ltr',
			body: {
				type: 'box',
				layout: 'vertical',
				contents: [{ type: 'text', text: t, align: align, wrap: wrap }]
			}
		}
	}
}

const getBotFollowerIds = async (nextToken?: string, limit = 1000) =>
	AxiosUtil.requestHttp<{ userIds: string[]; next: string }>({
		url: 'https://api.line.me/v2/bot/followers/ids',
		params: { limit: limit, start: nextToken },
		headers: { Authorization: 'Bearer ' + lineConfig.LINE_CHANNEL_ACCESS_TOKEN }
	})
		.then((response) => response.data)
		.catch((e) => {
			if (e.response.status == 403) return { userIds: [], next: null } //bot plan needs to be either verified or premium
			throw e
		})

const CreateTextMessage = (t: string): TextMessage => {
	return {
		type: 'text',
		text: t
	}
}
const CreateFlexMessage = (content: FlexContainer): FlexMessage => {
	return {
		type: 'flex',
		altText: 'event',
		contents: content
	}
}
const CreateImageMessage = (url: string): ImageMessage => {
	return {
		type: 'image',
		originalContentUrl: url,
		previewImageUrl: url
	}
}

const CreateTemplateMessage = (altText: string, template: TemplateContent): TemplateMessage => {
	return {
		type: 'template',
		altText: altText,
		template: template
	}
}
//Richmenu
const linkRichMenuToUser = ({ userId, richmenuId }: { userId: string; richmenuId: string }) =>
	lineBotClient.linkRichMenuToUser(userId, richmenuId)

const linkRichMenuToMultipleUsers = async ({ userIds, richmenuId }: { userIds: string[]; richmenuId: string }) => {
	if (userIds.length === 0) return
	const batches = CommonUtil.divideArray(userIds, lineConfig.BULK_LINK_RICH_MENU_USER_IDS_MAX_COUNT)
	await Promise.allSettled(
		batches.map(async (batch) => lineBotClient.linkRichMenuToMultipleUsers(richmenuId, batch))
	).then((results) =>
		results.forEach((r, i) => {
			if (r.status === 'fulfilled') return
			writeLog(
				`linkRichMenuToMultipleUsers failed at ${i}.\nreason:${r.reason}\nIds:${batches[
					i as number
				].toString()}`,
				'crit'
			)
		})
	)
}

const unlinkRichMenuFromUser = ({ userId }: { userId: string }) => lineBotClient.unlinkRichMenuFromUser(userId)

const unlinkRichMenusFromMultipleUsers = async ({ userIds }: { userIds: string[] }) => {
	if (userIds.length === 0) return
	const batches = CommonUtil.divideArray(userIds, lineConfig.BULK_LINK_RICH_MENU_USER_IDS_MAX_COUNT)
	await Promise.allSettled(batches.map(async (batch) => lineBotClient.unlinkRichMenusFromMultipleUsers(batch))).then(
		(results) =>
			results.forEach((r, i) => {
				if (r.status === 'fulfilled') return
				writeLog(
					`linkRichMenuToMultipleUsers failed at ${i}.\nreason:${r.reason}\nIds:${batches[
						i as number
					].toString()}`,
					'crit'
				)
			})
	)
}

const setDefaultRichMenu = ({ richmenuId }: { richmenuId: string }) => lineBotClient.setDefaultRichMenu(richmenuId)

const deleteDefaultRichMenu = () => lineBotClient.deleteDefaultRichMenu()

const setRichMenuImage = ({ richmenuId, data }: { richmenuId: string; data: Buffer }) =>
	lineBotClient.setRichMenuImage(richmenuId, data)

const validateRichMenu = (richmenu: RichMenu) => lineBotClient.validateRichMenu(richmenu)

const createRichMenu = (richmenu: RichMenu) => lineBotClient.createRichMenu(richmenu)

const deleteRichMenu = ({ richmenuId }: { richmenuId: string }) => lineBotClient.deleteRichMenu(richmenuId)

const createRichMenuAlias = (richmenuId: string, aliasName: string) =>
	lineBotClient.createRichMenuAlias(richmenuId, aliasName)

const deleteRichMenuAlias = (aliasName: string) => lineBotClient.deleteRichMenuAlias(aliasName)

const updateRichMenuAlias = (aliasName: string, richmenuId: string) =>
	lineBotClient.updateRichMenuAlias(aliasName, richmenuId)

const getMessageContent = (messageId: string) => lineBotClient.getMessageContent(messageId)
const getMessageContentCustom = async (
	messageId: string,
	expectedContentType: Exclude<chatContentType, 'call' | 'slideshow' | 'text'>
) =>
	AxiosUtil.requestHttp({
		url: lineConfig.LINE_MEDIA_GET_CONTENT_URL(messageId),
		headers: {
			Authorization: `Bearer ${lineConfig.LINE_CHANNEL_ACCESS_TOKEN}`
		},
		responseType: 'arraybuffer'
	}).then((response) => {
		const contentType = response.headers['content-type'] as string | undefined
		if (contentType == undefined) throw new Error('invalid expected content-type' + contentType)
		if (
			(expectedContentType === 'image' && contentType.split('/')[0] !== 'image') ||
			(expectedContentType === 'audio' && contentType.split('/')[0] !== 'audio') ||
			(expectedContentType === 'video' && contentType.split('/')[0] !== 'video')
		) {
			throw new Error(`expected content-type ${expectedContentType} does not match incoming ${contentType}`)
		}
		const fileExtension = mime.extension(contentType)
		return {
			fileExtension: fileExtension,
			data: response.data
		}
	})
// messageId - Message ID of video or audio
const getVideoAudioMessageContentStatus = async (messageId: string): Promise<boolean> => {
	const MAX_RETRIES = 3
	for (let i = 0; i < MAX_RETRIES; i++) {
		const response = await AxiosUtil.requestHttp<{
			status: 'processing' | 'succeeded' | 'failed'
		}>({
			url: lineConfig.LINE_MEDIA_PREPARATION_STATUS_URL(messageId),
			headers: {
				Authorization: `Bearer ${lineConfig.LINE_CHANNEL_ACCESS_TOKEN}`
			}
		})
		if (response.data.status === 'succeeded') return true
		// eslint-disable-next-line promise/avoid-new
		await new Promise((resolve) => setTimeout(() => resolve(true), i + 1000))
	}
	return false
}

const syncFollowers = async (
	fetchSize = lineConfig.SYNC_FOLLOWERS_DEFAULT_FETCH_SIZE,
	nextToken?: string,
	iterationCount = 0
): Promise<number> => {
	if (iterationCount > lineConfig.SYNC_FOLLOWERS_MAX_ITERATION_COUNT) return iterationCount
	const { next, userIds } = await getBotFollowerIds(nextToken, fetchSize)
	if (userIds.length == 0) return iterationCount
	const profiles = await Promise.all(userIds.map(getProfile)).then(
		(results) => results.filter((profile) => profile !== null) as Profile[]
	)
	await db.Member.bulkCreate(
		profiles.map((profile) => ({
			lineId: profile?.userId,
			displayName: profile?.displayName,
			picUrl: profile?.pictureUrl,
			isFriends: true
		})),
		{
			updateOnDuplicate: ['displayName', 'picUrl', 'isFriends'],
			fields: ['lineId', 'displayName', 'picUrl', 'isFriends']
		}
	)
	if (next) return await syncFollowers(fetchSize, next, iterationCount + 1)
	return iterationCount
}

export {
	checkIfFriends,
	getProfile,
	sendReminders,
	replyMessage,
	sendMessage,
	sendFlexMessage,
	sendImageMessage,
	sendTemplateMessage,
	sendMulticastMessage,
	CreateFlexText,
	linkRichMenuToUser,
	linkRichMenuToMultipleUsers,
	unlinkRichMenuFromUser,
	unlinkRichMenusFromMultipleUsers,
	setDefaultRichMenu,
	deleteDefaultRichMenu,
	setRichMenuImage,
	validateRichMenu,
	createRichMenu,
	deleteRichMenu,
	createRichMenuAlias,
	deleteRichMenuAlias,
	updateRichMenuAlias,
	getMessageContent,
	getMessageContentCustom,
	getVideoAudioMessageContentStatus,
	getBotFollowerIds,
	syncFollowers
}
