import { Button, Divider, Form, Input, InputNumber, message, Modal, Switch, TimePicker } from 'antd'
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

const { TextArea } = Input

const CancellationModal = (props) => {
	const { publicSettings, isCancellationModalVisible, hideCancellationModal } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [cancellationForm] = Form.useForm()

	const cancellationMutation = useMutation(API.ADMIN_UPDATE_SETTINGS_BATCH, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: queries.settings.publicSettings.queryKey
				})
				hideCancellationModal()
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
		if (!isCancellationModalVisible) {
			cancellationForm.resetFields()
		}
	}, [isCancellationModalVisible, cancellationForm])

	useEffect(() => {
		if (isCancellationModalVisible) {
			cancellationForm.setFieldsValue({
				cancelAllowed: publicSettings?.CANCEL_ALLOWED.valueBoolean,
				cancelDays: publicSettings?.CANCEL_LIMIT_DAY.valueNumber,
				cancelHour: moment(
					`${publicSettings?.CANCEL_LIMIT_HOUR.valueNumber}:${publicSettings?.CANCEL_LIMIT_MINUTE.valueNumber}`,
					'HH:mm'
				),
				cancelText: publicSettings?.CANCEL_TEXT.valueBoolean || undefined
			})
		}

		// eslint-disable-next-line
	}, [isCancellationModalVisible])

	const handleCancellation = (data) => {
		let paramArray = []

		if (data?.cancelAllowed) {
			paramArray.push({
				name: API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_DAY,
				label: API.SETTINGS_LABEL_BOOK_CANCEL_LIMIT_DAY,
				valueNumber: data.cancelDays,
				isPublic: true
			})

			paramArray.push({
				name: API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_HOUR,
				label: API.SETTINGS_LABEL_BOOK_CANCEL_LIMIT_HOUR,
				valueNumber: data?.cancelHour ? Number(moment(data.cancelHour, 'HH:mm').format('HH')) : undefined,
				isPublic: true
			})

			paramArray.push({
				name: API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_MINUTE,
				label: API.SETTINGS_LABEL_BOOK_CANCEL_LIMIT_MINUTE,
				valueNumber: data?.cancelHour ? Number(moment(data.cancelHour, 'HH:mm').format('mm')) : undefined,
				isPublic: true
			})
		}

		paramArray.push({
			name: API.SETTINGS_KEY_BOOK_CANCEL_ALLOWED,
			label: API.SETTINGS_LABEL_BOOK_CANCEL_ALLOWED,
			valueFlag: data.cancelAllowed,
			isPublic: true
		})

		paramArray.push({
			name: API.SETTINGS_KEY_BOOK_CANCEL_TEXT,
			label: API.SETTINGS_LABEL_BOOK_CANCEL_TEXT,
			valueString: data?.cancelText,
			isPublic: true
		})

		const paramData = {
			settings: paramArray
		}

		cancellationMutation.mutate(paramData)
	}

	return (
		<>
			<Modal
				open={isCancellationModalVisible}
				onCancel={hideCancellationModal}
				title="予約キャンセル設定"
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
					form={cancellationForm}
					layout="vertical"
					onFinish={handleCancellation}
					size="large"
					requiredMark={false}
					scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
					initialValues={{
						cancelAllowed: publicSettings?.CANCEL_ALLOWED.valueBoolean,
						cancelDays: publicSettings?.CANCEL_LIMIT_DAY.valueNumber,
						cancelHour: moment(
							`${publicSettings?.CANCEL_LIMIT_HOUR.valueNumber}:${publicSettings?.CANCEL_LIMIT_MINUTE.valueNumber}`,
							'HH:mm'
						),
						cancelText: undefined
					}}
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item name="cancelAllowed" label="キャンセル機能" valuePropName="checked">
								<StyledSwitch />
							</Form.Item>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) => {
									return prevValues.cancelAllowed !== currentValues.cancelAllowed
								}}
							>
								{({ getFieldValue }) =>
									getFieldValue('cancelAllowed') ? (
										<>
											<Form.Item
												name="cancelDays"
												label="日数（予約より何日前までキャンセル可能）"
												rules={[
													{
														required: true,
														message: 'キャンセル可能日は必須です'
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
												name="cancelHour"
												label="時間（何時何分までキャンセル可能）"
												rules={[
													{
														required: true,
														message: 'キャンセル可能時間は必須です'
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
														cancellationForm.setFieldsValue({
															cancelHour: time
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
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="cancelText"
								label="キャンセルに関する説明文"
								rules={[
									{
										required: true,
										message: 'キャンセルに関する説明文は必須です'
									}
								]}
							>
								<TextArea placeholder="キャンセルに関する説明文を入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<div className="p-4 bg-yellow-300 rounded">
								<p className="text-center">
									キャンセルに関する説明文をONとOFFに合わせて内容を変更してください
								</p>
							</div>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									htmlType="submit"
									size="large"
									className="m-1 w-32"
									loading={cancellationMutation.isLoading}
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

export default CancellationModal
