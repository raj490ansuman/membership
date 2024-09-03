import { Transaction } from 'sequelize'
import { AppRouteOptions } from '@ts-rest/express'
import { RESPONSE_SUCCESS, SYSTEM_ERROR, systemConfig } from '../config'
import { db } from '../models'
import { AttributeService, MemberService } from '../services'
import { AppError, FileUtils } from '../utilities'
import { ContractAPI } from '../../contracts'
import { zMemberAttribute } from '../../schemas'
import { Request, Response, NextFunction } from 'express'

export const createMemberAttribute: AppRouteOptions<
	typeof ContractAPI.memberAttributes.createMemberAttribute
>['handler'] = async ({ body }) => {
	let transaction: Transaction | null = null
	try {
		const { required, label, type, isMemberDisplayed, isAdminDisplayed, choices } = body
		if (!(label && type)) throw new AppError(SYSTEM_ERROR, 'invalid parameters')

		transaction = await db.sequelize.transaction()
		if (type === 'address') {
			const addressAttributes = AttributeService.generateAddressAttributes({
				required,
				label,
				type,
				isMemberDisplayed,
				isAdminDisplayed
			})
			const showOrder = await AttributeService.getMaxShowOrder(transaction)
			for await (const addressAttribute of addressAttributes) {
				await AttributeService.createMemberAttribute({
					...addressAttribute,
					showOrder: showOrder + 1,
					transaction
				})
			}
		} else {
			await AttributeService.createMemberAttribute({
				required,
				label,
				type,
				isMemberDisplayed,
				isAdminDisplayed,
				choices,
				transaction
			})
		}

		await transaction.commit()
		return {
			status: RESPONSE_SUCCESS,
			body: {
				message: 'Successfully created member attribute',
				success: true
			}
		}
	} catch (e) {
		if (transaction != null) await transaction.rollback()
		throw e
	}
}
export const updateMemberAttributeOrder: AppRouteOptions<
	typeof ContractAPI.memberAttributes.updateMemberAttributeOrder
>['handler'] = async ({ body }) => {
	let transaction: Transaction | null = null
	try {
		const params = body.memberAttributes as { memberAttributeId: number; showOrder: number }[]
		if (!Array.isArray(params) || params.length == 0) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}
		transaction = await db.sequelize.transaction()
		await AttributeService.updateMemberAttributeOrder(params, transaction)
		await transaction.commit()
		return {
			status: RESPONSE_SUCCESS,
			body: {
				message: 'Successfully updated member attribute order',
				success: true
			}
		}
	} catch (e) {
		if (transaction != null) await transaction.rollback()
		throw e
	}
}

export const updateMemberAttribute: AppRouteOptions<
	typeof ContractAPI.memberAttributes.updateMemberAttribute
>['handler'] = async ({ body, params }) => {
	let transaction: Transaction | null = null

	try {
		const { required, label, isMemberDisplayed, isAdminDisplayed, choices } = body
		if (!label) throw new AppError(SYSTEM_ERROR, 'invalid parameters')

		const memberAttributeId = params.memberAttributeId
		if (!memberAttributeId || isNaN(memberAttributeId))
			throw new AppError(SYSTEM_ERROR, 'invalid customer registrationId id', false)

		transaction = await db.sequelize.transaction()
		await AttributeService.updateMemberAttribute({
			memberAttributeId,
			required,
			label,
			isMemberDisplayed,
			isAdminDisplayed,
			choices,
			transaction
		})
		await transaction.commit()
		return {
			status: RESPONSE_SUCCESS,
			body: {
				message: 'Successfully updated member attribute',
				success: true
			}
		}
	} catch (e) {
		if (transaction != null) await transaction.rollback()
		throw e
	}
}

export const listMemberAttributes: AppRouteOptions<
	typeof ContractAPI.memberAttributes.listMemberAttributes
>['handler'] = async () => {
	const memberAttributes = await AttributeService.listMemberAttributes()
	const sanitizedMemberAttributes = zMemberAttribute.array().parse(memberAttributes)

	return {
		status: RESPONSE_SUCCESS,
		body: {
			data: sanitizedMemberAttributes,
			message: 'Successfully retrieved member attributes',
			success: true
		}
	}
}

export const deleteMemberAttribute: AppRouteOptions<
	typeof ContractAPI.memberAttributes.deleteMemberAttribute
>['handler'] = async ({ params }) => {
	let transaction: Transaction | null = null
	try {
		const memberAttributeId = params.memberAttributeId
		if (!memberAttributeId || isNaN(memberAttributeId)) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}
		transaction = await db.sequelize.transaction()
		const memberAttribute = await db.MemberAttribute.findByPk(memberAttributeId)
		if (!memberAttribute?.isDelete) {
			throw new AppError(SYSTEM_ERROR, 'can not delete', false)
		}
		// if the attribute is address type, we need to remove all other address attributes of the same section
		if (memberAttribute.section && memberAttribute.isAttributeTypeAddress()) {
			const otherAddressAttributeIds = (
				await db.MemberAttribute.listMemberAttributes({ section: memberAttribute.section }, transaction)
			).map((a) => a.memberAttributeId)
			await MemberService.bulkRemoveMemberAttributeByIds(otherAddressAttributeIds, transaction)
			await Promise.all(
				otherAddressAttributeIds.map((id) => AttributeService.deleteMemberAttribute(id, transaction!))
			)
		} else {
			await AttributeService.deleteMemberAttribute(memberAttributeId, transaction)
			await MemberService.removeMemberAttributeById(memberAttributeId, transaction)
			// Let's not forget to delete the entire subdirectory of uploads for that custom registration
			if (memberAttribute.type == 'image') {
				FileUtils.deleteDirectory(systemConfig.PATH_FILE_UPLOAD_MEMBER_ATTRIBUTE_ID(String(memberAttributeId)))
			}
		}
		await transaction.commit()
		return {
			status: RESPONSE_SUCCESS,
			body: {
				message: 'Successfully deleted member attribute',
				success: true
			}
		}
	} catch (e) {
		if (transaction != null) await transaction.rollback()
		throw e
	}
}

export const listLiffMemberAttributes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const memberAttributes = await AttributeService.listMemberAttributes()
		const sanitizedMemberAttributes = zMemberAttribute.array().parse(memberAttributes)
		res.status(200).json(sanitizedMemberAttributes)
	} catch (error) {
		next(error)
	}
}
