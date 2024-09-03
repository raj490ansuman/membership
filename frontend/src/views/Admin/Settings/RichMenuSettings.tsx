import {
	EyeInvisibleOutlined,
	EditOutlined,
	PlusOutlined,
	EllipsisOutlined,
	DeleteOutlined,
	EyeOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Image, Row, Table, Tabs, message, Dropdown } from 'antd'
import { API, COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import type { RichMenu } from '@schemas'
import {
	RICHMENU_ACTIONS,
	RichMenuTabGroup,
} from '../../../components/admin/Settings/RichMenu/RichMenuAction'
import {
	BaseAnimationComponent,
	PageHeaderComponent,
	TapAnimationComponent,
	RichmenuModalComponent,
} from '@/components'
import { useRichMenuSettingsContext } from '@/components/admin/Settings/RichMenu/RichMenuSettingsProvider'
import { useQueryClient } from '@tanstack/react-query'
import {
	queries,
	useDeleteRichMenuTabGroupMutation,
	usePublishRichMenuTabGroupMutation,
	useUnpublishRichMenuTabGroupMutation,
} from '@/queries'
import {
	INITIAL_TEMPLATES,
	combineUserDefinedActionsAndTemplateActions,
	isPublishableRichMenu,
	richMenuActionValueMap,
} from '@/utils/richmenu'
import { JSX } from 'react/jsx-runtime'

export const RichMenuSettings = (props: Props) => {
	const { auth, publicSettings } = props
	const richMenuSettingsCtx = useRichMenuSettingsContext()
	const {
		state: { defaultTabGroup, perUserTabGroup, draftTabGroups, tabGroups, templates },
		dispatch,
	} = richMenuSettingsCtx

	const queryClient = useQueryClient()
	const deleteRichMenuTabGroupMutation = useDeleteRichMenuTabGroupMutation()
	const publishRichMenuTabGroupMutation = usePublishRichMenuTabGroupMutation()
	const unpublishRichMenuTabGroupMutation = useUnpublishRichMenuTabGroupMutation()

	const deleteRichMenuTabGroup = (groupId: number | undefined) => {
		if (groupId == null) return
		deleteRichMenuTabGroupMutation.mutate(
			{
				body: {},
				params: { tabGroupId: groupId },
			},
			{
				onSuccess: (data) => {
					if (data?.body?.success) {
						message.success('リッチメニューの削除が完了しました')
						dispatch({ type: RICHMENU_ACTIONS.HIDE_MODAL })
						queryClient.invalidateQueries({
							queryKey: queries.richmenus.tabGroups.queryKey,
						})
					}
				},
			},
		)
	}

	const publishRichMenuTabGroup = (payload: { tabGroupId: number }) => {
		if (payload?.tabGroupId == null) return
		publishRichMenuTabGroupMutation.mutate(
			{
				params: { tabGroupId: payload.tabGroupId },
			},
			{
				onSuccess: (data) => {
					if (data?.body?.success) {
						message.success('リッチメニューの公開が完了しました')
						queryClient.invalidateQueries({
							queryKey: queries.richmenus.tabGroups.queryKey,
						})
					}
				},
			},
		)
	}

	const unpublishRichMenuTabGroup = (payload: { tabGroupId: number }) => {
		if (payload?.tabGroupId == null) return
		unpublishRichMenuTabGroupMutation.mutate(
			{
				params: { tabGroupId: payload.tabGroupId },
			},
			{
				onSuccess: (data) => {
					if (data?.body?.success) {
						message.success('リッチメニューを更新しました')
						queryClient.invalidateQueries({
							queryKey: queries.richmenus.tabGroups.queryKey,
						})
					}
				},
			},
		)
	}

	const canPublishTabGroup = (tabGroup: Partial<RichMenuTabGroup> | undefined) => {
		const isDefaultRichMenu = tabGroup?.displayPriority == 'DEFAULT'
		const isDraft = tabGroup?.status == 'DRAFT'
		const hasGroupId = tabGroup?.groupId != null
		const hasPublishableRichMenus = tabGroup?.richmenus?.every(isPublishableRichMenu)
		const publishedRichMenuAlreadyExists = isDefaultRichMenu
			? defaultTabGroup != null
			: perUserTabGroup != null

		return isDraft && hasGroupId && !publishedRichMenuAlreadyExists && hasPublishableRichMenus
	}

	const onPublishButtonClick = (tabGroup: Partial<RichMenuTabGroup> | undefined) => {
		if (canPublishTabGroup(tabGroup) && tabGroup?.groupId != null) {
			publishRichMenuTabGroup({
				tabGroupId: tabGroup.groupId,
			})
		} else {
			if (
				(tabGroup?.displayPriority === 'DEFAULT' && defaultTabGroup != null) ||
				(tabGroup?.displayPriority === 'USER' && perUserTabGroup != null)
			) {
				return message.error(
					'もう公開しているリッチメニューがあります。そのリッチメニューを非公開して、再公開して下さい。',
				)
			} else {
				return message.error(
					'公開に失敗しました。各リッチメニューの画像とテンプレートが設定されていることを確認して下さい。',
				)
			}
		}
	}

	const RichMenuTabActions = ({
		richMenu,
		tabIndex,
	}: {
		richMenu: Partial<RichMenu> | undefined
		tabIndex: number
	}) => {
		const combinedAreas = combineUserDefinedActionsAndTemplateActions({
			existingAreas: (richMenu && richMenu.areas) || [],
			templateName: (richMenu && richMenu.templateType) || null,
			templates: templates || INITIAL_TEMPLATES,
			useEmptyAction: true,
		})
		const items = combinedAreas.map(({ action }, index) => {
			const isPlaceholderAction = action.type === 'message' && action.text === '\n'
			const actionValueKey =
				richMenuActionValueMap[action.type as keyof typeof richMenuActionValueMap]

			let actionLabel =
				COMMONS.RICHMENU_INPUT_DISPLAY_LABEL[
					action.type as keyof typeof COMMONS.RICHMENU_INPUT_DISPLAY_LABEL
				]
			const content = action && action[actionValueKey]

			// Convert telephone uri type back to telephone type for display
			if (COMMONS.isValidJapanesePhoneNumber(action.uri as string)) {
				actionLabel = COMMONS.RICHMENU_INPUT_DISPLAY_LABEL['telephone']
			}
			const label = !isPlaceholderAction
				? `${String.fromCharCode(65 + index)} ${
						actionLabel ? `の${actionLabel}` : 'の内容'
				  }`
				: `${String.fromCharCode(65 + index)} の内容` // Converts 0 to A, 1 to B, etc.

			return {
				key: `tab-${tabIndex}-actions-${index}`,
				children: <>{content}</>,
				label: label,
				labelStyle: { width: '8.75rem' },
			}
		})
		return combinedAreas.length > 0 ? (
			<Descriptions column={1} bordered size='small' items={items} />
		) : (
			<span>まだ設定していません</span>
		)
	}

	const RichMenuTabGroupTable = ({
		richMenuTabGroups,
		isPublished,
	}: {
		richMenuTabGroups?: Array<Partial<RichMenuTabGroup> | undefined>
		isPublished: boolean
	}) => {
		// TODO: Revise this when we redesign
		const getTableColumns = (tabGroupIndex: number) => [
			{
				title: isPublished
					? ['会員登録前', '会員登録後'][tabGroupIndex]
					: richMenuTabGroups?.at(tabGroupIndex)?.displayPriority == 'DEFAULT'
					? '会員登録前'
					: '会員登録後',
				dataIndex: 'tabGroupTabs',
				key: 'tabGroupTabs',
				width: 250,
				className: '',
			},
			{
				title: 'タイトル',
				dataIndex: 'tabGroupTitle',
				key: 'tabGroupTitle',
				width: 150,
				className: ' align-top',
			},
			{
				title: 'アクション',
				dataIndex: 'tabGroupAreas',
				key: 'tabGroupAreas',
				width: 400,
				className: ' align-top',
			},
			{
				title: '',
				dataIndex: 'tabGroupOperations',
				key: 'tabGroupOperations',
				width: 30,
				className: ' text-center align-top',
			},
		]

		const TableRowImage = ({ imageName }: { imageName: string | null | undefined }) => (
			<Image
				src={`${API.UPLOADS_URL}/richmenus/${imageName}`}
				alt='リッチメニューの画像'
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'contain',
					maxHeight: '16rem',
				}}
				className='cursor-pointer'
				fallback='/no-image.png'
			/>
		)

		const getDraftTableRowData = (
			tabGroup: Partial<RichMenuTabGroup> | undefined,
			tabGroupIndex: number,
		) => {
			const TableTabGroupTabsData = () =>
				!tabGroup?.richmenus?.length || tabGroup?.richmenus?.length <= 1 ? (
					<TableRowImage imageName={tabGroup?.richmenus?.[0]?.imageName} />
				) : (
					<Tabs
						defaultActiveKey='1'
						items={tabGroup?.richmenus?.map((richMenu, richMenuIndex) => ({
							key: `tabGroup-${tabGroup.groupId}-richMenuTab-${richMenuIndex}`,
							label: `タブ ${richMenuIndex + 1}`,
							children: <TableRowImage imageName={richMenu.imageName} />,
						}))}
					/>
				)

			const renderLabel = (icon: JSX.Element, labelText: string | undefined) => (
				<>
					{icon}
					<span className='text-base ml-2'>{labelText}</span>
				</>
			)

			// TODO: We should extract these operations into a higher level for potential modal usage
			const publishedTableRowOperations = [
				{
					key: '0',
					label: renderLabel(<EyeInvisibleOutlined className='text-base' />, '非公開'),
					onClick: () =>
						tabGroup?.groupId &&
						unpublishRichMenuTabGroup({ tabGroupId: tabGroup?.groupId }),
				},
			]
			const unpublishedTableRowOperations = [
				{
					key: '0',
					label: renderLabel(<EyeOutlined className='text-base' />, '公開'),
					onClick: () => onPublishButtonClick(tabGroup),
				},
				{
					key: '1',
					label: renderLabel(<EditOutlined className='text-base' />, '編集'),
					onClick: () => {
						dispatch({
							type: RICHMENU_ACTIONS.SET_ACTIVE_EDIT_TAB_GROUP,
							payload: {
								activeEditTabGroup: tabGroups?.find(
									(g) => g.groupId === tabGroup?.groupId,
								),
							},
						})
						dispatch({ type: RICHMENU_ACTIONS.SHOW_MODAL })
					},
				},
				{
					key: '2',
					label: renderLabel(<DeleteOutlined className='text-base' />, '削除'),
					onClick: () => deleteRichMenuTabGroup(tabGroup?.groupId),
				},
			]

			return {
				key: `tabGroup-${tabGroup?.groupId}`,
				tabGroupTitle: tabGroup?.name ? tabGroup?.name : 'タイトル未設定',
				tabGroupTabs: <TableTabGroupTabsData />,
				tabGroupAreas: (
					<RichMenuTabActions
						richMenu={tabGroup?.richmenus?.[0]}
						key={`tab-${tabGroupIndex}-actions`}
						tabIndex={tabGroupIndex}
					/>
				),
				tabGroupOperations: tabGroup != null && (
					<Dropdown
						menu={{
							items: isPublished
								? publishedTableRowOperations
								: unpublishedTableRowOperations,
						}}
						trigger={['click']}
						placement='bottomRight'
					>
						<EllipsisOutlined />
					</Dropdown>
				),
			}
		}
		return (
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
				<Row align='top' gutter={[32, 32]}>
					<Col lg={24}>
						{!richMenuTabGroups || richMenuTabGroups?.length == 0 ? (
							<p>表示する項目はありません。[作成]ボタンから作成できます。</p>
						) : (
							richMenuTabGroups.map((tabGroup, tabGroupIndex) => (
								<Table
									key={`tabGroup-${tabGroupIndex}-table-${tabGroup?.groupId}`}
									pagination={{ position: ['none', 'none'] }}
									columns={getTableColumns(tabGroupIndex)}
									dataSource={[tabGroup]?.map(getDraftTableRowData)}
								/>
							))
						)}
					</Col>
				</Row>
			</motion.div>
		)
	}

	const ActiveRichMenuTabGroups = () => (
		<RichMenuTabGroupTable
			richMenuTabGroups={[defaultTabGroup, perUserTabGroup]}
			isPublished={true}
		/>
	)
	const DraftRichMenuTabGroups = () => (
		<RichMenuTabGroupTable richMenuTabGroups={draftTabGroups} isPublished={false} />
	)

	const richMenuTabGroupTabs = [
		{
			key: '0',
			label: '公開',
			children: <ActiveRichMenuTabGroups />,
		},
		{
			key: '1',
			label: '下書き',
			children: <DraftRichMenuTabGroups />,
		},
	]

	return (
		auth &&
		auth.auth &&
		auth.auth === COMMONS.AUTH_MASTER && (
			<>
				<BaseAnimationComponent>
					<PageHeaderComponent publicSettings={publicSettings} title='設定' />
					<Card bordered={false}>
						<Row gutter={[16, 16]}>
							<Col xs={24}>
								<Card
									title='リッチメニュー設定'
									bordered={true}
									type='inner'
									styles={{
										header: {
											color: publicSettings?.PRIMARY_COLOR?.valueString,
											backgroundColor:
												publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										},
									}}
									style={{
										borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
									}}
									extra={
										<div className='flex flex-wrap justify-end mt-1 gap-1'>
											<div>
												<TapAnimationComponent>
													<Button
														type='primary'
														size='large'
														icon={<PlusOutlined />}
														onClick={() => {
															dispatch({
																type: RICHMENU_ACTIONS.SET,
																payload: {
																	activeEditTabGroup: {
																		name: '',
																		richmenus: [],
																		displayPriority: 'DEFAULT',
																	},
																},
															})
															dispatch({
																type: RICHMENU_ACTIONS.SHOW_MODAL,
															})
														}}
													>
														作成
													</Button>
												</TapAnimationComponent>
											</div>
										</div>
									}
								>
									<motion.div
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial='hidden'
										animate='show'
										exit='hidden'
									>
										<Tabs defaultActiveKey='0' items={richMenuTabGroupTabs} />
									</motion.div>
								</Card>
							</Col>
						</Row>
					</Card>
				</BaseAnimationComponent>
				<RichmenuModalComponent deleteRichMenuTabGroup={deleteRichMenuTabGroup} />
			</>
		)
	)
}

export default RichMenuSettings
