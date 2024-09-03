import { Button, Divider, Form, InputNumber, message, Modal, Switch, TimePicker } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { AxiosError } from 'axios'
import { queries } from '@/queries'

const StyledSwitch = styled(Switch)`
	&.ant-switch-checked {
		background-color: ${COMMONS.CUSTOM_RED};
	}

	&.ant-switch-checked:focus {
		-webkit-box-shadow: 0 0 0 2px ${COMMONS.CUSTOM_LIGHT_RED};
		box-shadow: 0 0 0 2px ${COMMONS.CUSTOM_LIGHT_RED};
	}
`

const ReservationLimitModal = (props) => {
	const { publicSettings, isReservationLimitModalVisible, hideReservationLimitModal } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [reservationLimitForm] = Form.useForm()

	const reservationLimitMutation = useMutation(API.ADMIN_UPDATE_SETTINGS_BATCH, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: queries.settings.publicSettings.queryKey
				})
				hideReservationLimitModal()
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

	useEffect(() => {
		if (!isReservationLimitModalVisible) {
			reservationLimitForm.resetFields()
		}
	}, [isReservationLimitModalVisible, reservationLimitForm])

	useEffect(() => {
		if (isReservationLimitModalVisible) {
			reservationLimitForm.setFieldsValue({
				reservationLimitEnabled: publicSettings?.RESERVATION_LIMIT_ENABLED.valueBoolean,
				reservationLimitDays: publicSettings?.RESERVATION_LIMIT_DAY.valueNumber,
				reservationLimitHour: moment(
					`${publicSettings?.RESERVATION_LIMIT_HOUR.valueNumber}:${publicSettings?.RESERVATION_LIMIT_MINUTE.valueNumber}`,
					'HH:mm'
				)
			})
		}

		// eslint-disable-next-line
	}, [isReservationLimitModalVisible])

	const handleReservationLimit = (data) => {
		let paramArray = []

		if (data?.reservationLimitEnabled) {
			paramArray.push({
				name: API.SETTINGS_KEY_BOOK_LIMIT_DAY,
				label: API.SETTINGS_LABEL_BOOK_LIMIT_DAY,
				valueNumber: data.reservationLimitDays,
				isPublic: true
			})

			paramArray.push({
				name: API.SETTINGS_KEY_BOOK_LIMIT_HOUR,
				label: API.SETTINGS_LABEL_BOOK_LIMIT_HOUR,
				valueNumber: data?.reservationLimitHour
					? Number(moment(data.reservationLimitHour, 'HH:mm').format('HH'))
					: undefined,
				isPublic: true
			})

			paramArray.push({
				name: API.SETTINGS_KEY_BOOK_LIMIT_MINUTE,
				label: API.SETTINGS_LABEL_BOOK_LIMIT_MINUTE,
				valueNumber: data?.reservationLimitHour
					? Number(moment(data.reservationLimitHour, 'HH:mm').format('mm'))
					: undefined,
				isPublic: true
			})
		}

		paramArray.push({
			name: API.SETTINGS_KEY_BOOK_LIMIT_ENABLED,
			label: API.SETTINGS_LABEL_BOOK_LIMIT_ENABLED,
			valueFlag: data.reservationLimitEnabled,
			isPublic: true
		})

		const paramData = {
			settings: paramArray
		}

		reservationLimitMutation.mutate(paramData)
	}

	return (
		<>
			<Modal
				open={isReservationLimitModalVisible}
				onCancel={hideReservationLimitModal}
				title="予約時間制限設定"
				footer={null}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
				width={720}
				destroyOnClose
				centered
			>
				<Form
					form={reservationLimitForm}
					layout="vertical"
					onFinish={handleReservationLimit}
					size="large"
					requiredMark={false}
					scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
					initialValues={{
						reservationLimitEnabled: publicSettings?.RESERVATION_LIMIT_ENABLED.valueBoolean,
						reservationLimitDays: publicSettings?.RESERVATION_LIMIT_DAY.valueNumber,
						reservationLimitHour: moment(
							`${publicSettings?.RESERVATION_LIMIT_HOUR.valueNumber}:${publicSettings?.RESERVATION_LIMIT_MINUTE.valueNumber}`,
							'HH:mm'
						)
					}}
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item name="reservationLimitEnabled" label="予約時間制限" valuePropName="checked">
								<StyledSwitch />
							</Form.Item>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) => {
									return prevValues.reservationLimitEnabled !== currentValues.reservationLimitEnabled
								}}
							>
								{({ getFieldValue }) =>
									getFieldValue('reservationLimitEnabled') ? (
										<>
											<Form.Item
												name="reservationLimitDays"
												label="日数（予約より何日前まで予約可能）"
												rules={[
													{
														required: true,
														message: '予約可能日は必須です'
													}
												]}
											>
												<InputNumber
													placeholder="例：1"
													addonBefore="予約より"
													addonAfter="日前"
													min={0}
													type="number"
													onPressEnter={(e) => {
														e.preventDefault()
													}}
												/>
											</Form.Item>
											<Form.Item
												name="reservationLimitHour"
												label="時間（何時何分まで予約可能）"
												rules={[
													{
														required: true,
														message: '予約可能時間は必須です'
													}
												]}
											>
												<TimePicker
													placeholder="時間"
													popupClassName="hide-timepicker-footer"
													format="HH:mm"
													inputReadOnly
													showNow={false}
													allowClear={false}
													hideDisabledOptions={true}
													minuteStep={5}
													onSelect={(time) => {
														reservationLimitForm.setFieldsValue({
															reservationLimitHour: time
														})
													}}
												/>
											</Form.Item>
										</>
									) : (
										''
									)
								}
							</Form.Item>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									htmlType="submit"
									size="large"
									className="m-1 w-32"
									loading={reservationLimitMutation.isLoading}
								>
									保存する
								</Button>
							</TapAnimationComponent>
						</motion.div>
					</motion.div>
				</Form>
			</Modal>
		</>
	)
}

export default ReservationLimitModal
