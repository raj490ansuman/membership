/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useReducer, createContext } from 'react'
import { initialState, selectLayoutReducer } from './SelectLayout.reducer'
import { useState } from 'react'
import { useEffect } from 'react'
import { SET_DATA_DEFAULT_USER, SET_DATA_MEMBER_USER } from './SelectLayout.action'
import { API } from '@/utils'

import { memo } from 'react'

export const SelectLayoutContext = createContext({
	dispatch: () => {},
	isOpenImageTemplate: false,
	templateType: 'compact',
	handleSelectTemplate: () => {},
	setInitialValue: () => {},
	setIsOpenImageTemplate: () => {},
	state: initialState,
	selected: '',
	setSelected: () => {}
})

export const SelectLayoutProvider = memo((props :Richmenus) => {
	const [state, dispatch] = useReducer(selectLayoutReducer, initialState)

	const [isOpenImageTemplate, setIsOpenImageTemplate] = useState(false)
	const [templateType, setTemplateType] = useState('compact')
	const [selected, setSelected] = useState('')

	useEffect(() => {
		props.memberRM?.picUrl &&
			dispatch({
				type: SET_DATA_MEMBER_USER,
				payload: {
					...state.member,
					imgDefault: !!props.memberRM.template ? props.memberRM.template : '/template-after.png',
					inputNumber: countLink(props.memberRM),
					imgType: props.memberRM?.imgType || 'large',
					areas: JSON.parse(props.memberRM?.areas)
				}
			})
		props.defaultRM?.picUrl &&
			dispatch({
				type: SET_DATA_DEFAULT_USER,
				payload: {
					...state.default,
					imgDefault: !!props.defaultRM.template ? props.defaultRM.template : '/template-before.png',
					inputNumber: countLink(props.defaultRM),
					imgType: props.defaultRM?.imgType || 'compact',
					areas: JSON.parse(props.defaultRM?.areas)
				}
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.isRichmenuModalVisible])

	const countLink = (object) => {
		const links = Object.keys(object).filter(
			(key) => key.startsWith('link') && object[key] !== null && object[key] !== ''
		)
		return links.length
	}

	const observableImageSize = useCallback(
		(imgObserver) => {
			const img = new Image()
			img.onload = () => {
				selected === 'default'
					? dispatch({
							type: SET_DATA_DEFAULT_USER,
							payload: {
								...state.default,
								dimension: { width: img.width, height: img.height }
							}
					  })
					: dispatch({
							type: SET_DATA_MEMBER_USER,
							payload: {
								...state.member,
								dimension: { width: img.width, height: img.height }
							}
					  })
			}
			img.src = `${window.location.origin}/${imgObserver}`
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[selected, state.default.imgSelect, state.member.imgSelect]
	)

	useEffect(() => {
		state.default.imgSelect && observableImageSize(state.default.imgSelect)
		state.member.imgSelect && observableImageSize(state.member.imgSelect)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.default.imgSelect, state.member.imgSelect])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleSelectTemplate = (selected) => {
		setSelected(selected)
		setIsOpenImageTemplate(!isOpenImageTemplate)
	}

	const setInitialValue = useCallback(() => {
		return dispatch({ type: 'DEFAULT' })
	}, [])

	const memoizeValues = useMemo(
		() => ({
			dispatch: dispatch,
			handleSelectTemplate,
			setInitialValue,
			setIsOpenImageTemplate,
			setTemplateType,
			templateType: templateType,
			isOpenImageTemplate: isOpenImageTemplate,
			state: state,
			selected: selected
		}),
		[dispatch, handleSelectTemplate, setInitialValue, templateType, isOpenImageTemplate, state, selected]
	)

	return <SelectLayoutContext.Provider value={memoizeValues}>{props.children}</SelectLayoutContext.Provider>
})
