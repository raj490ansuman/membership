import {
	EditOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	TeamOutlined,
	ClockCircleOutlined,
	StopOutlined,
	ExclamationCircleOutlined,
	DeleteOutlined,
	CommentOutlined,
	CheckCircleOutlined,
	MinusCircleOutlined,
	CheckCircleFilled,
} from '@ant-design/icons'
import {
	Badge,
	Button,
	Descriptions,
	Divider,
	message,
	Modal,
	Table,
	Tabs,
	Tag,
	Tooltip,
} from 'antd'
import { COMMONS, API } from '@/utils'
import {
	ChatModalComponent,
	MemberDetailModalComponent,
	OccurrenceCapacityModalComponent,
	OccurrenceComponent,
	RegistrationEditModalComponent,
	StatusProgressComponent,
	TapAnimationComponent,
} from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { io } from 'socket.io-client'
import { AxiosError } from 'axios'
import { useListMemberAttributes } from '@/queries'
// import { EventAndCampingAttendedModel } from '@/views'

const CustomTable = styled(Table)`
	tr.ant-table-expanded-row > td,
	tr.ant-table-expanded-row:hover > td {
		background: ${COMMONS.CUSTOM_LIGHT_YELLOW};
	}
`

const { TabPane } = Tabs

const DetailModal = (props) => {
	const {
		occurrenceId,
		isOccurrenceDetailModalVisible,
		hideOccurrenceDetailModal,
		publicSettings,
	} = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const occurrenceIdRef = useRef()
	const occurrenceRef = useRef()

	const [occurrence, setOccurrence] = useState(undefined)
	const [currentRegistration, setCurrentRegistration] = useState(undefined)
	const [currentMemberId, setCurrentMemberId] = useState(undefined)
	const [currentMember, setCurrentMember] = useState(undefined)

	const [isOccurrenceCapacityModalVisible, setIsOccurrenceCapacityModalVisible] = useState(false)
	const [isRegistrationEditModalVisible, setIsRegistrationEditModalVisible] = useState(false)
	const [isChatModalVisible, setIsChatModalVisible] = useState(false)
	const [isMemberDetailModalVisible, setIsMemberDetailModalVisible] = useState(false)
	const [registration, setRegistration] = useState()
	const [bookingConfirmation, setBookingConfirmation] = useState(false)
	const [checkAttended, setCheckAttended] = useState(false)
	const [isEventAndCampingAttendedModel, setIsEventAndCampingAttendedModel] = useState(false)
	const [memberIdModel, setMemberIdModel] = useState()
	const [modal, contextHolder] = Modal.useModal()

	const { data } = useListMemberAttributes({})
	const memberAttributes: MemberAttribute[] =
		data?.body?.data.filter((item) => item?.isAdminDisplayed) || []

	// useQuery(
	// 	[API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL, occurrenceId],
	// 	() => API.ADMIN_GET_OCCURRENCE_DETAIL(occurrenceId),
	// 	{
	// 		enabled: !!occurrenceId,
	// 		onSuccess: (response) => {
	// 			if (isMountedRef.current) {
	// 				setOccurrence(response?.data || undefined)
	// 			}
	// 		},
	// 		onError: (error: AxiosError) => {
	// 			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
	// 				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
	// 			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
	// 				message.warning({
	// 					content: COMMONS.ERROR_SESSION_MSG,
	// 					key: COMMONS.MESSAGE_SESSION_ERROR_KEY
	// 				})
	// 				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
	// 			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
	// 				message.error({
	// 					content: COMMONS.ERROR_SYSTEM_MSG,
	// 					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
	// 				})
	// 			} else {
	// 				message.error({
	// 					content: COMMONS.ERROR_SYSTEM_MSG,
	// 					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
	// 				})
	// 			}
	// 		}
	// 	}
	// )

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
						key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
					})
					navigate(COMMONS.ADMIN_LOGIN_ROUTE)
				} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
					})
				} else {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
					})
				}
			},
		},
	)

	const occurrenceUpdateMutation = useMutation(API.ADMIN_UPDATE_OCCURRENCE, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL],
			})
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL],
			})
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL],
			})
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	const occurrenceDeleteMutation = useMutation(API.ADMIN_DELETE_OCCURRENCE, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			hideOccurrenceDetailModal()
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL],
			})
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL],
			})
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	const registrationCancelMutation = useMutation(API.ADMIN_CANCEL_REGISTRATION, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_CANCEL_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL],
			})
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL],
			})
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL],
			})
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	useEffect(() => {
		occurrenceIdRef.current = occurrenceId
	}, [occurrenceId])

	useEffect(() => {
		occurrenceRef.current = occurrence
	}, [occurrence])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		// socket.on(API.SOCKET_OCCURRENCE, (response) => {
		//   if (response !== undefined && Object.keys(response).length !== 0) {
		//     if (response?.occurrenceId) {
		//       if (response?.occurrenceId === Number(occurrenceIdRef.current)) {
		//         queryClient.invalidateQueries(API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL)
		//       }
		//     } else if (response?.occurrenceIds) {
		//       if (
		//         response?.occurrenceIds.includes(Number(occurrenceIdRef.current))
		//       ) {
		//         queryClient.invalidateQueries(API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL)
		//       }
		//     }
		//   }
		// })

		socket.on(API.SOCKET_REGISTRATION, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.occurrenceId === Number(occurrenceIdRef.current)) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL],
					})
				}
			}
		})

		socket.on(API.SOCKET_CHAT, (response) => {
			if (
				occurrenceRef.current?.registrations?.find(
					(r) => r?.memberId === response?.memberId,
				)
			) {
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL],
				})
			}
		})

		socket.on(API.SOCKET_MEMBER, (response) => {
			if (
				occurrenceRef.current?.registrations?.find(
					(r) => r?.memberId === response?.memberId,
				)
			) {
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL],
				})
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_MEMBER_DETAIL],
				})
			}
		})

		return () => {
			// socket.off(API.SOCKET_OCCURRENCE)
			socket.off(API.SOCKET_REGISTRATION)
			socket.off(API.SOCKET_CHAT)
			socket.off(API.SOCKET_MEMBER)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const handleOccurrenceVisibilityUpdate = (isDisplayed) => {
		const paramData = {
			isDisplayed: isDisplayed,
			occurrenceId: occurrence?.occurrenceId,
		}

		occurrenceUpdateMutation.mutate(paramData)
	}

	const handleOccurrenceDelete = () => {
		const paramData = {
			occurrenceId: occurrence?.occurrenceId,
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className='text-red-600' />,
			content: (
				<p>
					<span className='text-red-600'>
						{occurrence?.startAt
							? moment(occurrence?.startAt).format('YYYY年M月D日 HH:mm')
							: ''}
					</span>
					の時間を削除してもよろしいでしょうか？
				</p>
			),
			okText: '削除',
			okButtonProps: {
				size: 'large',
				type: 'primary',
				danger: true,
			},
			cancelText: '閉じる',
			cancelButtonProps: {
				size: 'large',
			},
			centered: true,
			onOk() {
				occurrenceDeleteMutation.mutate(paramData)
			},
		})
	}

	const handleRegistrationCancel = (registration) => {
		const { Member } = registration
		const paramData = {
			registrationId: registration?.registrationId,
		}

		const name = Member?.['memberAttributeId1']
		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className='text-red-600' />,
			content: (
				<p>
					<span className='text-red-600'>
						{registration?.isManual
							? `${Member?.lastName || 'ー'} ${Member?.firstName || 'ー'}`
							: `${name}`}{' '}
					</span>
					様の予約をキャンセルしてもよろしいでしょうか？
				</p>
			),
			okText: 'キャンセル',
			okButtonProps: {
				size: 'large',
				type: 'primary',
				danger: true,
			},
			cancelText: '閉じる',
			cancelButtonProps: {
				size: 'large',
			},
			centered: true,
			onOk() {
				registrationCancelMutation.mutate(paramData)
			},
		})
	}

	const showOccurrenceCapacityModal = () => {
		setIsOccurrenceCapacityModalVisible(true)
	}

	const hideOccurrenceCapacityModal = () => {
		setIsOccurrenceCapacityModalVisible(false)
	}

	const showRegistrationEditModal = (registration) => {
		setCurrentRegistration(registration)
		setIsRegistrationEditModalVisible(true)
	}

	const hideRegistrationEditModal = () => {
		setCurrentRegistration(undefined)
		setIsRegistrationEditModalVisible(false)
	}

	const showChatModal = (registration) => {
		setCurrentMemberId(registration?.memberId)
		setIsChatModalVisible(true)
	}

	const hideChatModal = () => {
		setCurrentMemberId(undefined)
		setCurrentMember(undefined)
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
	const commonColumns = [
		{
			title: 'お客様',
			dataIndex: 'registration',
			width: 200,
			align: 'center',
			render: (registration) => {
				const name = registration?.Member?.['memberAttributeId1']

				return registration?.isManual || !registration?.memberId ? (
					<>
						<p>{`${registration?.Member?.lastName || ''} ${
							registration?.Member?.firstName || ''
						}`}</p>
						<p className='text-xs text-gray-400'>
							（
							{`${registration?.Member?.lastNameKana || ''} ${
								registration?.Member?.firstNameKana || ''
							}）`}
						</p>
					</>
				) : (
					<Link to={`${COMMONS.ADMIN_MEMBERS_ROUTE}?memberId=${registration?.memberId}`}>
						<p className='text-base'>{`${registration?.Member?.displayName}` || ''}</p>
						<p className='text-sm'>{`${name}` || ''}</p>
					</Link>
				)
			},
		},
		{
			title: '登録元',
			dataIndex: 'isManual',
			align: 'center',
			width: 80,
			render: (isManual) => (
				<>
					<Tag className='mr-0' color={isManual ? '' : COMMONS.CUSTOM_GREEN}>
						{isManual ? '手作業' : 'LINE'}
					</Tag>
				</>
			),
		},
		{
			title: `キャンペーン\n応募`,
			dataIndex: 'registration',
			align: 'center',
			width: 120,
			className: 'whitespace-pre-wrap',
			render: (registration) => (
				<>
					{registration?.Member?.isCampaign ? (
						registration.Member?.candidateAt ? (
							<CheckCircleFilled className='text-lg text-custom-green' />
						) : (
							<CheckCircleOutlined className='text-lg text-custom-green' />
						)
					) : (
						<MinusCircleOutlined className='text-lg text-yellow-600' />
					)}
				</>
			),
		},
		{
			title: 'メッセージ・備考',
			dataIndex: 'registration',
			align: 'center',
			width: 150,
			render: (registration) => (
				<>
					<p className='text-center whitespace-pre-wrap text-xs'>
						{registration?.message || 'ー'}
					</p>
					{registration?.remarks ? (
						<div className='mt-4'>
							<p className='text-xs text-center whitespace-pre-wrap bg-gray-100 rounded p-1'>
								{registration.remarks}
							</p>
						</div>
					) : (
						''
					)}
				</>
			),
		},
	]

	const registeredColumns = [
		...commonColumns,
		...[
			{
				title: '予約日付',
				dataIndex: 'createdAt',
				align: 'center',
				width: 130,
				render: (createdAt) => (
					<>
						<p className='whitespace-pre-wrap'>
							{createdAt ? moment(createdAt).format(`YYYY年M月D日[\n]HH:mm`) : 'ー'}
						</p>
					</>
				),
			},
			{
				title: '',
				dataIndex: 'action',
				align: 'center',
				width: 180,
				render: (registration) => (
					<>
						{registration ? (
							<>
								<TapAnimationComponent className='inline-block mb-2'>
									<Tooltip title='履歴'>
										<Button
											size='large'
											icon={<ClockCircleOutlined />}
											onClick={() =>
												openEventAndCampingAttendedModel(
													registration?.memberId,
												)
											}
										/>
									</Tooltip>
								</TapAnimationComponent>
								<Divider type='vertical' />
								<TapAnimationComponent className='inline-block'>
									<Tooltip title='お客様詳細'>
										<Button
											size='large'
											icon={<EyeOutlined />}
											onClick={() => {
												showMemberDetailModal(registration)
											}}
										/>
									</Tooltip>
								</TapAnimationComponent>
								<Divider type='vertical' />
								{registration?.isManual ? (
									<>
										<TapAnimationComponent className='inline-block'>
											<Tooltip title='予約内容編集'>
												<Button
													size='large'
													icon={<EditOutlined />}
													onClick={() => {
														showRegistrationEditModal(registration)
													}}
												/>
											</Tooltip>
										</TapAnimationComponent>
										<Divider type='vertical' />
									</>
								) : (
									''
								)}
								{!registration?.isManual && registration?.memberId ? (
									<>
										<TapAnimationComponent className='inline-block'>
											<Badge
												style={{ backgroundColor: COMMONS.CUSTOM_GREEN }}
												count={registration?.Member?.unreadCount || 0}
											>
												<Tooltip title='LINEチャット'>
													<Button
														size='large'
														icon={<CommentOutlined />}
														onClick={() => {
															showChatModal(registration)
														}}
													/>
												</Tooltip>
											</Badge>
										</TapAnimationComponent>
										{registration?.attended === 0 ? (
											<Divider type='vertical' />
										) : (
											''
										)}
									</>
								) : (
									''
								)}
								<Divider type='vertical' />
								<TapAnimationComponent className='inline-block'>
									<Tooltip title='予約確認'>
										<Button
											size='large'
											icon={<TeamOutlined />}
											onClick={() =>
												checkRegistrationMember(
													registration?.registrationId,
												)
											}
										/>
									</Tooltip>
								</TapAnimationComponent>
								<Divider type='vertical' />
								{registration?.attended === 0 ? (
									<TapAnimationComponent className='inline-block'>
										<Tooltip title='予約キャンセル'>
											<Button
												size='large'
												icon={<StopOutlined />}
												onClick={() => {
													handleRegistrationCancel(registration)
												}}
												danger
											/>
										</Tooltip>
									</TapAnimationComponent>
								) : (
									''
								)}
							</>
						) : (
							''
						)}
					</>
				),
			},
		],
	]

	const canceledColumns = [
		...commonColumns,
		...[
			{
				title: 'キャンセル日付',
				dataIndex: 'cancelledAt',
				align: 'center',
				width: 130,
				render: (cancelledAt) => (
					<>
						<p className='whitespace-pre-wrap'>
							{cancelledAt
								? moment(cancelledAt).format(`YYYY年M月D日[\n]HH:mm`)
								: 'ー'}
						</p>
					</>
				),
			},
			{
				title: '',
				dataIndex: 'action',
				align: 'center',
				width: 120,
				render: (registration) => (
					<>
						<TapAnimationComponent className='inline-block'>
							<Tooltip title='お客様詳細'>
								<Button
									size='large'
									icon={<EyeOutlined />}
									onClick={() => {
										showMemberDetailModal(registration)
									}}
								/>
							</Tooltip>
						</TapAnimationComponent>
						{!registration?.isManual && registration?.memberId ? (
							<>
								<Divider type='vertical' />
								<TapAnimationComponent className='inline-block'>
									<Badge
										style={{ backgroundColor: COMMONS.CUSTOM_GREEN }}
										count={registration?.Member?.unreadCount || 0}
									>
										<Tooltip title='LINEチャット'>
											<Button
												size='large'
												icon={<CommentOutlined />}
												onClick={() => {
													showChatModal(registration)
												}}
											/>
										</Tooltip>
									</Badge>
								</TapAnimationComponent>
							</>
						) : (
							''
						)}
					</>
				),
			},
		],
	]
	const openEventAndCampingAttendedModel = (memberId) => {
		setMemberIdModel(memberId)
		setIsEventAndCampingAttendedModel(true)
	}
	const hideEventAndCampingAttendedModel = () => {
		setMemberIdModel()
		setIsEventAndCampingAttendedModel(false)
	}

	const hideBookingConfirmationModal = () => {
		setRegistration()
		setBookingConfirmation(false)
	}

	const showBookingConfirmationModal = () => {
		setBookingConfirmation(true)
	}

	const checkRegistration = useMutation(API.ADMIN_CONFIRM_REGISTRATION, {
		onSuccess: (data) => {
			setRegistration(data?.data)
			setCheckAttended(!!data?.data?.attended)
			showBookingConfirmationModal()
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_BAD_REQUEST_ERROR) {
				message.error({
					content: 'QR is not valid',
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	const registrationUpdateAttendedMutation = useMutation(API.ADMIN_UPDATE_ATTENDED_REGISTRATION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				setCheckAttended(true)
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	const checkRegistrationMember = (registrationId) => {
		if (registrationId) {
			try {
				checkRegistration.mutate({ registrationId: registrationId })
			} catch (e) {
				message.warning({
					content: COMMONS.ERROR_QR_WRONG_MSG,
					key: COMMONS.ERROR_QR_WRONG_MSG,
				})
			}
		} else {
			message.warning({
				content: COMMONS.ERROR_QR_WRONG_MSG,
				key: COMMONS.ERROR_QR_WRONG_MSG,
			})
		}
	}

	const handleUpdateAttended = () => {
		registration?.registrationId &&
			registrationUpdateAttendedMutation.mutate({
				registrationId: registration?.registrationId,
			})
	}

	return (
		<>
			<Modal
				open={isOccurrenceDetailModalVisible}
				onCancel={hideOccurrenceDetailModal}
				title='時間詳細'
				footer={null}
				width={1024}
				destroyOnClose
				centered
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden',
					},
				}}
			>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
					className='flex flex-col'
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						className='flex justify-center'
					>
						{occurrence?.isDisplayed ? (
							<Tag
								icon={<EyeOutlined />}
								color={COMMONS.CUSTOM_GREEN}
								className='p-2 text-sm'
							>
								表示中
							</Tag>
						) : (
							<Tag
								icon={<EyeInvisibleOutlined />}
								color={COMMONS.CUSTOM_RED}
								className='p-2 text-sm'
							>
								非表示中
							</Tag>
						)}
					</motion.div>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						className='flex justify-end mt-8'
					>
						{occurrence?.isDisplayed ? (
							<TapAnimationComponent className='mr-1'>
								<Button
									type='primary'
									icon={<EyeInvisibleOutlined />}
									onClick={() => {
										handleOccurrenceVisibilityUpdate(false)
									}}
									loading={occurrenceUpdateMutation.isLoading}
								>
									非表示する
								</Button>
							</TapAnimationComponent>
						) : (
							<TapAnimationComponent className='mr-1'>
								<Button
									type='primary'
									icon={<EyeOutlined />}
									onClick={() => {
										handleOccurrenceVisibilityUpdate(true)
									}}
									loading={occurrenceUpdateMutation.isLoading}
								>
									表示する
								</Button>
							</TapAnimationComponent>
						)}
						<TapAnimationComponent className='mr-1'>
							<Button
								type='primary'
								icon={<EditOutlined />}
								onClick={showOccurrenceCapacityModal}
							>
								編集
							</Button>
						</TapAnimationComponent>
						<TapAnimationComponent>
							<Button
								danger
								type='primary'
								icon={<DeleteOutlined />}
								onClick={handleOccurrenceDelete}
							>
								削除
							</Button>
						</TapAnimationComponent>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mt-2'>
						<OccurrenceComponent {...props} occurrence={occurrence} isDetail={true} />
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mt-4'>
						<StatusProgressComponent
							{...props}
							expected={occurrence?.sumExpected || 0}
							attended={occurrence?.sumAttended || 0}
							maxCapacity={occurrence?.maxAttendee || 0}
						/>
					</motion.div>
					{occurrence?.remarks ? (
						<motion.div
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
							className='mt-4'
						>
							<p className='text-center whitespace-pre-wrap bg-gray-100 rounded-full p-4'>
								{occurrence.remarks}
							</p>
						</motion.div>
					) : (
						''
					)}
					<Divider />
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Tabs defaultActiveKey='registered' type='card' centered size='large'>
							<TabPane tab='予約一覧' key='registered'>
								<CustomTable
									columns={registeredColumns}
									dataSource={
										occurrence?.registrations
											? occurrence.registrations.map((registration) => {
													return {
														key: registration?.registrationId,
														fullName: registration,
														expected: registration?.expected,
														attended: registration?.attended,
														isManual: registration?.isManual,
														member: registration?.Member,
														createdAt: registration?.createdAt,
														action: registration,
														registration: registration,
													}
											  })
											: []
									}
									bordered={true}
									size='small'
									scroll={{ x: 'max-content' }}
								/>
							</TabPane>
							<TabPane tab='キャンセル一覧' key='canceled'>
								<CustomTable
									columns={canceledColumns}
									dataSource={
										occurrence?.cancels
											? occurrence.cancels.map((registration) => {
													return {
														key: registration?.registrationId,
														fullName: registration,
														expected: registration?.expected,
														attended: registration?.attended,
														isManual: registration?.isManual,
														member: registration?.Member,
														cancelledAt: registration?.cancelledAt,
														action: registration,
														registration: registration,
													}
											  })
											: []
									}
									bordered={true}
									size='small'
									scroll={{ x: 'max-content' }}
								/>
							</TabPane>
						</Tabs>
					</motion.div>
				</motion.div>
				<Modal
					visible={bookingConfirmation}
					title='予約確認'
					onCancel={hideBookingConfirmationModal}
					footer={null}
					centered
					destroyOnClose
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial='hidden'
						animate='show'
						exit='hidden'
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Descriptions
								column={1}
								labelStyle={{ width: '135px' }}
								contentStyle={{ padding: '0.5rem' }}
								bordered
							>
								{registration?.isManual ? (
									<Descriptions.Item label='氏名'>
										<p className='text-sm'>
											{`${registration?.Member?.lastName} ${registration?.Member?.firstName}`}
										</p>

										<p>
											{`(${registration?.Member?.lastNameKana} ${registration?.Member?.firstNameKana})`}
										</p>
									</Descriptions.Item>
								) : (
									<Descriptions.Item label='氏名'>
										<p className='text-sm'>
											{`${registration?.Member?.displayName}` || 'ー'}
										</p>

										<p>
											{`${registration?.Member?.['memberAttributeId1']}` ||
												'ー'}
										</p>
									</Descriptions.Item>
								)}
								<Descriptions.Item label='電話番号'>
									{registration?.isManual ? (
										<p className='text-sm'>{registration?.Member?.telephone}</p>
									) : (
										<p className='text-sm'>
											{`${registration?.Member?.['memberAttributeId2']}` ||
												'ー'}
										</p>
									)}
								</Descriptions.Item>
								<Descriptions.Item label={`${COMMONS.DEFAULT_SYSTEM_TYPE}`}>
									<p className='text-sm'>
										{registration?.Category?.title || 'ー'}
									</p>
								</Descriptions.Item>

								<Descriptions.Item label='日時'>
									<p className='text-sm'>
										{registration?.Occurrence?.startDate
											? moment(registration.Occurrence.startDate).format(
													'YYYY年M月D日（ddd）',
											  )
											: 'ー'}
									</p>
									<p className='text-sm mt-2'>
										<span
											className='inline-block rounded-full text-white px-2 mr-1 mb-1'
											style={{
												backgroundColor:
													publicSettings?.PRIMARY_COLOR?.valueString,
											}}
										>
											{`${
												registration?.Occurrence?.startAt
													? moment(
															registration.Occurrence.startAt,
													  ).format('HH:mm')
													: 'ー'
											}
                      ～
                      ${
							registration?.Occurrence?.endAt
								? moment(registration.Occurrence.endAt).format('HH:mm')
								: 'ー'
						}`}
										</span>
									</p>
								</Descriptions.Item>
								<Descriptions.Item label='メッセージ'>
									<p className='text-sm whitespace-pre-wrap'>
										{registration?.message || 'ー'}
									</p>
								</Descriptions.Item>
								{registration?.note?.map((item) => (
									<Descriptions.Item label={item?.lable}>
										<p className='text-sm whitespace-pre-wrap'>
											{item?.value || 'ー'}
										</p>
									</Descriptions.Item>
								))}
							</Descriptions>

							<div className='flex flex-col mb-8 px-4'>
								<div className='flex justify-center mt-4'>
									<TapAnimationComponent>
										<Button
											className='mr-4'
											size='large'
											onClick={hideBookingConfirmationModal}
										>
											閉じる
										</Button>

										<Button
											type='primary'
											size='large'
											disabled={checkAttended}
											onClick={handleUpdateAttended}
										>
											参加
										</Button>
									</TapAnimationComponent>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</Modal>
			</Modal>
			{/* <EventAndCampingAttendedModel
				memberId={memberIdModel}
				open={isEventAndCampingAttendedModel}
				onCancel={hideEventAndCampingAttendedModel}
			/> */}
			<OccurrenceCapacityModalComponent
				{...props}
				occurrence={occurrence}
				isOccurrenceCapacityModalVisible={isOccurrenceCapacityModalVisible}
				hideOccurrenceCapacityModal={hideOccurrenceCapacityModal}
			/>
			<RegistrationEditModalComponent
				{...props}
				registration={currentRegistration}
				occurrence={occurrence}
				isRegistrationEditModalVisible={isRegistrationEditModalVisible}
				hideRegistrationEditModal={hideRegistrationEditModal}
			/>
			<MemberDetailModalComponent
				{...props}
				isMemberDetailModalVisible={isMemberDetailModalVisible}
				hideMemberDetailModal={hideMemberDetailModal}
				currentMember={currentMember}
				memberAttributes={memberAttributes}
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

export default DetailModal
