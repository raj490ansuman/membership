import type {
	RichMenu as RichMenuSchema,
	RichMenuTemplate,
	RichMenuTabGroup as RichMenuTabGroupSchema,
} from '@schemas'
import React from 'react'

export enum RICHMENU_ACTIONS {
	SET = 'SET',
	SHOW_MODAL = 'SHOW_MODAL',
	HIDE_MODAL = 'HIDE_MODAL',
	SET_ACTIVE_EDIT_TAB_GROUP = 'SET_ACTIVE_EDIT_TAB_GROUP',
}

export type UploadRichMenuImagePayload = {
	id: number
	image: File
}

// TODO: Migrate into type declaration, update Richmenu type conflict
export type RichMenuSettingsAction = {
	type: RICHMENU_ACTIONS
	payload?: RichMenuSettingsState
}

export type RichMenuTabGroup = RichMenuTabGroupSchema & { richmenus: Partial<RichMenuSchema>[] }

export type RichMenuSettingsState = {
	templates?: {
		compact?: RichMenuTemplate[]
		large?: RichMenuTemplate[]
	}
	tabGroups?: Array<RichMenuTabGroup>
	defaultTabGroup?: Partial<RichMenuTabGroup>
	perUserTabGroup?: Partial<RichMenuTabGroup>
	draftTabGroups?: Array<RichMenuTabGroup>
	isEditModalVisible?: boolean
	activeEditTabGroup?: Partial<RichMenuTabGroup>
}

export type RichMenuSettingsContext = {
	dispatch: React.Dispatch<RichMenuSettingsAction>
	state: RichMenuSettingsState
}
