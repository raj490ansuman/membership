import { z } from 'zod'
import { zCommonResponse } from './common.schemas'
import {
	zRichMenu,
	zRichMenuDisplayPriority,
	zRichMenuTabGroup,
	zRichMenuTabGroupPostPublish,
	zRichMenuTabGroupPostUnpublish,
	zRichMenuTemplate
} from './richmenu.schemas'

/**
 * RICH MENU TEMPLATE USE CASES
 */
export const zGetRichMenuTemplatesResponse = zCommonResponse
	.extend({
		data: z.object({
			compact: z.array(zRichMenuTemplate),
			large: z.array(zRichMenuTemplate)
		})
	})
	.strict()

/**
 * RICH MENU USE CASES
 */
export const zGetRichMenuResponse = zCommonResponse
	.extend({
		data: zRichMenu
	})
	.strict()

export const zUpdateRichMenuImageResponse = zCommonResponse
	.extend({
		data: zRichMenu
	})
	.strict()

/**
 * RICH MENU TAB GROUP USE CASES
 */
export const zCreateRichMenuTabGroupRequest = z
	.object({
		name: zRichMenuTabGroup.shape.name.optional().default(''),
		displayPriority: zRichMenuDisplayPriority.optional().default('DEFAULT')
	})
	.strict()
export const zCreateRichMenuTabGroupResponse = zCommonResponse
	.extend({
		data: zRichMenuTabGroup.extend({
			richmenus: z.array(zRichMenu)
		})
	})
	.strict()

export const zGetRichMenuTabGroupsRequest = z
	.object({
		includeDeleted: z.coerce.boolean().optional()
	})
	.strict()
export const zGetRichMenuTabGroupsResponse = zCommonResponse
	.extend({
		data: z.array(
			zRichMenuTabGroup.extend({
				richmenus: z.array(zRichMenu)
			})
		)
	})
	.strict()

export const zGetRichMenuTabGroupResponse = zCommonResponse
	.extend({
		data: zRichMenuTabGroup.extend({
			richmenus: z.array(zRichMenu)
		})
	})
	.strict()

//TODO: add displayPriority in later version
// export const zUpdateRichmenuTabGroupRequest = zRichMenuTabGroup
// 	.pick({
// 		displayPriority: true
// 	})
// 	.partial({ displayPriority: true })
// 	.extend({
// 		richmenus: z.array(zRichMenu.partial())
// 	})
// 	.strict()

export const zPublishRichmenuTabGroupResponse = zCommonResponse.extend({
	data: zRichMenuTabGroupPostPublish
})

export const zUnpublishRichmenuTabGroupResponse = zCommonResponse.extend({
	data: zRichMenuTabGroupPostUnpublish
})

export const zUpdateRichmenuTabGroupRequest = z
	.object({
		richmenus: z.array(
			zRichMenu.partial().required({
				size: true,
				areas: true
			})
		),
		displayPriority: zRichMenuDisplayPriority,
		name: zRichMenuTabGroup.shape.name
	})
	.strict()

export const zUpdateRichmenuTabGroupResponse = zCommonResponse
	.extend({
		data: zRichMenuTabGroup.extend({
			richmenus: z.array(zRichMenu)
		})
	})
	.strict()

/**
 * TYPES
 */
export type GetRichMenuTemplatesResponse = z.infer<typeof zGetRichMenuTemplatesResponse>
export type GetRichMenuResponse = z.infer<typeof zGetRichMenuResponse>

export type CreateRichMenuTabGroupRequest = z.infer<typeof zCreateRichMenuTabGroupRequest>
export type CreateRichMenuTabGroupResponse = z.infer<typeof zCreateRichMenuTabGroupResponse>

export type GetRichMenuTabGroupsRequest = z.infer<typeof zGetRichMenuTabGroupsRequest>
export type GetRichMenuTabGroupsResponse = z.infer<typeof zGetRichMenuTabGroupsResponse>
export type GetRichMenuTabGroupResponse = z.infer<typeof zGetRichMenuTabGroupResponse>

export type PublishRichmenuTabGroupResponse = z.infer<typeof zPublishRichmenuTabGroupResponse>
export type UnpublishRichmenuTabGroupResponse = z.infer<typeof zUnpublishRichmenuTabGroupResponse>

export type UpdateRichmenuTabGroupRequest = z.infer<typeof zUpdateRichmenuTabGroupRequest>
export type UpdateRichmenuTabGroupResponse = z.infer<typeof zUpdateRichmenuTabGroupResponse>

export type RichMenuTabGroupCreateRequestBody = z.infer<typeof zCreateRichMenuTabGroupRequest>

/**
 * Per-user display priority takes precedence over default
 *
 * https://developers.line.biz/en/docs/messaging-api/rich-menus-overview/#rich-menu-display
 */
// export type RichMenuDisplayPriority = z.infer<typeof zRichMenuDisplayPriority>
