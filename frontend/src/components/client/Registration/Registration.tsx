import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import moment from 'moment'
import {
	ClientRegistrationDetailComponent,
	ClientRegistrationDetailModalComponent,
	TapAnimationComponent
} from '@/components'
import { ExclamationCircleOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Divider, message, Modal, Tooltip } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'

const Registration = (props) => {
	const { publicSettings, accessToken, registration } = props

	const queryClient = useQueryClient()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const [currentRegistrationId, setCurrentRegistrationId] = useState(undefined)
	const [currentRegistration, setCurrentRegistration] = useState(undefined)

	const [isRegistrationDetailModalVisible, setIsRegistrationDetailModalVisible] = useState(false)

	const [modal, contextHolder] = Modal.useModal()

	useQuery(
		[API.QUERY_KEY_CLIENT_MY_REGISTRATION_DETAIL, accessToken, currentRegistrationId],
		() => API.CLIENT_GET_MY_REGISTRATION_DETAIL(accessToken, currentRegistrationId),
		{
			enabled: !!accessToken && !!currentRegistrationId,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setCurrentRegistration(response?.data || undefined)
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
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

	const registrationCancelMutation = useMutation(API.CLIENT_CANCEL_REGISTRATION, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_CANCEL_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_CLIENT_MY_REGISTRATIONS]
			})
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
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

	const handleCancelRegistration = () => {
		if (
			publicSettings?.CANCEL_ALLOWED.valueBoolean &&
			moment(registration?.Occurrence?.startDate)
				.subtract(publicSettings?.CANCEL_LIMIT_DAY.valueNumber, 'day')
				.hour(publicSettings?.CANCEL_LIMIT_HOUR.valueNumber)
				.minute(publicSettings?.CANCEL_LIMIT_MINUTE.valueNumber)
				.second(0)
				.isAfter(moment())
		) {
			const paramData = {
				accessToken: accessToken,
				registrationId: registration?.registrationId
			}

			modal.confirm({
				title: '確認',
				icon: <ExclamationCircleOutlined className="text-red-600" />,
				content: (
					<p>
						<span className="text-red-600">{registration?.Category?.title || ''}</span>
						の予約をキャンセルしてもよろしいでしょうか？
					</p>
				),
				okText: 'キャンセル',
				okType: 'danger',
				cancelText: '閉じる',
				centered: true,
				onOk() {
					registrationCancelMutation.mutate(paramData)
				}
			})
		}
	}

	useEffect(() => {
		if (localStorage.getItem('registrations')) {
			if (Number(localStorage.getItem('registrations')) === registration.registrationId) {
				showRegistrationDetailModal(registration)
				localStorage.removeItem('registrations')
			}
		}
	}, [])
	const showRegistrationDetailModal = (registration) => {
		setCurrentRegistrationId(registration?.registrationId)
		setIsRegistrationDetailModalVisible(true)
	}

	const hideRegistrationDetailModal = () => {
		setCurrentRegistrationId(undefined)
		setCurrentRegistration(undefined)
		setIsRegistrationDetailModalVisible(false)
	}

	return (
		<>
			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial="hidden"
				animate="show"
				exit="hidden"
				className="mt-4"
			>
				<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-4">
					<ClientRegistrationDetailComponent {...props} registration={registration} />
				</motion.div>
				<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
					{publicSettings?.CANCEL_ALLOWED.valueBoolean ? (
						moment(registration?.Occurrence?.startDate)
							.subtract(publicSettings?.CANCEL_LIMIT_DAY.valueNumber, 'day')
							.hour(publicSettings?.CANCEL_LIMIT_HOUR.valueNumber)
							.minute(publicSettings?.CANCEL_LIMIT_MINUTE.valueNumber)
							.second(0)
							.isAfter(moment()) ? (
							<div className="p-4 bg-yellow-300 mb-4 rounded">
								<p className="text-center whitespace-pre-wrap">
									{publicSettings?.CANCEL_TEXT.valueString || ''}
								</p>
							</div>
						) : (
							<div className="p-4 bg-yellow-300 mb-4 rounded">
								<p className="text-center whitespace-pre-wrap">キャセル不可</p>
							</div>
						)
					) : (
						<div className="p-4 bg-yellow-300 mb-4 rounded">
							<p className="text-center whitespace-pre-wrap">
								{publicSettings?.CANCEL_TEXT.valueString || ''}
							</p>
						</div>
					)}
					<Divider />
					<div className="flex justify-center">
						<TapAnimationComponent className="m-1">
							{publicSettings?.CANCEL_ALLOWED.valueBoolean &&
							moment(registration?.Occurrence?.startDate)
								.subtract(publicSettings?.CANCEL_LIMIT_DAY.valueNumber, 'day')
								.hour(publicSettings?.CANCEL_LIMIT_HOUR.valueNumber)
								.minute(publicSettings?.CANCEL_LIMIT_MINUTE.valueNumber)
								.second(0)
								.isAfter(moment()) ? (
								<Button
									danger
									type="primary"
									icon={<StopOutlined />}
									className="h-12"
									size="large"
									loading={registrationCancelMutation.isLoading}
									onClick={handleCancelRegistration}
								>
									予約キャンセル
								</Button>
							) : (
								<Tooltip
									trigger={['click']}
									title={
										<p className="whitespace-pre-wrap">{`キャンセル可能時間を過ぎている\nためキャンセルできません`}</p>
									}
								>
									<Button
										danger
										type="primary"
										icon={<StopOutlined />}
										style={{ height: '3rem' }}
										size="large"
										loading={registrationCancelMutation.isLoading}
										onClick={handleCancelRegistration}
										disabled={true}
									>
										予約キャンセル
									</Button>
								</Tooltip>
							)}
						</TapAnimationComponent>
						<TapAnimationComponent className="m-1">
							<Button
								type="primary"
								icon={<EyeOutlined />}
								className="h-12"
								size="large"
								onClick={() => {
									showRegistrationDetailModal(registration)
								}}
							>
								予約詳細
							</Button>
						</TapAnimationComponent>
					</div>
				</motion.div>
			</motion.div>
			<ClientRegistrationDetailModalComponent
				{...props}
				isRegistrationDetailModalVisible={isRegistrationDetailModalVisible}
				hideRegistrationDetailModal={hideRegistrationDetailModal}
				registration={currentRegistration}
			/>
			{contextHolder}
		</>
	)
}

export default Registration
