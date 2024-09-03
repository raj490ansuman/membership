import { z } from 'zod'
import { zCommonResponse } from './common.schemas'
import { zMemberAttribute, zMemberAttributeChoice } from './memberAttribute.schemas'

const zMemberAttributeMutateType = z.enum([
	'text',
	'number_integer',
	'number_float',
	'date',
	'time',
	'datetime',
	'boolean',
	'select',
	'radio',
	'checkbox',
	'file',
	'image',
	'video',
	'audio',
	'color',
	'url',
	'email',
	'telephone',
	'firstName',
	'lastName',
	'firstNameKana',
	'lastNameKana',
	'fullName',
	'fullNameKana',
	'address'
])

const zListMemberAttributesRequest = z.object({})
const zListMemberAttributesResponse = zCommonResponse
	.extend({
		data: zMemberAttribute.array()
	})
	.strict()
const zCreateMemberAttributeRequest = z
	.object({
		required: z.boolean(),
		isMemberDisplayed: z.boolean(),
		isAdminDisplayed: z.boolean(),
		label: z.string(),
		type: zMemberAttributeMutateType,
		choices: z
			.array(
				zMemberAttributeChoice.pick({
					contents: true,
					showOrder: true
				})
			)
			.optional()
	})
	.strict()
const zCreateMemberAttributeResponse = zCommonResponse

const zUpdateMemberAttributeOrderPathParams = z
	.object({
		memberAttributeId: z.any().transform((val) => Number(val))
	})
	.strict()
const zUpdateMemberAttributeOrderRequest = z
	.object({
		memberAttributes: z
			.object({
				memberAttributeId: z.number(),
				showOrder: z.number()
			})
			.array()
	})
	.strict()

const zUpdateMemberAttributeOrderResponse = zCommonResponse

const zUpdateMemberAttributePathParams = z
	.object({
		memberAttributeId: z.any().transform((val) => Number(val))
	})
	.strict()
const zUpdateMemberAttributeRequestBody = zMemberAttribute
	.pick({
		required: true,
		label: true,
		isMemberDisplayed: true,
		isAdminDisplayed: true
	})
	.extend({
		choices: z.array(zMemberAttributeChoice.pick({ contents: true, showOrder: true })).optional()
	})
	.strict()
const zUpdateMemberAttributeResponse = zCommonResponse

const zDeleteMemberAttributePathParams = z
	.object({
		memberAttributeId: z.any().transform((val) => Number(val))
	})
	.strict()
const zDeleteMemberAttributeResponse = zCommonResponse

export {
	zListMemberAttributesRequest,
	zListMemberAttributesResponse,
	zCreateMemberAttributeRequest,
	zCreateMemberAttributeResponse,
	zUpdateMemberAttributeOrderPathParams,
	zUpdateMemberAttributeOrderRequest,
	zUpdateMemberAttributeOrderResponse,
	zUpdateMemberAttributePathParams,
	zUpdateMemberAttributeRequestBody,
	zUpdateMemberAttributeResponse,
	zDeleteMemberAttributePathParams,
	zDeleteMemberAttributeResponse
}
