import { deepCopy } from '@/utils/common'
import { RICHMENU_ACTIONS } from './RichMenuAction'
import type { RichMenuSettingsAction, RichMenuSettingsState } from './RichMenuAction'

export const initialRichMenuSettingsState: RichMenuSettingsState = {
	templates: {
		compact: [],
		large: []
	},
	tabGroups: [],
	defaultTabGroup: {
		richmenus: []
	},
	perUserTabGroup: {
		richmenus: []
	},
	draftTabGroups: [],
	isEditModalVisible: false,
	activeEditTabGroup: undefined
}

export const richMenuReducer = (state: RichMenuSettingsState, action: RichMenuSettingsAction) => {
	switch (action.type) {
		case RICHMENU_ACTIONS.SET: {
			return {
				...deepCopy(state),
				...deepCopy(action.payload || {})
			}
		}
		case RICHMENU_ACTIONS.SHOW_MODAL: {
			const stateCopy = { ...deepCopy(state) }
			stateCopy.isEditModalVisible = true
			return { ...deepCopy(stateCopy) }
		}
		case RICHMENU_ACTIONS.HIDE_MODAL: {
			const stateCopy = { ...deepCopy(state) }
			stateCopy.isEditModalVisible = false
			stateCopy.activeEditTabGroup = undefined
			return { ...deepCopy(stateCopy) }
		}
		case RICHMENU_ACTIONS.SET_ACTIVE_EDIT_TAB_GROUP: {
			const stateCopy = { ...deepCopy(state) }
			stateCopy.activeEditTabGroup = action.payload?.activeEditTabGroup
				? { ...deepCopy(action.payload.activeEditTabGroup) }
				: undefined

			// TODO: Find appropriate place to perform removal
			if (stateCopy.activeEditTabGroup) {
				stateCopy.activeEditTabGroup.richmenus = stateCopy.activeEditTabGroup?.richmenus?.map((menu) => {
					const areas = menu.areas && menu.areas.filter((area) => area.action.type !== 'richmenuswitch')
					return { ...deepCopy(menu), areas }
				})
			}
			return { ...deepCopy(stateCopy) }
		}
		default:
			return initialRichMenuSettingsState
	}
}
