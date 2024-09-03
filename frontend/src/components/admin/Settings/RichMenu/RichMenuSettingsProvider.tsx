import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { useRichMenuTabGroupsQuery, useRichMenuTemplatesQuery } from '@/queries'
import {
	type RichMenuTabGroup,
	type RichMenuSettingsAction,
	type RichMenuSettingsContext,
	RICHMENU_ACTIONS
} from './RichMenuAction'
import { initialRichMenuSettingsState, richMenuReducer } from '@/components/admin/Settings/RichMenu/RichMenuReducer'
import { COMMONS } from '@/utils'

/**
 * House state of rich menus and reference to dispatch method
 */
const initialContext: RichMenuSettingsContext = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	dispatch: (value: RichMenuSettingsAction) => {},
	state: initialRichMenuSettingsState
}
const RichMenuSettingsCtx = createContext(initialContext)

export const useRichMenuSettingsContext = () => {
	const richMenusCtx = useContext(RichMenuSettingsCtx)
	if (!richMenusCtx) {
		throw new Error('RichMenuSettingsContext: No value provided')
	}

	return richMenusCtx
}

const isPublishedDefaultRichMenuTabGroup = (tabGroup: RichMenuTabGroup) =>
	tabGroup.displayPriority === 'DEFAULT' && tabGroup.status === 'PUBLISHED'
const isPublishedPerUserRichMenuTabGroup = (tabGroup: RichMenuTabGroup) =>
	tabGroup.displayPriority === 'USER' && tabGroup.status === 'PUBLISHED'
const isDraftRichMenuTabGroup = (tabGroup: RichMenuTabGroup) => tabGroup.status === 'DRAFT'

export const RichMenuSettingsProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(richMenuReducer, initialRichMenuSettingsState)
	const templatesQuery = useRichMenuTemplatesQuery()
	const tabGroupsQuery = useRichMenuTabGroupsQuery()

	const findDefaultTabGroup = useCallback(
		() => tabGroupsQuery?.data?.body?.data?.find(isPublishedDefaultRichMenuTabGroup),
		[tabGroupsQuery?.data?.body?.data]
	)
	const findPerUserTabGroup = useCallback(
		() => tabGroupsQuery?.data?.body?.data?.find(isPublishedPerUserRichMenuTabGroup),
		[tabGroupsQuery?.data?.body?.data]
	)
	const findDraftTabGroups = useCallback(
		() => tabGroupsQuery?.data?.body?.data?.filter(isDraftRichMenuTabGroup),
		[tabGroupsQuery?.data?.body?.data]
	)

	useEffect(() => {
		dispatch({
			type: RICHMENU_ACTIONS.SET,
			payload: {
				templates: templatesQuery?.data?.body.data
			}
		})
	}, [templatesQuery?.data?.body.data])

	useEffect(() => {
		dispatch({
			type: RICHMENU_ACTIONS.SET,
			payload: {
				tabGroups: tabGroupsQuery?.data?.body.data,
				defaultTabGroup: findDefaultTabGroup(),
				perUserTabGroup: findPerUserTabGroup(),
				draftTabGroups: findDraftTabGroups()?.sort((a: RichMenuTabGroup, b: RichMenuTabGroup) =>
					COMMONS.compareDateTime(b.updatedAt, a.updatedAt)
				)
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabGroupsQuery?.data?.body.data])

	// Memoize and replace initialized dispatch placeholder with actual method
	const memoizeValues = useMemo(
		() => ({
			dispatch: dispatch,
			state: state
		}),
		[dispatch, state]
	)

	return <RichMenuSettingsCtx.Provider value={memoizeValues}>{children}</RichMenuSettingsCtx.Provider>
}
