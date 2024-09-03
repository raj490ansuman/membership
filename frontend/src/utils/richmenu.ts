import { UploadFile } from 'antd'
import type {
	RichMenu,
	RichMenuAction,
	RichMenuArea,
	RichMenuTabGroup,
	RichMenuTemplate,
	RichMenuTemplateName,
} from '@schemas'
import { useUpdateRichMenuTabGroupMutation } from '@/queries'
import { isValidJapanesePhoneNumber } from './common'

export type RichMenuCustomAction = RichMenuAction & {
	type: 'customUriMembership' | 'telephone'
	uri: string
}
export type RichMenuCustomArea = RichMenuArea & {
	bounds: Partial<RichMenuArea['bounds']>
	action?: Record<string, unknown> | RichMenuCustomAction
}

export type RichMenuImageUpload = { richmenuImage?: { file: UploadFile; fileList: UploadFile[] } }

export type FormValidatedRichMenuTabGroup = RichMenuTabGroup & {
	richmenus: Array<RichMenu & RichMenuImageUpload>
}

export type UpdateRichMenuTabGroupMutationData = ReturnType<
	typeof useUpdateRichMenuTabGroupMutation
>['data']
export type UpdateRichMenuTabGroupSuccessCallback = ({
	data,
	validatedTabGroup,
}: {
	data: UpdateRichMenuTabGroupMutationData
	validatedTabGroup: FormValidatedRichMenuTabGroup
}) => void

export const richMenuActionValueMap = {
	message: 'text',
	uri: 'uri',
	customUriMembership: 'uri',
	telephone: 'uri',
}
export const richMenuActionValuePlaceholderText = {
	message: '例：メッセージ',
	uri: '例：https://example.com',
	customUriMembership: import.meta.env.VITE_APP_LINE_LIFF_ACCOUNT_URL || '',
	telephone: '半角で入力をお願いします。（例：090-1234-5678、09012345678）',
}

export const INITIAL_TEMPLATES: { compact?: RichMenuTemplate[]; large?: RichMenuTemplate[] } = {
	compact: [],
	large: [],
}

export const getTemplateSizeType = (templateType: string) =>
	(templateType?.includes('RICH_MENU_TEMPLATE_1') ? 'compact' : 'large') || 'compact'

export const getTemplateByName = (
	templates: { compact?: RichMenuTemplate[]; large?: RichMenuTemplate[] },
	name: string,
): Partial<RichMenu> | undefined => {
	if (!templates || !name) return
	const templateSizeType = getTemplateSizeType(name)
	return templates[templateSizeType]?.find((template: RichMenuTemplate) => template.name === name)
}

export const hasEqualBounds = (boundsA: RichMenuArea['bounds'], boundsB: RichMenuArea['bounds']) =>
	boundsA.x === boundsB.x &&
	boundsA.y === boundsB.y &&
	boundsA.width === boundsB.width &&
	boundsA.height === boundsB.height

export const isPublishableRichMenu = (richMenu: Partial<RichMenu>) =>
	richMenu.groupId != null &&
	richMenu.id != null &&
	richMenu.imageName != null &&
	richMenu.templateType != null

// Preserves area action input data if it exists and place it inside the new template action list
export const saveUserDefinedActionsInNewTemplateActions = ({
	existingAreas,
	templates,
	templateName,
}: {
	existingAreas: Array<RichMenuArea>
	templates: { compact?: RichMenuTemplate[]; large?: RichMenuTemplate[] }
	templateName: RichMenuTemplateName | null
}): RichMenuArea[] => {
	if (!(existingAreas && templates && templateName)) return []
	const richMenuTemplate = getTemplateByName(templates, templateName)

	const preservedAreas = richMenuTemplate?.areas?.map(({ bounds: templateBounds }, areaIndex) => {
		// Adhere to the previous areas order
		const previousAction = existingAreas?.at(areaIndex)
		return {
			bounds: templateBounds,
			action: previousAction ? previousAction.action : {}, // Empty actions used empty inputs
		} as RichMenuArea & {
			bounds: Partial<RichMenuArea['bounds']>
			action?: Record<string, unknown>
		}
	})
	return preservedAreas || []
}

// Combined user defined actions which may not contain all actions according to template and
// populate missing actions for display
export const combineUserDefinedActionsAndTemplateActions = ({
	existingAreas,
	templates,
	templateName,
	useEmptyAction = false,
}: {
	existingAreas: Array<RichMenuArea>
	templates: { compact?: RichMenuTemplate[]; large?: RichMenuTemplate[] }
	templateName: RichMenuTemplateName | null
	useEmptyAction?: boolean
}): RichMenuCustomArea[] => {
	if (!(existingAreas && templates && templateName)) return []
	const richMenuTemplate = getTemplateByName(templates, templateName)

	const combinedAreas = richMenuTemplate?.areas?.map(
		({ action: templateAction, bounds: templateBounds }) => {
			// Map user defined action to template
			const existingAction: RichMenuCustomArea | undefined = existingAreas?.find(
				(existingArea) => hasEqualBounds(existingArea.bounds, templateBounds),
			)
			const isUriAction = existingAction?.action.type === 'uri'

			// Handle custom action type such as 会員証リンク
			if (
				isUriAction &&
				existingAction.action.uri == import.meta.env.VITE_APP_LINE_LIFF_ACCOUNT_URL
			) {
				const customUriMembershipAction = {
					...existingAction.action,
					type: 'customUriMembership' as const,
				} as RichMenuCustomAction
				existingAction.action = customUriMembershipAction
			} else if (
				isUriAction &&
				isValidJapanesePhoneNumber(existingAction.action.uri as string)
			) {
				// Handle incoming telephone number prepended with 'tel:' and convert type from uri to telephone
				const customUriMembershipAction = {
					...existingAction.action,
					type: 'telephone' as const,
				} as RichMenuCustomAction
				existingAction.action = customUriMembershipAction
			}
			return {
				bounds: templateBounds,
				action: existingAction
					? existingAction.action
					: useEmptyAction
					? {}
					: templateAction,
			} as RichMenuCustomArea
		},
	)
	return combinedAreas || []
}
