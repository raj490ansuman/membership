import { API } from '@/utils'
import { COMMONS } from '@/utils'
import {
	EyeOutlined,
	CommentOutlined,
	StopOutlined,
	ExclamationCircleOutlined,
	DoubleLeftOutlined,
	LeftOutlined,
	RightOutlined,
	DoubleRightOutlined
} from '@ant-design/icons'
import { Badge, Button, Col, Divider, Empty, message, Modal, Row, Table, Tooltip } from 'antd'
import {
	BaseAnimationComponent,
	CategoryStatComponent,
	ChatModalComponent,
	MemberDetailModalComponent,
	TapAnimationComponent
} from '@/components'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { motion } from 'framer-motion'
import moment from 'moment'
import { AxiosError } from 'axios'

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const Home = (props) => {
	const { publicSettings } = props

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()

	const [categories, setCategories] = useState([])
	const [occasions, setOccasions] = useState([])
	const [occurrences, setOccurrences] = useState([])
	const [registrations, setRegistrations] = useState([])
	const [currentMemberId, setCurrentMemberId] = useState(undefined)
	const [currentMember, setCurrentMember] = useState(undefined)

	const [isChatModalVisible, setIsChatModalVisible] = useState(false)
	const [isMemberDetailModalVisible, setIsMemberDetailModalVisible] = useState(false)

	const [filterStatsDate, setFilterStatsDate] = useState(moment().format('YYYY-MM-DD'))

	const [modal, contextHolder] = Modal.useModal()

	const includePic = true
	const includeDestroyed = false

	useQuery(
		[API.QUERY_KEY_ADMIN_CATEGORY_LIST, includePic, includeDestroyed],
		() => API.ADMIN_GET_CATEGORY_LIST(includePic, includeDestroyed),
		{
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

	useQuery([API.QUERY_KEY_ADMIN_DAILY_STATS, filterStatsDate], () => API.ADMIN_GET_DAILY_STATS(filterStatsDate), {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setOccurrences(response?.data?.categories || [])
				setRegistrations(response?.data?.registrations || [])
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
	})

	useQuery(
		[API.QUERY_KEY_ADMIN_MEMBER_DETAIL, currentMemberId],
		() => API.ADMIN_GET_MEMBER({ memberId: currentMemberId }),
		{
			enabled: !!currentMemberId,
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

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_CATEGORY, () => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS]
			})
		})

		socket.on(API.SOCKET_OCCASION, () => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS]
			})
		})

		socket.on(API.SOCKET_OCCURRENCE, () => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS]
			})
		})

		socket.on(API.SOCKET_REGISTRATION, () => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS]
			})
		})

		return () => {
			socket.off(API.SOCKET_CATEGORY)
			socket.off(API.SOCKET_OCCASION)
			socket.off(API.SOCKET_OCCURRENCE)
			socket.off(API.SOCKET_REGISTRATION)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const handleRegistrationCancel = (registration) => {
		const paramData = {
			registrationId: registration?.registrationId
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className="text-red-600" />,
			content: (
				<p>
					<span className="text-red-600">{`${registration?.lastName || 'ー'}${
						registration?.firstName || 'ー'
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
			render: (registration) =>
				registration?.isManual || !registration?.memberId ? (
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
						<p className="text-base">{`${registration?.Member?.lastName || ''} ${
							registration?.Member?.firstName || ''
						}`}</p>
						<p className="text-sm">
							（
							{`${registration?.Member?.lastNameKana || ''} ${
								registration?.Member?.firstNameKana || ''
							}）`}
						</p>
					</Link>
				)
		},
		{
			title: '電話番号',
			dataIndex: 'telephone',
			align: 'center'
		},
		{
			title: COMMONS.DEFAULT_SYSTEM_TYPE,
			dataIndex: 'registration',
			align: 'center',
			render: (registration) => (
				<>
					<p>{categories.find((c) => c?.categoryId === registration?.categoryId)?.title || 'ー'}</p>
					<p>（{occasions.find((c) => c?.occasionId === registration?.occasionId)?.title || 'ー'}）</p>
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
			<BaseAnimationComponent>
				<div className="m-6">
					<div className="flex flex-col justify-center items-center mb-8">
						<div className="flex justify-center mb-2">
							<div
								className="py-2 px-4 border text-sm font-bold text-center rounded"
								style={{
									backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
									color: publicSettings?.PRIMARY_COLOR?.valueString,
									borderColor: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{moment(filterStatsDate).format('YYYY年M月D日 (ddd)')}
							</div>
						</div>
						<div className="flex justify-center items-center">
							<Button
								className="m-1"
								onClick={() => {
									setFilterStatsDate(moment(filterStatsDate).subtract(2, 'day').format('YYYY-MM-DD'))
								}}
								type="dashed"
							>
								<DoubleLeftOutlined />
							</Button>
							<Button
								className="m-1"
								onClick={() => {
									setFilterStatsDate(moment(filterStatsDate).subtract(1, 'day').format('YYYY-MM-DD'))
								}}
								type="dashed"
							>
								<LeftOutlined />
							</Button>
							<Button
								className="m-1"
								onClick={() => {
									setFilterStatsDate(moment().format('YYYY-MM-DD'))
								}}
								type="dashed"
							>
								今日
							</Button>
							<Button
								className="m-1"
								onClick={() => {
									setFilterStatsDate(moment(filterStatsDate).add(1, 'day').format('YYYY-MM-DD'))
								}}
								type="dashed"
							>
								<RightOutlined />
							</Button>
							<Button
								className="m-1"
								onClick={() => {
									setFilterStatsDate(moment(filterStatsDate).add(2, 'day').format('YYYY-MM-DD'))
								}}
								type="dashed"
							>
								<DoubleRightOutlined />
							</Button>
						</div>
					</div>
					<MotionRowComponent
						gutter={[32, 16]}
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<MotionColComponent xs={24} xxl={16} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
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
									registrations
										? registrations.map((registration) => {
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
						</MotionColComponent>
						<MotionColComponent xs={24} xxl={8} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<p
								className="px-4 py-2 text-lg text-center font-bold mb-4 rounded"
								style={{
									backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
									color: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{`予約の${COMMONS.DEFAULT_SYSTEM_TYPE}一覧`}
							</p>
							<MotionRowComponent
								gutter={[16, 16]}
								variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
								initial="hidden"
								animate="show"
								exit="hidden"
							>
								{occurrences && occurrences.length > 0 ? (
									occurrences.map((category) => (
										<MotionColComponent
											xs={24}
											md={12}
											key={category?.categoryId}
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										>
											<Link to={`${COMMONS.ADMIN_CATEGORIES_ROUTE}/${category?.categoryId}`}>
												<TapAnimationComponent>
													<CategoryStatComponent
														{...props}
														category={{
															...categories.find(
																(c) => c?.categoryId === category?.categoryId
															),
															sumExpected: category?.sumExpected
														}}
													/>
												</TapAnimationComponent>
											</Link>
										</MotionColComponent>
									))
								) : (
									<div className="flex justify-center w-full">
										<Empty description="予約がありません。" />
									</div>
								)}
							</MotionRowComponent>
						</MotionColComponent>
					</MotionRowComponent>
				</div>
			</BaseAnimationComponent>
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

export default Home
