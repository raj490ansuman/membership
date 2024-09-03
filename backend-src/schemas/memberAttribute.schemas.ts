import { z } from 'zod'

const zMemberAttributeChoice = z.object({
	attributeChoiceId: z.number(),
	memberAttributeId: z.number(),
	contents: z.string(),
	showOrder: z.number()
})
const zMemberAttributeType = z.enum([
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
	'address_postal',
	'address_prefecture',
	'address_city',
	'address_address',
	'address_building',
	'firstName',
	'lastName',
	'firstNameKana',
	'lastNameKana',
	'fullName',
	'fullNameKana'
])

const zMemberAttribute = z.object({
	memberAttributeId: z.number(),
	required: z.boolean(),
	isMemberDisplayed: z.boolean(),
	isAdminDisplayed: z.boolean(),
	label: z.string(),
	type: z.string(),
	archType: z.string().nullable().optional(),
	section: z.string().nullable(),
	showOrder: z.number(),
	attributeChoices: zMemberAttributeChoice.array()
})

export { zMemberAttributeChoice, zMemberAttributeType, zMemberAttribute }
