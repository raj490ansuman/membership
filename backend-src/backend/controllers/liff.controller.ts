import { Request, Response, NextFunction } from 'express'
import moment from 'moment'

import { Transaction, UniqueConstraintError } from 'sequelize'
import {
	CONFLICT_ERROR,
	RESPONSE_SUCCESS,
	WATCH_MESSAGE_KEY_MEMBER,
	SYSTEM_ERROR,
	WATCH_MESSAGE_KEY_MEMBER_POST_REGISTRATION
} from '../config'
import { AppError, FileUtils, writeLog, SocketUtil } from '../utilities'
import { db } from '../models/index'
import { AttributeService, LineService, MemberService, SpectatorService } from '../services'

const replacerName = new RegExp(/\[NAME\]/, 'gm')
const replacerTelephone = new RegExp(/\[TEL\]/, 'gm')

export const setPersonalInfo = async (req: Request, res: Response, next: NextFunction) => {
	let transaction: Transaction | null = null
	let isNewMember = false
	const updatedAttributes: any = req.body

	try {
		transaction = await db.sequelize.transaction()
		const memberAttributes = await AttributeService.listMemberAttributes({ isMemberDisplayed: true })
		if (!Array.isArray(memberAttributes)) throw new AppError(SYSTEM_ERROR, 'not setting', false)

		if (
			Array.isArray(req.files) &&
			req.files?.length > memberAttributes?.filter((item) => item.type === 'image')?.length
		) {
			throw new AppError(SYSTEM_ERROR, 'image error', false)
		}

		const member = await MemberService.findMemberByLineProfile(res.locals.memberLine, transaction)

		if (member.memberCode == null) {
			const memberCode = `45${moment().format('YYYYMMDD')}${member.memberId.toString().padStart(10, '0')}`
			member.set({ memberCode: memberCode })
			isNewMember = true
		}
		if (member.memberSince == null) member.set({ memberSince: new Date() })
		if (!member.isRegistered) member.set({ isRegistered: true })
		if (member.isRegistered && member.lineId && member.curRM != 'memberRM') {
			member.set({ curRM: 'memberRM' })
			await MemberService.setRichmenuOfMember(
				{ member, type: 'memberRM' },
				LineService.linkRichMenuToUser,
				transaction
			)
		}
		member.set({ isFriends: true })
		if (member.changed()) await member.save({ transaction })

		await MemberService.updateMemberCustomAttributes({
			member,
			updatedAttributes,
			files: req.files,
			transaction
		})

		if (isNewMember) {
			// Send notifications to observers listening for new member registrations
			const memberSpectators = await SpectatorService.listSpectatorsByWatch('member', transaction)
			if (memberSpectators.length > 0) {
				const spectatorLineIds = memberSpectators.map((mS) => mS.Member.lineId as string)
				const watchMessageTemplate = await SpectatorService.getSpectatorNotificationTemplate(
					WATCH_MESSAGE_KEY_MEMBER,
					transaction
				)
				if (watchMessageTemplate && watchMessageTemplate.valueString) {
					let watchMessage = watchMessageTemplate.valueString.replace(replacerName, `${member.displayName}`)
					const telephoneAttributeId = memberAttributes.find((a) => a.type == 'telephone')?.memberAttributeId
					if (telephoneAttributeId)
						watchMessage = watchMessage.replace(
							replacerTelephone,
							member.getValueByMemberAttributeId(telephoneAttributeId) as string
						)
					await LineService.sendMulticastMessage(spectatorLineIds, watchMessage).catch((err) =>
						writeLog(`failed to send multicast message member watch ${err.message}`, 'info')
					)
				}
			}

			// Send notification to new member
			const newMemberMsgTemplate = await SpectatorService.getSpectatorNotificationTemplate(
				WATCH_MESSAGE_KEY_MEMBER_POST_REGISTRATION,
				transaction
			)
			if (newMemberMsgTemplate && newMemberMsgTemplate.valueString) {
				const message = newMemberMsgTemplate.valueString.replace(replacerName, `${member.displayName}`)
				await LineService.sendMulticastMessage([member.lineId as string], message).catch((err) =>
					writeLog(`failed to send multicast message member watch ${err.message}`, 'info')
				)
			}
		}

		SocketUtil.emitMember({ memberId: member.memberId })
		await transaction.commit()
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		if (transaction != null) await transaction.rollback()

		if (Array.isArray(req.files) && req.files?.length)
			// eslint-disable-next-line promise/catch-or-return
			Promise.allSettled(req.files?.map((item) => FileUtils.deleteFile(item?.path)))

		if (e instanceof UniqueConstraintError) {
			res.sendStatus(CONFLICT_ERROR)
			return
		}
		next(e)
	}
}

export const getPersonalInfo = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const member = await MemberService.findMemberByLineProfile(res.locals.memberLine)
		const { lineId, ...restOfMember } = member.toJSON()
		res.send(restOfMember)
	} catch (e) {
		if (e instanceof UniqueConstraintError) {
			res.sendStatus(CONFLICT_ERROR)
		} else {
			next(e)
		}
	}
}
