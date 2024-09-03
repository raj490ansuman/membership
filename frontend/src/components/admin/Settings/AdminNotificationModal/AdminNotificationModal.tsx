// TODO: Reuse MemberNotificationModal and AdminNotificationModal
import { Button, Divider, Form, Input, message, Modal } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { queries } from '@/queries'

const { TextArea } = Input

const AdminNotificationModal = (props) => {
	const { isAdminNotificationModalVisible, hideAdminNotificationModal } = props
	const { publicSettings } = useLayoutConfigContext()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [adminNotificationForm] = Form.useForm()

	const adminNotificationMutation = useMutation(API.ADMIN_UPDATE_SETTINGS_BATCH, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				// TODO: Invalidate settings only to invalidate both publicSettings and settings
				// TODO: Rename settings as systemSettings to distinguish
				queryClient.invalidateQueries({
					queryKey: queries.settings.publicSettings.queryKey
				})
				queryClient.invalidateQueries({
					queryKey: queries.settings.settings.queryKey
				})
				hideAdminNotificationModal()
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
		if (!isAdminNotificationModalVisible) {
			adminNotificationForm.resetFields()
		}
	}, [isAdminNotificationModalVisible, adminNotificationForm])

	useEffect(() => {
		if (isAdminNotificationModalVisible) {
			adminNotificationForm.setFieldsValue({
				memberMessage: publicSettings?.ADMIN_MESSAGE_MEMBER.valueString || undefined,
				campaignMessage: publicSettings?.ADMIN_MESSAGE_CAMPAIGN.valueString || undefined,
				reservationMessage: publicSettings?.ADMIN_MESSAGE_RESERVATION.valueString || undefined,
				reservationCancelMessage: publicSettings?.ADMIN_MESSAGE_RESERVATION_CANCEL.valueString || undefined
			})
		}

		// eslint-disable-next-line
	}, [isAdminNotificationModalVisible])

	const handleAdminNotification = (data) => {
		let paramArray = []

		paramArray.push({
			name: API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER,
			label: API.SETTINGS_LABEL_ADMIN_MESSAGE_MEMBER,
			valueString: data.memberMessage,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_ADMIN_MESSAGE_CAMPAIGN,
			label: API.SETTINGS_LABEL_ADMIN_MESSAGE_CAMPAIGN,
			valueString: data.campaignMessage,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION,
			label: API.SETTINGS_LABEL_ADMIN_MESSAGE_RESERVATION,
			valueString: data.reservationMessage,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION_CANCEL,
			label: API.SETTINGS_LABEL_ADMIN_MESSAGE_RESERVATION_CANCEL,
			valueString: data.reservationCancelMessage,
			isPublic: false
		})

		const paramData = {
			settings: paramArray
		}

		adminNotificationMutation.mutate(paramData)
	}

	return (
		<>
			<Modal
				open={isAdminNotificationModalVisible}
				onCancel={hideAdminNotificationModal}
				title="管理者通知設定"
				footer={null}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
				maskClosable={false}
				width={720}
				destroyOnClose
				centered
			>
				<Form
					form={adminNotificationForm}
					layout="vertical"
					initialValues={{
						memberMessage: undefined,
						campaignMessage: undefined,
						reservationMessage: undefined,
						reservationCancelMessage: undefined
					}}
					onFinish={handleAdminNotification}
					size="large"
					requiredMark={false}
					scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<motion.div
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
							className="p-4 bg-yellow-300 rounded mb-8"
						>
							<p className="text-center">設定されてない場合は、メッセージが配信されません。</p>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="memberMessage"
								label="会員証登録されると配信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider />
						{/* <motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="campaignMessage"
								label="新規キャンペーン応募が登録されると配信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。\n※メッセージに[TEL]を入力すると、配信の時にお客様の電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="reservationMessage"
								label="新規予約が登録されると送信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[BUILDING]を入力すると、配信の時に予約の${COMMONS.DEFAULT_SYSTEM_TYPE}名に変換されます。\n※メッセージに[NAME]を入力すると、配信の時に予約者の名前に変換されます。\n※メッセージに[DATE]を入力すると、配信の時に予約の日付に変換されます。\n※メッセージに[TEL]を入力すると、配信の時に予約者の電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="reservationCancelMessage"
								label="予約がキャンセルされると送信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[BUILDING]を入力すると、配信の時に予約の${COMMONS.DEFAULT_SYSTEM_TYPE}名に変換されます。\n※メッセージに[NAME]を入力すると、配信の時に予約者の名前に変換されます。\n※メッセージに[DATE]を入力すると、配信の時に予約の日付に変換されます。\n※メッセージに[TEL]を入力すると、配信の時に予約者の電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider /> */}
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									htmlType="submit"
									size="large"
									className="m-1 w-32"
									loading={adminNotificationMutation.isLoading}
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

export default AdminNotificationModal
