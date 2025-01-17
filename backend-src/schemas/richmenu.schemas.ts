import { z } from 'zod'

/**
 * LINE API RICH MENU DEFINITIONS
 */
export const zRichMenuSize = z.object({
	width: z.number().min(800).max(2500),
	height: z.number().min(250)
})

export const zRichMenuBounds = z.object({
	x: z.number(),
	y: z.number(),
	width: z.number().min(0),
	height: z.number().min(0)
})

export const zRichmenuActionMessage = z.object({
	type: z.literal('message'),
	label: z.string().optional(),
	text: z.string().max(300)
})

export const zRichmenuActionURI = z.object({
	type: z.literal('uri'),
	label: z.string().optional(),
	uri: z.string().max(1000)
})

export const zRichmenuActionSwitch = z.object({
	type: z.literal('richmenuswitch'),
	label: z.string().max(20).optional(),
	richMenuAliasId: z.string(),
	data: z.string().max(300)
})

export const zRichMenuAction = z.union([zRichmenuActionMessage, zRichmenuActionURI, zRichmenuActionSwitch])

export const zRichMenuArea = z.object({
	bounds: zRichMenuBounds,
	action: zRichMenuAction
})

export const zRichMenuTabGroupStatus = z.enum(['DRAFT', 'PUBLISHED'] as const)

export const zRichMenuDisplayPriority = z.enum(['USER', 'DEFAULT'] as const)

export const zRichMenuTemplateName = z.enum([
	'RICH_MENU_TEMPLATE_101',
	'RICH_MENU_TEMPLATE_102',
	'RICH_MENU_TEMPLATE_103',
	'RICH_MENU_TEMPLATE_104',
	'RICH_MENU_TEMPLATE_105',
	'RICH_MENU_TEMPLATE_201',
	'RICH_MENU_TEMPLATE_202',
	'RICH_MENU_TEMPLATE_203',
	'RICH_MENU_TEMPLATE_204',
	'RICH_MENU_TEMPLATE_205',
	'RICH_MENU_TEMPLATE_206',
	'RICH_MENU_TEMPLATE_207',
	'RICH_MENU_CUSTOM_TEMPLATE_201',
	'RICH_MENU_CUSTOM_TEMPLATE_202'
] as const)
// TODO: make it similar to richmenu
export const zRichMenuTemplate = z.object({
	name: zRichMenuTemplateName,
	size: zRichMenuSize,
	areas: z.array(zRichMenuArea)
})

export const zRichMenu = z.object({
	id: z.number().describe('auto generated by DB'),
	groupId: z.number().describe('for grouping purposes'),
	name: z.string().max(300).nullable().describe('for managers'),
	richMenuId: z.string().max(64).nullable().describe('generated by LINE API'),
	richMenuAliasId: z.string().max(32).nullable().describe('used for switch actions'),
	imageName: z.string().nullable().describe('rich menu image name on server'),
	areas: zRichMenuArea.array().min(0).max(20).describe('clickable areas of the rich menu. max 20'),
	templateType: zRichMenuTemplateName.nullable(),
	size: zRichMenuSize,
	chatBarText: z.string().max(14),
	tabIndex: z.number().min(0).max(2).nullable().describe('index from left to right, 0 is leftmost'),
	selected: z.boolean().describe('show this richmenu by default')
})

export const zRichMenuPartial = zRichMenu.partial()

export const zRichMenuAlias = z.object({
	richMenuId: z.string(),
	richMenuAliasId: z.string()
})

export const zRichMenuTabGroup = z.object({
	groupId: z.number(),
	name: z.string().max(100),
	displayPriority: zRichMenuDisplayPriority,
	status: zRichMenuTabGroupStatus,
	createdAt: z.date().nullable(),
	updatedAt: z.date().nullable()
})

export const zRichMenuPrePublish = z.object({
	id: z.number(),
	groupId: z.number(),
	richMenuId: z.null(),
	richMenuAliasId: z.null(),
	name: z.string().max(300),
	chatBarText: z.string().max(14),
	selected: z.boolean(),
	size: zRichMenuSize,
	areas: zRichMenuArea.array().min(0).max(20),
	imageName: z.string(),
	templateType: zRichMenuTemplateName.nullable(),
	tabIndex: z.number().min(0).max(2)
})
z.object({
	id: z.number(),
	areas: zRichMenuArea.array(),
	size: zRichMenuSize
})
export const zRichMenuTabGroupPrePublish = z.object({
	groupId: zRichMenuTabGroup.shape.groupId,
	name: zRichMenuTabGroup.shape.name,
	status: z.literal(zRichMenuTabGroupStatus.Values.DRAFT),
	richmenus: zRichMenuPrePublish.array().min(1).max(3)
})

export const zRichMenuPostPublish = z.object({
	groupId: z.number(),
	richMenuId: z.string().max(64),
	richMenuAliasId: z.string().max(32),
	name: z.string().max(300),
	chatBarText: z.string().max(14),
	selected: z.boolean(),
	size: zRichMenuSize,
	areas: zRichMenuArea.array().min(0).max(20),
	imageName: z.string(),
	templateType: zRichMenuTemplateName,
	tabIndex: z.number().min(0).max(2)
})
export const zRichMenuTabGroupPostPublish = z.object({
	groupId: zRichMenuTabGroup.shape.groupId,
	name: zRichMenuTabGroup.shape.name,
	status: z.literal(zRichMenuTabGroupStatus.Values.PUBLISHED),
	richmenus: zRichMenuPostPublish.array().min(1).max(3)
})
export const zRichMenuTabGroupPostUnpublish = z.object({
	groupId: zRichMenuTabGroup.shape.groupId,
	name: zRichMenuTabGroup.shape.name,
	status: z.literal(zRichMenuTabGroupStatus.Values.DRAFT),
	richmenus: zRichMenuPrePublish.array().min(1).max(3)
})
/**
 * TYPES
 */
export type RichMenu = z.infer<typeof zRichMenu>
export type RichMenuPartial = z.infer<typeof zRichMenuPartial>
export type RichMenuAction = z.infer<typeof zRichMenuAction>
export type RichMenuAlias = z.infer<typeof zRichMenuAlias>
export type RichMenuArea = z.infer<typeof zRichMenuArea>
export type RichMenuBound = z.infer<typeof zRichMenuBounds>
export type RichMenuTabGroupStatus = z.infer<typeof zRichMenuTabGroupStatus>
export type RichMenuSize = z.infer<typeof zRichMenuSize>
export type RichMenuTabGroup = z.infer<typeof zRichMenuTabGroup>
export type RichMenuTemplate = z.infer<typeof zRichMenuTemplate>
export type RichMenuTemplateName = z.infer<typeof zRichMenuTemplateName>
export type RichMenuDisplayPriority = z.infer<typeof zRichMenuDisplayPriority>

export type RichMenuPrePublish = z.infer<typeof zRichMenuPrePublish>
export type RichMenuTabGroupPrePublish = z.infer<typeof zRichMenuTabGroupPrePublish>
export type RichMenuPostPublish = z.infer<typeof zRichMenuPostPublish>
export type RichMenuTabGroupPostPublish = z.infer<typeof zRichMenuTabGroupPostPublish>
export type RichMenuTabGroupPostUnpublish = z.infer<typeof zRichMenuTabGroupPostUnpublish>
