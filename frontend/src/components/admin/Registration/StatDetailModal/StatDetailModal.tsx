import { Button, message, Modal, Badge, Tooltip, Divider, Table } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { EyeOutlined, CommentOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ChatModalComponent, MemberDetailModalComponent, TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useState } from 'react'
import { AxiosError } from 'axios'

const StatDetailModal = (props) => {
	const { publicSettings, isStatDetailModalVisible, hideStatDetailModal, currentDate, currentRegistrations } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [categories, setCategories] = useState([])
	const [occasions, setOccasions] = useState([])
	const [currentMemberId, setCurrentMemberId] = useState(undefined)
	const [currentMember, setCurrentMember] = useState(undefined)

	const [isChatModalVisible, setIsChatModalVisible] = useState(false)
	const [isMemberDetailModalVisible, setIsMemberDetailModalVisible] = useState(false)

	const [modal, contextHolder] = Modal.useModal()

	const includePic = true
	const includeDestroyed = false

	useQuery(
		[API.QUERY_KEY_ADMIN_CATEGORY_LIST, includePic, includeDestroyed],
		() => API.ADMIN_GET_CATEGORY_LIST(includePic, includeDestroyed),
		{
			enabled: isStatDetailModalVisible,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setCategories(response?.data || [])
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
					navigate(COMMONS.PERMISSION_ERROR_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
					message.warning({
						content: COMMONS.ERROR_SESSION_MSG,
						key: COMMONS.MESSAGE_SESSION_ERROR_KEY
					})
					navigate(COMMONS.ADMIN_LOGIN_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
					})
				} else {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
					})
				}
			}
		}
	)

	useQuery(
		[API.QUERY_KEY_ADMIN_OCCASION_LIST, includePic, includeDestroyed],
		() => API.ADMIN_GET_OCCASION_LIST(includePic, includeDestroyed),
		{
			enabled: isStatDetailModalVisible,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setOccasions(response?.data || [])
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
					navigate(COMMONS.PERMISSION_ERROR_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
					message.warning({
						content: COMMONS.ERROR_SESSION_MSG,
						key: COMMONS.MESSAGE_SESSION_ERROR_KEY
					})
					navigate(COMMONS.ADMIN_LOGIN_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
					})
				} else {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
					})
				}
			}
		}
	)

	useQuery(
		[API.QUERY_KEY_ADMIN_MEMBER_DETAIL, currentMemberId],
		() => API.ADMIN_GET_MEMBER({ memberId: currentMemberId }),
		{
			enabled: isStatDetailModalVisible && !!currentMemberId,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setCurrentMember(response?.data || undefined)
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
					navigate(COMMONS.PERMISSION_ERROR_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
					message.warning({
						content: COMMONS.ERROR_SESSION_MSG,
						key: COMMONS.MESSAGE_SESSION_ERROR_KEY
					})
					navigate(COMMONS.ADMIN_LOGIN_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
					})
				} else {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
					})
				}
			}
		}
	)

	const registrationCancelMutation = useMutation(API.ADMIN_CANCEL_REGISTRATION, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_CANCEL_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS]
			})
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
				})
			}
		}
	})

	const handleRegistrationCancel = (registration) => {
		const paramData = {
			registrationId: registration?.registrationId
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className="text-red-600" />,
			content: (
				<p>
					<span className="text-red-600">{`${registration?.Member?.lastName || 'ー'}${
						registration?.Member?.firstName || 'ー'
					}`}</span>
					様の予約をキャンセルしてもよろしいでしょうか？
				</p>
			),
			okText: 'キャンセル',
			okButtonProps: {
				size: 'large',
				type: 'primary',
				danger: true
			},
			cancelText: '閉じる',
			cancelButtonProps: {
				size: 'large'
			},
			centered: true,
			onOk() {
				registrationCancelMutation.mutate(paramData)
			}
		})
	}

	const showChatModal = (registration) => {
		setCurrentMemberId(registration?.memberId)
		setIsChatModalVisible(true)
	}

	const hideChatModal = () => {
		setCurrentMemberId(undefined)
		setIsChatModalVisible(false)
	}

	const showMemberDetailModal = (registration) => {
		setCurrentMemberId(registration?.memberId)
		setIsMemberDetailModalVisible(true)
	}

	const hideMemberDetailModal = () => {
		setCurrentMemberId(undefined)
		setCurrentMember(undefined)
		setIsMemberDetailModalVisible(false)
	}

	const registrationColumns = [
		{
			title: 'お客様',
			dataIndex: 'registration',
			align: 'center',
			width: 200,
			render: (registration) => {
				const name = registration?.Member?.['memberAttributeId1']
				return registration?.isManual || !registration?.memberId ? (
					<>
						<p>{`${registration?.Member?.lastName || ''} ${registration?.Member?.firstName || ''}`}</p>
						<p className="text-xs text-gray-400">
							（
							{`${registration?.Member?.lastNameKana || ''} ${
								registration?.Member?.firstNameKana || ''
							}）`}
						</p>
					</>
				) : (
					<Link to={`${COMMONS.ADMIN_MEMBERS_ROUTE}?memberId=${registration?.memberId}`}>
						<p className="text-base">{`${registration?.Member?.displayName}` || ''}</p>
						<p className="text-sm">{`${name}` || ''}</p>
					</Link>
				)
			}
		},
		{
			title: '電話番号',
			dataIndex: 'telephone',
			align: 'center',
			render: (value, row) => {
				const dataPhoneNumber = row?.registration?.Member?.['memberAttributeId2']
				return row?.registration?.isManual ? (
					<p> {value}</p>
				) : (
					<p className="text-base">{dataPhoneNumber || ''}</p>
				)
			}
		},
		{
			title: COMMONS.DEFAULT_SYSTEM_TYPE,
			dataIndex: 'registration',
			align: 'center',
			render: (registration) => (
				<>
					<Link
						to={
							API.IS_CATEGORY_VERSION
								? `${COMMONS.ADMIN_CATEGORIES_ROUTE}/${registration?.categoryId}`
								: `${COMMONS.ADMIN_CATEGORIES_ROUTE}/${registration?.categoryId}/${registration?.occasionId}`
						}
					>
						<p>{categories.find((c) => c?.categoryId === registration?.categoryId)?.title || 'ー'}</p>
						{!API.IS_CATEGORY_VERSION && (
							<p>
								（{occasions.find((c) => c?.occasionId === registration?.occasionId)?.title || 'ー'}）
							</p>
						)}
					</Link>
				</>
			)
		},
		{
			title: '予約時間',
			dataIndex: 'registration',
			align: 'center',
			width: 100,
			render: (registration) => (
				<p>{registration?.startAt ? moment(registration?.startAt).format('HH:mm') : 'ー'}</p>
			)
		},
		{
			title: '予約メッセージ・備考',
			dataIndex: 'registration',
			align: 'center',
			render: (registration) => (
				<>
					<p className="text-center whitespace-pre-wrap text-xs">{registration?.message || 'ー'}</p>
					{registration?.remarks ? (
						<div className="mt-4">
							<p className="text-xs text-center whitespace-pre-wrap bg-gray-100 rounded p-1">
								{registration.remarks}
							</p>
						</div>
					) : (
						''
					)}
				</>
			)
		},
		{
			title: '',
			dataIndex: 'action',
			align: 'center',
			width: 220,
			render: (registration) => (
				<>
					<TapAnimationComponent className="inline-block">
						<Tooltip title="お客様詳細" placement="top">
							<Button
								size="large"
								className="m-1"
								icon={<EyeOutlined />}
								onClick={() => {
									showMemberDetailModal(registration)
								}}
							/>
						</Tooltip>
					</TapAnimationComponent>
					{!registration?.isManual && registration?.memberId ? (
						<>
							<Divider type="vertical" />
							<TapAnimationComponent className="inline-block">
								<Badge
									style={{ backgroundColor: COMMONS.CUSTOM_GREEN }}
									count={registration?.unreadCount || 0}
								>
									<Tooltip title="LINEチャット" placement="top">
										<Button
											size="large"
											className="m-1"
											icon={<CommentOutlined />}
											onClick={() => showChatModal(registration)}
										/>
									</Tooltip>
								</Badge>
							</TapAnimationComponent>
						</>
					) : (
						''
					)}
					<Divider type="vertical" />
					<TapAnimationComponent className="inline-block">
						<Tooltip title="予約キャンセル" placement="top">
							<Button
								size="large"
								className="m-1"
								icon={<StopOutlined />}
								danger
								onClick={() => {
									handleRegistrationCancel(registration)
								}}
							/>
						</Tooltip>
					</TapAnimationComponent>
				</>
			)
		}
	]

	return (
		<>
			<Modal
				open={isStatDetailModalVisible}
				onCancel={hideStatDetailModal}
				title={`${currentDate ? moment(currentDate).format('YYYY年M月D日') : ''}の予約リスト`}
				footer={null}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
				maskClosable={false}
				width={1024}
				destroyOnClose
				centered
			>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="mb-8"
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<p
							className="px-4 py-2 text-lg text-center font-bold mb-4 rounded"
							style={{
								backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
								color: publicSettings?.PRIMARY_COLOR?.valueString
							}}
						>
							予約のお客様一覧
						</p>
						<Table
							$publicSettings={publicSettings}
							bordered
							size="large"
							columns={registrationColumns}
							scroll={{ x: 'max-content' }}
							locale={{ emptyText: '予約がありません。' }}
							pagination={{
								responsive: true,
								showTotal: (total, range) => `全${total}件中${range[0]}～${range[1]}件目`,
								defaultCurrent: 1,
								defaultPageSize: 20,
								position: ['bottomCenter']
							}}
							dataSource={
								currentRegistrations
									? currentRegistrations.map((registration) => {
											return {
												key: registration?.registrationId,
												telephone: registration?.Member?.telephone || 'ー',
												registration: registration,
												action: registration
											}
									  })
									: []
							}
						/>
					</motion.div>
				</motion.div>
			</Modal>
			<MemberDetailModalComponent
				{...props}
				isMemberDetailModalVisible={isMemberDetailModalVisible}
				hideMemberDetailModal={hideMemberDetailModal}
				currentMember={currentMember}
			/>
			<ChatModalComponent
				{...props}
				isChatModalVisible={isChatModalVisible}
				hideChatModal={hideChatModal}
				currentMember={currentMember}
			/>
			{contextHolder}
		</>
	)
}

export default StatDetailModal
