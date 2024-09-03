// TODO: Consolidate enabling and disabling tabbed richmenus into single configuration point
import {
	Button,
	Form,
	Input,
	message,
	Modal,
	Col,
	Row,
	Tabs,
	Select,
	Collapse,
	Radio,
	Upload,
	Dropdown,
} from 'antd'
import type { FormInstance, FormListFieldData, RadioChangeEvent } from 'antd'
import { CameraTwoTone, SaveOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons'

import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { API, RICHMENU_HELPERS } from '@/utils'
import { RICHMENU_ACTIONS } from '../RichMenu/RichMenuAction'

import { MutateOptions, useQueryClient } from '@tanstack/react-query'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { useRichMenuSettingsContext } from '@/components/admin/Settings/RichMenu/RichMenuSettingsProvider'
import styled from 'styled-components'
import type { RichMenu, RichMenuArea, RichMenuTabGroup, RichMenuTemplateName } from '@schemas'
import {
	queries,
	useCreateRichMenuTabGroupMutation,
	useUpdateRichMenuTabGroupMutation,
	useUploadRichMenuImageMutation,
} from '@/queries'
import {
	FormValidatedRichMenuTabGroup,
	RichMenuCustomArea,
	UpdateRichMenuTabGroupMutationData,
	UpdateRichMenuTabGroupSuccessCallback,
	richMenuActionValueMap,
	richMenuActionValuePlaceholderText,
} from '@/utils/richmenu'
import { UploadFile } from 'antd/lib'
import type { CreateRichMenuTabGroupRequest, UpdateRichmenuTabGroupRequest } from '@schemas'
import {
	deepCopy,
	isURL,
	isValidJapanesePhoneNumber,
	isValidRichMenuImageFile,
	isValidRichMenuImageSize,
} from '@/utils/common'
import type { UploadChangeParam } from 'antd/es/upload'

const {
	getTemplateByName,
	saveUserDefinedActionsInNewTemplateActions,
	combineUserDefinedActionsAndTemplateActions,
} = RICHMENU_HELPERS

const MAX_RICHMENU_TABS = 1

const TemplateRadio = styled(Radio.Button)`
	label.ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
		&.ant-radio-button-wrapper-checked {
			border: 3px solid red;
		}
	}
`

const CustomUpload = styled(Upload)`
	.ant-upload {
		width: 100%;
	}
`

const TabGroupDetailActionsDiv = styled.div`
	.ant-dropdown-trigger {
		font-size: 18px;
		margin-right: 1.5em;
		position: relative;
		top: -4px;
	}
`

const placeholderRichMenu: Partial<RichMenu> = Object.freeze({
	size: {
		width: 800,
		height: 250,
	},
	areas: [],
	name: null,
	tabIndex: 0,
	selected: true,
	imageName: null,
	templateType: null,
	chatBarText: 'メニュー',
})

// TODO: Think of better way than passing methods in props
export const RichmenuModal = ({
	deleteRichMenuTabGroup,
}: {
	deleteRichMenuTabGroup: (groupId: number | undefined) => void
}) => {
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const { publicSettings } = useLayoutConfigContext()
	const richMenuSettingsCtx = useRichMenuSettingsContext()
	const {
		dispatch,
		state: { activeEditTabGroup, templates, isEditModalVisible },
	} = richMenuSettingsCtx

	const [activeTabKey, setActiveTabKey] = useState('0')

	const [form] = Form.useForm()
	const resetForm = () => {
		setActiveTabKey('0')
		form.resetFields()
		form.setFieldsValue({ name: '', richmenus: [], displayPriority: 'DEFAULT' })
		form.setFieldValue(['richmenus', '0', 'richmenuImage'], null)
	}

	const closeModal = () => {
		dispatch({ type: RICHMENU_ACTIONS.HIDE_MODAL })
		resetForm()
	}

	// Clear the action inputs if it is a placeholder action
	const clearRichMenuPlaceholderActionInputs = () => {
		activeEditTabGroup?.richmenus?.forEach((richMenu, richMenuIndex) => {
			if (richMenu?.areas && richMenu?.areas.length != 0) {
				richMenu?.areas?.forEach(({ action }, areaIndex) => {
					if (
						action.type === 'message' &&
						'text' in action &&
						action.text === 'メッセージ'
					) {
						form.setFieldValue(
							['richmenus', richMenuIndex, 'areas', areaIndex, 'action', 'type'],
							null,
						)
						form.setFieldValue(
							['richmenus', richMenuIndex, 'areas', areaIndex, 'action', 'text'],
							null,
						)
					}
				})
			}
		})
	}

	const initializeActiveTabGroup = () => {
		if (activeEditTabGroup?.richmenus?.length === 0)
			return activeEditTabGroup?.richmenus?.push(deepCopy(placeholderRichMenu))

		// Otherwise, check each richmenu tab to see if it has a template
		activeEditTabGroup?.richmenus?.forEach((richMenu, index) => {
			const userDefinedAreas = richMenu.areas
			// Initialize with template actions if the richmenu template is selected so we have the correct actions
			if (richMenu.templateType && templates && userDefinedAreas) {
				const combinedAreas = combineUserDefinedActionsAndTemplateActions({
					existingAreas: userDefinedAreas,
					templateName: richMenu.templateType,
					templates,
				})

				const skeleton = { ...deepCopy(richMenu), areas: combinedAreas }
				if (activeEditTabGroup.richmenus && activeEditTabGroup?.richmenus?.at(index))
					activeEditTabGroup.richmenus[index] = skeleton
			}
		})
	}
	// Initialize the first tab if it does not exist so we can create a new group
	initializeActiveTabGroup()

	useEffect(() => {
		// Ensure we're using the latest activeEditTabGroup to create the form state
		// This is because form caches state and resetFields resets to initialValue instead
		// of the latest state which may not prompt a rerender
		form.setFieldsValue({
			name: activeEditTabGroup?.name,
			richmenus: activeEditTabGroup?.richmenus,
			displayPriority: activeEditTabGroup?.displayPriority,
		})
		clearRichMenuPlaceholderActionInputs()
		// This should only fire on opening and closing of the modal
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeEditTabGroup?.richmenus])

	const queryClient = useQueryClient()
	const createRichMenuTabGroupMutation = useCreateRichMenuTabGroupMutation()
	const updateRichMenuTabGroupMutation = useUpdateRichMenuTabGroupMutation()
	const uploadRichMenuImageUseMutation = useUploadRichMenuImageMutation()

	const activeRichMenuTab = activeEditTabGroup?.richmenus?.at(Number(activeTabKey))
	const setRichMenuImageMutation = uploadRichMenuImageUseMutation({
		mutationKey: queries.richmenus.detail(activeRichMenuTab?.id || -1).queryKey,
	})

	const setRichMenuImage = async (payload: {
		image: File | UploadFile<any>
		richMenuId: number
	}) => {
		if (payload?.richMenuId == null) return Promise.reject()
		const response = await setRichMenuImageMutation.mutateAsync({
			body: {
				richmenuImage: payload.image as File,
			},
			params: {
				id: payload.richMenuId,
			},
		})

		if (isMountedRef.current && response?.body?.success) {
			// message.success('リッチメニューの設定が完了しました')
			// TODO: This should just invalidate the richmenu detail
			queryClient.invalidateQueries({ queryKey: queries.richmenus.tabGroups.queryKey })

			// Update image in activeEditTabGroup
			if (activeEditTabGroup?.richmenus?.length) {
				activeEditTabGroup.richmenus[Number(activeTabKey)].imageName =
					response.body.data.imageName
			}
			return Promise.resolve()
		}
	}

	const createNewRichMenuTabGroup = (payload: CreateRichMenuTabGroupRequest) =>
		new Promise<RichMenuTabGroup>((resolve, reject) =>
			createRichMenuTabGroupMutation.mutate(
				{
					body: payload,
				},
				{
					onSuccess: (data) => {
						const newRichMenuTabGroup = data?.body?.data
						resolve(newRichMenuTabGroup)
					},
					onError: (error) => {
						reject(error)
					},
				},
			),
		)

	const updateRichMenuTabGroup = ({
		groupId,
		payload,
		options,
	}: {
		groupId: number | undefined
		payload: UpdateRichmenuTabGroupRequest
		options?: MutateOptions<any, unknown, any, unknown>
	}) => {
		if (groupId == undefined) return
		updateRichMenuTabGroupMutation.mutate(
			{
				body: payload,
				params: { tabGroupId: groupId },
			},
			options,
		)
	}

	const handleTemplateChange = (e: RadioChangeEvent, tabIndex: number) => {
		if (!templates) return message.error(`天プレートがありません`)
		const tabGroupUpdate = {
			...deepCopy(activeEditTabGroup || {}),
			richmenus: form.getFieldValue(['richmenus']),
			name: form.getFieldValue(['name']),
			displayPriority: form.getFieldValue(['displayPriority']),
		}
		const newTemplateName: RichMenuTemplateName = e.target.value
		const newRichMenuTemplate = getTemplateByName(templates, newTemplateName)
		if (
			templates &&
			tabGroupUpdate &&
			tabGroupUpdate.richmenus &&
			tabGroupUpdate.richmenus.length > tabIndex &&
			tabIndex >= 0 &&
			newRichMenuTemplate
		) {
			// Backfill previous areas' action data and default to empty action for empty input
			const previousAreas = form.getFieldValue(['richmenus', tabIndex, 'areas'])

			const preservedAreas = saveUserDefinedActionsInNewTemplateActions({
				existingAreas: previousAreas,
				templateName: newTemplateName,
				templates,
			})

			tabGroupUpdate.richmenus[tabIndex] = {
				...deepCopy(placeholderRichMenu),
				...deepCopy(tabGroupUpdate?.richmenus?.[tabIndex]),
				...deepCopy(newRichMenuTemplate),
				areas: preservedAreas || newRichMenuTemplate?.areas || [],
				tabIndex,
				groupId: activeEditTabGroup?.groupId,
				templateType: newTemplateName as RichMenuTemplateName,
			}
			// We need to set the form values to reflect the change
			dispatch({
				type: RICHMENU_ACTIONS.SET_ACTIVE_EDIT_TAB_GROUP,
				payload: { activeEditTabGroup: { ...deepCopy(tabGroupUpdate) } },
			})
		}
	}

	const TemplateRadioOption = ({ templateSizeType }: { templateSizeType: string }) => (
		<div key={templateSizeType}>
			<div className='flex items-center space mb-2'>
				<Row className='w-full' justify='space-between'>
					<Col>
						<span className='text-lg'>
							{templateSizeType == 'large' ? '大：' : '小：'}
						</span>
						<span className='text-sm'>
							{templateSizeType == 'large'
								? '(リッチメニューのコンテンツを多く表示する場合におすすめです。)(1200px x 810px)'
								: '(トークルームにバランスよくリッチメニューを表示する場合におすすめです。)(1200px x 405px)'}
						</span>
					</Col>
				</Row>
			</div>
			<div>
				{templates &&
					templates?.[templateSizeType as keyof typeof templates]?.map(
						(template, templateIndex) => (
							<TemplateRadio
								key={templateIndex}
								value={template.name}
								className='max-w-60 h-full mb-2 mr-2 p-0'
							>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<img
										src={`/assets/${template.name}.png`}
										alt={template.name}
										className='w-60'
										style={{
											width: '190px',
											// height: key === 'compact' ? '80px' : '120px'
										}}
									/>
								</div>
							</TemplateRadio>
						),
					)}
			</div>
		</div>
	)

	const TemplateRadioGroup = ({ richMenuTabIndex }: { richMenuTabIndex: number }) => (
		<Radio.Group
			optionType='button'
			buttonStyle='outline'
			size='large'
			onChange={(e: RadioChangeEvent) => handleTemplateChange(e, richMenuTabIndex)}
		>
			{Object.keys(templates || {})
				.reverse()
				?.map((key, index) => (
					<TemplateRadioOption key={index} templateSizeType={key} />
				))}
		</Radio.Group>
	)

	const TemplateCollapse = ({ richMenuTabIndex }: { richMenuTabIndex: number }) => {
		const hasInitialTemplate = activeEditTabGroup?.richmenus?.at(richMenuTabIndex)?.templateType
		return (
			<Collapse
				size='small'
				expandIconPosition='end'
				className='items-center'
				items={[
					{
						key: '0',
						extra: (
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								{hasInitialTemplate ? '変更' : '選択'}
							</div>
						),
						label: !hasInitialTemplate ? (
							<>テンプレートが選択されていません</>
						) : (
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<img
									src={`/assets/${
										activeEditTabGroup?.richmenus?.at(richMenuTabIndex)
											?.templateType
									}.png`}
									className='w-60'
									style={{
										width: '190px',
										// height: key === 'compact' ? '80px' : '120px'
									}}
								/>
								{/* <span>テンプレート</span> */}
							</div>
						),
						children: <TemplateRadioGroup richMenuTabIndex={richMenuTabIndex} />,
					},
				]}
			/>
		)
	}

	const DisabledRichMenuActionCollapse = () => (
		<Collapse
			size='small'
			defaultActiveKey={'0'}
			items={[
				{
					key: '0',
					label: 'A',
					children: (
						<Row key={`subField.key$0`} justify='space-between'>
							<Col span={5}>
								<Form.Item className='mb-0' name={[0, 'action', 'type']}>
									<Select
										placeholder='タイプ'
										allowClear
										disabled
										options={COMMONS.RICHMENU_INPUT_OPTIONS.map((option) => ({
											value: option.value,
											label: option.label,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col span={18}>
								<Form.Item className='mb-0' name={[0, 'action', 'text']}>
									<Input disabled placeholder='内容' />
								</Form.Item>
							</Col>
						</Row>
					),
				},
			]}
		/>
	)

	const RichMenuActionsCollapse = ({
		richMenuTabIndex,
		formInstance,
		subFields,
	}: {
		richMenuTabIndex: number
		formInstance: FormInstance
		subFields: FormListFieldData[]
	}) => (
		<Collapse
			size='small'
			defaultActiveKey={subFields.map((subField) => subField.name)}
			items={subFields.map((subField, subIndex) => ({
				key: subField.name,
				label: `${String.fromCharCode(65 + subIndex)}`, // Converts 0 to A, 1 to B, etc.
				children: (
					<Row key={`subField.key${subIndex}`} justify='space-between'>
						<Col span={5}>
							<Form.Item className='mb-0' name={[subField.name, 'action', 'type']}>
								<Select
									placeholder='タイプ'
									allowClear
									options={COMMONS.RICHMENU_INPUT_OPTIONS.map((option) => ({
										value: option.value,
										label: option.label,
									}))}
									onChange={(selectionValue: string) => {
										// Handle 会員証リンク
										if (selectionValue == 'customUriMembership') {
											form.setFieldValue(
												[
													'richmenus',
													richMenuTabIndex,
													'areas',
													subField.name,
													'action',
													richMenuActionValueMap[
														formInstance.getFieldValue([
															'richmenus',
															richMenuTabIndex,
															'areas',
															subIndex,
															'action',
															'type',
														]) as keyof typeof richMenuActionValueMap
													],
												],
												import.meta.env.VITE_APP_LINE_LIFF_ACCOUNT_URL ||
													'',
											)
										}
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={18}>
							{/* TODO: Create various input types based on the type: text input, telephone input, dropdown, etc */}
							<Form.Item
								className='mb-0'
								name={[
									subField.name,
									'action',
									richMenuActionValueMap[
										formInstance.getFieldValue([
											'richmenus',
											richMenuTabIndex,
											'areas',
											subIndex,
											'action',
											'type',
										]) as keyof typeof richMenuActionValueMap // We use the action type to determine the input value type
									],
								]}
								dependencies={[
									'richmenus',
									richMenuTabIndex,
									'areas',
									subField.name,
									'action',
									'type',
								]}
								rules={[
									{
										pattern:
											/^(tel:?)?(0\d{1,4}-?\d{1,4}-?\d{3,4}|0[789]0-\d{4}-?\d{4}|050-?\d{4}-?\d{4}|\+?\d{1,2}?[-\s]?(\(\d{2,}\)?\d+[-\s]?\d{3,5}[-\s]?\d{3,4}|\d{7,12}))$/,
										required: true,
										message: '電話番号は半角数字10桁以上で入力をお願いします。',
										validator: (_rule, value) => {
											const rawActionType = formInstance.getFieldValue([
												'richmenus',
												richMenuTabIndex,
												'areas',
												subField.name,
												'action',
												'type',
											])

											if (
												rawActionType === 'telephone' &&
												!isValidJapanesePhoneNumber(value)
											) {
												return Promise.reject()
											}
											return Promise.resolve()
										},
									},
									{
										type: 'url',
										required: true,
										message: '入力のURLが有効なURLではありません',
										validator: (_rule, value) => {
											const rawActionType = formInstance.getFieldValue([
												'richmenus',
												richMenuTabIndex,
												'areas',
												subField.name,
												'action',
												'type',
											])
											const actionType =
												richMenuActionValueMap[
													rawActionType as keyof typeof richMenuActionValueMap
												]
											// Validate as url if the action type is uri
											if (
												rawActionType != 'telephone' &&
												actionType === 'uri' &&
												!isURL(value)
											) {
												return Promise.reject()
											}
											return Promise.resolve()
										},
									},
								]}
							>
								<Input
									placeholder={
										richMenuActionValuePlaceholderText[
											formInstance.getFieldValue([
												'richmenus',
												richMenuTabIndex,
												'areas',
												subField.name,
												'action',
												'type',
											]) as keyof typeof richMenuActionValuePlaceholderText
										] || '内容'
									}
								/>
							</Form.Item>
						</Col>
					</Row>
				),
			}))}
		/>
	)

	const RichMenuTabContent = ({ richMenuTabIndex }: { richMenuTabIndex: number }) => {
		return (
			<Row
				className='flex flex-row items-start justify-items-stretch'
				gutter={16}
				justify='space-between'
			>
				<Col className='w-full'>
					<Form.Item
						label={'テンプレート'}
						// rules={[{ required: true, message: 'テンプレートを選択してください' }]}
						name={[richMenuTabIndex, 'templateType']}
					>
						<TemplateCollapse richMenuTabIndex={richMenuTabIndex} />
					</Form.Item>
					<div className='flex w-full justify-center min-h-72 items-center'>
						<div className='w-2/5'>
							<RichMenuTabImageUpload tabIndex={richMenuTabIndex} />
						</div>
					</div>

					{/* Nest Form.List */}
					<Form.Item label={'アクション'} shouldUpdate>
						{(formInstance) => (
							<Form.List name={[richMenuTabIndex, 'areas']}>
								{(subFields) =>
									subFields.length === 0 ? (
										<DisabledRichMenuActionCollapse />
									) : (
										<RichMenuActionsCollapse
											richMenuTabIndex={richMenuTabIndex}
											formInstance={formInstance}
											subFields={subFields}
										/>
									)
								}
							</Form.List>
						)}
					</Form.Item>
				</Col>
			</Row>
		)
	}

	const onTabsChange = (newActiveKey: string) => {
		setActiveTabKey(newActiveKey)
	}

	const addTab = () => {
		const numRichMenuTabs = activeEditTabGroup?.richmenus?.length
		if (numRichMenuTabs && !isNaN(numRichMenuTabs)) {
			const richMenuScaffold = {
				...deepCopy(placeholderRichMenu),
				groupId: activeEditTabGroup && activeEditTabGroup?.richmenus?.at(0)?.groupId,
				tabIndex: numRichMenuTabs - 1,
			}
			// Add a new tab
			activeEditTabGroup?.richmenus?.push(richMenuScaffold)

			// Typically we would subtract 1 for zero-indexing, but we just added a new tab
			setActiveTabKey(String(numRichMenuTabs))

			// Set the new tab's form section to prompt a rerender
			form.setFieldValue(['richmenus', numRichMenuTabs], richMenuScaffold)
		}
	}

	const removeTab = (targetKey: string) => {
		if (!activeEditTabGroup) return
		const newActiveKey = Number(activeTabKey) == 0 ? '0' : Number(activeTabKey) - 1

		const richMenuFormValues = form.getFieldValue(['richmenus'])

		// Update with the latest form values before removing
		activeEditTabGroup.richmenus = richMenuFormValues
		activeEditTabGroup?.richmenus?.splice(Number(targetKey), 1)

		setActiveTabKey(String(newActiveKey))
		form.setFieldsValue({ richmenus: activeEditTabGroup?.richmenus })
	}

	const onTabsEdit = (
		targetKey: React.MouseEvent | React.KeyboardEvent | string,
		action: 'add' | 'remove',
	) => {
		if (action === 'remove' && typeof targetKey === 'string') {
			removeTab(targetKey)
		} else {
			addTab()
		}
	}

	const filterRichMenuTabsFormData = (richMenuTabsData: RichMenu[]) => {
		// Filter function out empty actions
		const filterEmptyRichMenuActions = (area: RichMenuArea) => {
			const { action } = area
			return action?.type && Object.keys(action).length > 1
		}
		// Filter select values for custom uri
		const normalizeCustomUriRichMenuActions = (area: RichMenuCustomArea) => {
			const action = area.action
			// Handle custom uri type such as 会員証リンク
			if (
				action?.type.includes('customUriMembership') ||
				action?.type.includes('telephone')
			) {
				// Prepend 'tel:' to telephone number and convert type from telephone to uri link for LINE API
				if (
					action?.type.includes('telephone') &&
					!(action.uri as string).startsWith('tel:')
				) {
					area.action.uri = `tel:${action.uri}`
				}
				area.action.type = 'uri'
			}
			return area
		}
		return richMenuTabsData.map((richMenu: RichMenu, index: number) => {
			const isSelected = index === 0
			const filteredAreas = richMenu?.areas
				?.filter(filterEmptyRichMenuActions)
				.map(normalizeCustomUriRichMenuActions)
			return {
				...deepCopy(richMenu),
				areas: filteredAreas,
				selected: isSelected,
				name: null,
				tabIndex: index,
			}
		})
	}

	/**
	 * Performs form validation before saving, then delegates success callback to caller.
	 * Since saving can occur in multiple ways, some example use cases include:
	 * 1. Saving then closing modal
	 * 		- Validate, mutation, close modal
	 * 2. Saving then publishing then closing modal
	 * 		- Validate, mutation, publish, close modal
	 * 3. Saving before image upload
	 * 		- Validate, mutation, image mutations only
	 * @param mutationSuccessCallback
	 */
	const saveActiveEditTabGroup = async (
		mutationSuccessCallback?: UpdateRichMenuTabGroupSuccessCallback,
	) => {
		// TODO: Determine final order of tabIndex, selected, chatBarText
		// TODO: Refactor to do multiple dependent queries: unpublish, update, publish
		const richMenuTabsData = form.getFieldValue(['richmenus'])
		const tabGroupName = form.getFieldValue(['name']) || ''
		const tabGroupDisplayPriority = form.getFieldValue(['displayPriority']) || 'DEFAULT'

		// Check each rich menu for selected template (size and areas are required)
		const filteredRichMenuTabsData = filterRichMenuTabsFormData(deepCopy(richMenuTabsData))

		try {
			const validatedTabGroup: FormValidatedRichMenuTabGroup = await form.validateFields()
			// TODO: Investigate why validatedTabGroup does not persis richmenuImage in the form so
			// We deep copy because validatedTabGroup somehow changes after the following mutation
			const validatedTabGroupDeepCopy: FormValidatedRichMenuTabGroup =
				deepCopy(validatedTabGroup)
			let newTabGroup = null
			// Create the tab group first before updating
			if (activeEditTabGroup?.groupId == undefined) {
				newTabGroup = await createNewRichMenuTabGroup({
					name: tabGroupName,
					displayPriority: tabGroupDisplayPriority,
				})
			}
			updateRichMenuTabGroup({
				groupId: newTabGroup?.groupId || activeEditTabGroup?.groupId,
				payload: {
					name: tabGroupName,
					richmenus: filteredRichMenuTabsData,
					displayPriority: tabGroupDisplayPriority,
				},
				options: {
					onSuccess: async (data: UpdateRichMenuTabGroupMutationData) => {
						if (isMountedRef.current && data?.body?.success) {
							// Check if there are images need to be uploaded from the form
							await Promise.all(
								validatedTabGroupDeepCopy.richmenus.map(
									async (richMenu, richMenuIndex) => {
										const richMenuId =
											data?.body?.data?.richmenus?.at(richMenuIndex)?.id
										if (
											richMenu?.richmenuImage?.file != null &&
											richMenuId != null
										) {
											await setRichMenuImage({
												richMenuId: richMenuId,
												image: richMenu.richmenuImage.file,
											})
										}
									},
								),
							)
						}
						return (
							mutationSuccessCallback &&
							mutationSuccessCallback({
								data,
								validatedTabGroup: validatedTabGroupDeepCopy,
							})
						)
					},
				},
			})
		} catch (error: unknown) {
			const errorInfo = error as { values: any; errorFields: Array<any>; outOfDate: boolean }
			if (errorInfo.errorFields.length > 0) {
				// Handle various errors
				// console.log(errorInfo)
				message.error(errorInfo.errorFields[0].errors[0])
			}
		}
	}

	const SaveButton = () => (
		<TapAnimationComponent>
			<Button
				type='primary'
				size='large'
				icon={<SaveOutlined />}
				onClick={async () =>
					await saveActiveEditTabGroup(async ({ data }) => {
						if (isMountedRef.current && data?.body?.success) {
							// TODO: We should set query cache data here on return data instead of invalidating as another fetch
							queryClient.invalidateQueries({
								queryKey: queries.richmenus.tabGroups.queryKey,
							})
							closeModal()
						}
					})
				}
			>
				保存
			</Button>
		</TapAnimationComponent>
	)

	const tabGroupDetailActions = [
		{
			key: '0',
			label: (
				<>
					<DeleteOutlined className='text-base' />
					<span className='text-base ml-2'>削除</span>
				</>
			),
			onClick: () => deleteRichMenuTabGroup(activeEditTabGroup?.groupId),
		},
	]

	const RichMenuTabImageUpload = ({ tabIndex }: { tabIndex: number }) => {
		const [uploadedImageHover, setUploadedImageHover] = useState(false)
		const activeRichMenuTab = activeEditTabGroup?.richmenus?.at(tabIndex)
		const imageName = activeRichMenuTab?.imageName
		const uploadExists = form.getFieldValue(['richmenus', tabIndex, 'richmenuImage'])
		const [imageSrc, setImageSrc] = useState(
			imageName
				? `${API.UPLOADS_URL}/richmenus/${imageName}`
				: uploadExists && uploadExists?.file != null
				? URL.createObjectURL(uploadExists?.file) // Create temp blob link for preview
				: '',
		)

		const uploadRichMenuImage = async (upload: UploadChangeParam<UploadFile<any>>) => {
			// const currentRichMenu = activeEditTabGroup?.richmenus?.at(tabIndex)
			// const isCompactTemplate = currentRichMenu?.templateType?.includes('TEMPLATE_10')
			if (upload?.file?.size === undefined) {
				// TODO: Handle image upload before template selection and rich menu tab group creation
				return message.warning('アップロードするエラーが発生しました')
			}

			if (!isValidRichMenuImageFile(upload.file as unknown as File))
				return message.warning(COMMONS.WARN_INVALID_RICHMENU_IMG_FORMAT)

			const reader = new FileReader()
			reader.readAsDataURL(upload?.file as unknown as Blob)
			reader.addEventListener('load', (event) => {
				const _loadedImageUrl = event?.target?.result as string
				const image = document.createElement('img')
				image.id = `richmenutab-${tabIndex}-uploaded-image`
				image.src = _loadedImageUrl
				image.addEventListener('load', async () => {
					const { width, height } = image

					if (isValidRichMenuImageSize(width, height)) {
						// Only set the image src and persist if save is pressed
						setImageSrc(String(_loadedImageUrl))
					} else {
						message.warning(COMMONS.WARN_INVALID_RICHMENU_IMG_FORMAT, 3)
					}
				})
			})
		}

		const ImagePreview = () => (
			<div
				className='relative'
				style={{ minHeight: '250px' }}
				onMouseEnter={() => imageSrc && setUploadedImageHover(true)}
				onMouseLeave={() => imageSrc && setUploadedImageHover(false)}
			>
				<img
					src={imageSrc}
					hidden={!imageSrc}
					alt='リッチメニュー画像'
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
					className='cursor-pointer'
				/>
				{!uploadedImageHover && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							zIndex: 1,
							alignContent: 'center',
							justifyContent: 'center',
							gridAutoFlow: 'column',
						}}
					>
						<ImageUpload />
					</div>
				)}
			</div>
		)
		const ImageUpload = () => (
			<div
				style={{
					height: '100%',
					minHeight: !imageName ? '250px' : '',
					border: '1px dashed #d9d9d9',
					backgroundColor:
						!imageName &&
						!imageSrc.startsWith('data:image') &&
						!imageSrc.startsWith('blob:')
							? 'rgba(250, 250, 250, 0.7)'
							: 'rgba(250, 250, 250, 0.4)',
					zIndex: 1,
				}}
				className='flex justify-center items-center mx-auto rounded cursor-pointer'
			>
				<TapAnimationComponent>
					<Button
						type='dashed'
						icon={
							<CameraTwoTone
								twoToneColor={publicSettings?.PRIMARY_COLOR?.valueString}
							/>
						}
					>
						アップロード
					</Button>
				</TapAnimationComponent>
			</div>
		)
		return (
			<Form.Item
				name={[tabIndex, 'richmenuImage']}
				className='whitespace-pre-wrap text-center my-auto'
				valuePropName='file'
				initialValue={{ file: null, fileList: [] }}
			>
				<CustomUpload
					accept='.jpg, .jpeg, .png'
					listType='picture'
					maxCount={1}
					showUploadList={false}
					beforeUpload={() => {
						return false
					}}
					onChange={uploadRichMenuImage}
				>
					<ImagePreview />
				</CustomUpload>
			</Form.Item>
		)
	}

	return (
		<Form initialValues={activeEditTabGroup} layout='vertical' form={form} preserve={false}>
			<Modal
				open={isEditModalVisible}
				onCancel={closeModal}
				title={
					<TabGroupDetailActionsDiv className='flex justify-between'>
						<span>リッチメニュー作成</span>
						<Dropdown
							menu={{ items: tabGroupDetailActions }}
							trigger={['click']}
							placement='bottomRight'
						>
							<EllipsisOutlined />
						</Dropdown>
					</TabGroupDetailActionsDiv>
				}
				footer={
					<div className='flex flex-wrap justify-center items-center gap-1'>
						<SaveButton />
					</div>
				}
				getContainer={false}
				destroyOnClose
				width={1000}
				centered
				style={{
					maxHeight: '90vh',
					overflowY: 'auto',
					overflowX: 'hidden',
				}}
			>
				<motion.div
					className='flex flex-col'
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
				>
					<Form.Item label={'タイトル'} name='name'>
						<Input />
					</Form.Item>
					<Form.Item label={'表示'} name='displayPriority'>
						<Radio.Group buttonStyle='solid'>
							<Radio.Button value='DEFAULT'>会員登録前</Radio.Button>
							<Radio.Button value='USER'>会員登録後</Radio.Button>
						</Radio.Group>
					</Form.Item>
					<Form.List name='richmenus'>
						{(richMenuTabs) => (
							<Tabs
								renderTabBar={() => <></>} // Disables tab bar
								type='editable-card'
								onChange={onTabsChange}
								activeKey={activeTabKey}
								onEdit={onTabsEdit}
								hideAdd={richMenuTabs.length == MAX_RICHMENU_TABS}
								items={activeEditTabGroup?.richmenus?.map(
									(_richMenuTab, index) => ({
										label: `タブ ${index + 1}`,
										children: <RichMenuTabContent richMenuTabIndex={index} />,
										key: String(index),
										forceRender: true,
										closable: (activeEditTabGroup?.richmenus?.length ?? 0) > 1,
									}),
								)}
							/>
						)}
					</Form.List>
				</motion.div>
			</Modal>
		</Form>
	)
}

export default RichmenuModal
