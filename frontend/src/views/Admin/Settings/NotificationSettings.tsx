import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Col, Descriptions, Image, Modal, Row, Table, Tag, Tooltip, message } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import {
	AdminNotificationModalComponent,
	BaseAnimationComponent,
	MemberNotificationModalComponent,
	PageHeaderComponent,
	SpectatorModalComponent,
	TapAnimationComponent
} from '@/components'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'

export const NotificationSettings = (props: Props) => {
	const { auth } = props
	const queryClient = useQueryClient()

	const layoutContext = useLayoutConfigContext()
	const { publicSettings } = layoutContext

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const [modal, contextHolder] = Modal.useModal()

	const [isMemberNotificationModalVisible, setIsMemberNotificationModalVisible] = useState(false)
	const [isAdminNotificationModalVisible, setIsAdminNotificationModalVisible] = useState(false)

	const [spectators, setSpectators] = useState([])
	const [currentSpectator, setCurrentSpectator] = useState(undefined)
	const [isSpectatorModalVisible, setIsSpectatorModalVisible] = useState<boolean>(false)

	useQuery([API.QUERY_KEY_ADMIN_SPECTATORS], () => API.ADMIN_GET_SPECTATORS(), {
		onSuccess: (response: FetchResponse) => {
			if (isMountedRef.current) {
				setSpectators(response?.data || [])
			}
		}
	})

	const removeSpectatorMutation = useMutation(API.ADMIN_REMOVE_SPECTATOR, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_SPECTATORS]
			})
		}
	})

	const showMemberNotificationModal = () => {
		setIsMemberNotificationModalVisible(true)
	}

	const hideMemberNotificationModal = () => {
		setIsMemberNotificationModalVisible(false)
	}

	const showAdminNotificationModal = () => {
		setIsAdminNotificationModalVisible(true)
	}

	const hideAdminNotificationModal = () => {
		setIsAdminNotificationModalVisible(false)
	}
	const showSpectatorModal = (spectator?: any) => {
		setCurrentSpectator(spectator)
		setIsSpectatorModalVisible(true)
	}

	const hideSpectatorModal = () => {
		setCurrentSpectator(undefined)
		setIsSpectatorModalVisible(false)
	}

	const handleSpectatorRemove = (spectator: {
		spectatorId: number
		Member: { firstName: string; lastName: string; displayName: string }
	}) => {
		const paramData = {
			spectatorId: spectator?.spectatorId
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className="text-red-600" />,
			content: (
				<p>
					<span className="text-red-600">
						「
						{spectator?.Member?.lastName && spectator?.Member?.firstName
							? `${spectator?.Member?.lastName} ${spectator?.Member?.firstName}`
							: spectator?.Member?.displayName || 'ー'}
						」
					</span>
					を管理者リストから削除してもよろしいでしょうか？
				</p>
			),
			okText: '削除',
			okType: 'danger',
			cancelText: '閉じる',
			centered: true,
			onOk() {
				removeSpectatorMutation.mutate(paramData)
			}
		})
	}

	const spectatorColumns = [
		{
			title: 'ID',
			dataIndex: 'spectatorId',
			align: 'center',
			width: 50
		},
		{
			title: '写真',
			dataIndex: 'picUrl',
			align: 'center',
			width: 50,
			render: (picUrl: string) =>
				picUrl ? (
					<Image
						preview={{
							mask: <EyeOutlined />,
							src: picUrl,
							maskClassName: 'rounded-full'
						}}
						src={`${picUrl}/large`}
						style={{ maxHeight: '50px' }}
						className="w-full rounded-full object-contain"
						fallback="/no-image.png"
					/>
				) : (
					<Image
						src="/no-image.png"
						preview={false}
						className="w-full rounded-full object-contain"
						style={{
							maxHeight: '50px'
						}}
					/>
				)
		},
		{
			title: 'LINE名・氏名',
			dataIndex: 'displayName',
			align: 'center',
			width: 150,
			render: (member: any) => {
				const name = member?.['memberAttributeId1']
				return (
					<>
						<p className="text-sm">{member?.displayName || 'ー'}</p>
						{/* <p className="text-xs">({`${name ?? 'ー'}`})</p> */}
					</>
				)
			}
		},
		{
			title: '通知設定',
			dataIndex: 'spectator',
			align: 'center',
			width: 200,
			render: (member: {
				isSpectatingMember: boolean
				isSpectatingCampaign: boolean
				isSpectatingRegistration: boolean
			}) => (
				<div className="flex flex-col">
					<div className="mb-2">
						<Tag
							className="mr-0 rounded-full px-4"
							color={member?.isSpectatingMember ? COMMONS.CUSTOM_GREEN : COMMONS.GRAY_COLOR}
						>
							新規お客様通知
						</Tag>
					</div>
					{/* <div className="mb-2">
						<Tag
							className="mr-0 rounded-full px-4"
							color={member?.isSpectatingCampaign ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}
						>
							新規キャンペーン応募通知
						</Tag>
					</div>
					<div>
						<Tag
							className="mr-0 rounded-full px-4"
							color={member?.isSpectatingRegistration ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}
						>
							予約通知（登録とキャンセル）
						</Tag>
					</div> */}
				</div>
			)
		},
		{
			title: '',
			dataIndex: 'action',
			align: 'center',
			width: 100,
			render: (spectator: any) => (
				<>
					<Tooltip title="編集" placement="top">
						<Button className="m-1" icon={<EditOutlined />} onClick={() => showSpectatorModal(spectator)} />
					</Tooltip>
					<Tooltip title="外す" placement="top">
						<Button
							className="m-1"
							icon={<DeleteOutlined />}
							danger
							loading={removeSpectatorMutation.isLoading}
							onClick={() => handleSpectatorRemove(spectator)}
						/>
					</Tooltip>
				</>
			)
		}
	]

	const GeneralNotificationSettingsCard = () => (
		<Card
			title="通知設定"
			bordered={true}
			type="inner"
			styles={{
				header: {
					color: publicSettings?.PRIMARY_COLOR?.valueString,
					backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
				}
			}}
			style={{
				borderColor: publicSettings?.PRIMARY_COLOR?.valueString
			}}
		>
			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial="hidden"
				animate="show"
				exit="hidden"
			>
				<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mt-4">
					<Card
						title="管理者通知"
						extra={
							<div className="flex">
								<TapAnimationComponent>
									<Button size="large" icon={<EditOutlined />} onClick={showAdminNotificationModal}>
										編集
									</Button>
								</TapAnimationComponent>
							</div>
						}
					>
						<Descriptions column={{ xs: 1, sm: 2 }} bordered layout="vertical">
							<Descriptions.Item label="会員証登録されると配信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.ADMIN_MESSAGE_MEMBER.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							{/* <Descriptions.Item label="新規キャンペーン応募が登録されると配信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.ADMIN_MESSAGE_CAMPAIGN.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							<Descriptions.Item label="新規予約が登録されると送信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.ADMIN_MESSAGE_RESERVATION.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							<Descriptions.Item label="予約がキャンセルされると送信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.ADMIN_MESSAGE_RESERVATION_CANCEL.valueString || 'ー'}
								</p>
							</Descriptions.Item> */}
						</Descriptions>
					</Card>
				</motion.div>
				<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
					<Card
						title="お客様通知"
						extra={
							<div className="flex">
								<TapAnimationComponent>
									<Button size="large" icon={<EditOutlined />} onClick={showMemberNotificationModal}>
										編集
									</Button>
								</TapAnimationComponent>
							</div>
						}
					>
						<Descriptions column={{ xs: 1, sm: 2 }} bordered layout="vertical">
							<Descriptions.Item label="会員証登録されると配信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.MEMBER_MESSAGE_POST_MEMBER_REGISTER.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							{/* <Descriptions.Item label="キャンペーン応募後に配信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.MEMBER_MESSAGE_CAMPAIGN.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							<Descriptions.Item label="予約後に配信されるメッセージ">
								<p className="whitespace-pre-wrap">
									{publicSettings?.MEMBER_MESSAGE_RESERVATION.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							<Descriptions.Item label="リマインドメッセージ（予約より3日前に配信される）">
								<p className="whitespace-pre-wrap">
									{publicSettings?.MEMBER_MESSAGE_REMIND1.valueString || 'ー'}
								</p>
							</Descriptions.Item>
							<Descriptions.Item label="リマインドメッセージ（予約より1日前に配信される）">
								<p className="whitespace-pre-wrap">
									{publicSettings?.MEMBER_MESSAGE_REMIND2.valueString || 'ー'}
								</p>
							</Descriptions.Item> */}
						</Descriptions>
					</Card>
				</motion.div>
			</motion.div>
		</Card>
	)
	const ManagerNotificationSettingsCard = () => (
		<Card
			title="管理者通知設定"
			bordered={true}
			type="inner"
			styles={{
				header: {
					color: publicSettings?.PRIMARY_COLOR?.valueString,
					backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
				}
			}}
			style={{
				borderColor: publicSettings?.PRIMARY_COLOR?.valueString
			}}
			extra={
				<div className="flex">
					<div>
						<TapAnimationComponent>
							<Button
								type="primary"
								size="large"
								icon={<PlusOutlined />}
								onClick={() => showSpectatorModal()}
							>
								管理者追加
							</Button>
						</TapAnimationComponent>
					</div>
				</div>
			}
		>
			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial="hidden"
				animate="show"
				exit="hidden"
			>
				<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
					<Table
						bordered
						size="small"
						//@ts-ignore
						columns={spectatorColumns}
						dataSource={
							spectators
								? spectators.map((spectator: { spectatorId: number; Member: { picUrl: string } }) => {
										return {
											key: spectator.spectatorId,
											spectatorId: spectator.spectatorId,
											picUrl: spectator?.Member?.picUrl,
											displayName: spectator.Member,
											spectator: spectator,
											action: spectator
										}
								  })
								: []
						}
						scroll={{
							x: 640,
							y: 720
						}}
						pagination={{
							responsive: true,
							showTotal: (total: number, range: number[]) => `全${total}件中${range[0]}～${range[1]}件目`,
							defaultCurrent: 1,
							defaultPageSize: 20,
							position: ['bottomCenter']
						}}
					/>
				</motion.div>
			</motion.div>
		</Card>
	)

	return (
		auth &&
		auth.auth &&
		auth.auth === COMMONS.AUTH_MASTER && (
			<>
				<BaseAnimationComponent>
					<PageHeaderComponent publicSettings={publicSettings} title="設定" />
					<Card bordered={false}>
						<Row gutter={[16, 16]}>
							<Col xs={24}>
								<ManagerNotificationSettingsCard />
							</Col>
							<Col xs={24}>
								<GeneralNotificationSettingsCard />
							</Col>
						</Row>
					</Card>
				</BaseAnimationComponent>
				<MemberNotificationModalComponent
					{...props}
					isMemberNotificationModalVisible={isMemberNotificationModalVisible}
					hideMemberNotificationModal={hideMemberNotificationModal}
				/>
				<AdminNotificationModalComponent
					{...props}
					isAdminNotificationModalVisible={isAdminNotificationModalVisible}
					hideAdminNotificationModal={hideAdminNotificationModal}
				/>
				<SpectatorModalComponent
					{...props}
					isSpectatorModalVisible={isSpectatorModalVisible}
					hideSpectatorModal={hideSpectatorModal}
					currentSpectator={currentSpectator}
				/>
				{contextHolder}
			</>
		)
	)
}

export default NotificationSettings
