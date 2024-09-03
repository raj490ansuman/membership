import { Button, Divider, Form, Input, message, Modal } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AxiosError } from 'axios'
import { queries } from '@/queries'

const { TextArea } = Input

const MemberNotificationModal = (props) => {
	const { publicSettings, isMemberNotificationModalVisible, hideMemberNotificationModal } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [memberNotificationForm] = Form.useForm()

	const memberNotificationMutation = useMutation(API.ADMIN_UPDATE_SETTINGS_BATCH, {
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
				hideMemberNotificationModal()
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
		if (!isMemberNotificationModalVisible) {
			memberNotificationForm.resetFields()
		}
	}, [isMemberNotificationModalVisible, memberNotificationForm])

	useEffect(() => {
		if (isMemberNotificationModalVisible) {
			memberNotificationForm.setFieldsValue({
				memberPostRegistrationMessage:
					publicSettings?.MEMBER_MESSAGE_POST_MEMBER_REGISTER.valueString || undefined,
				campaignMessage: publicSettings?.MEMBER_MESSAGE_CAMPAIGN.valueString || undefined,
				reservationMessage: publicSettings?.MEMBER_MESSAGE_RESERVATION.valueString || undefined,
				remindMessage1: publicSettings?.MEMBER_MESSAGE_REMIND1.valueString || undefined,
				remindMessage2: publicSettings?.MEMBER_MESSAGE_REMIND2.valueString || undefined
			})
		}

		// eslint-disable-next-line
	}, [isMemberNotificationModalVisible])

	const handleMemberNotification = (data) => {
		let paramArray = []

		paramArray.push({
			name: API.SETTINGS_KEY_MEMBER_MESSAGE_POST_MEMBER_REGISTER,
			label: API.SETTINGS_LABEL_MEMBER_MESSAGE_POST_MEMBER_REGISTER,
			valueString: data.memberPostRegistrationMessage,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_MEMBER_MESSAGE_CAMPAIGN,
			label: API.SETTINGS_LABEL_MEMBER_MESSAGE_CAMPAIGN,
			valueString: data.campaignMessage,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_MEMBER_MESSAGE_RESERVATION,
			label: API.SETTINGS_LABEL_MEMBER_MESSAGE_RESERVATION,
			valueString: data.reservationMessage,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND1,
			label: API.SETTINGS_LABEL_MEMBER_MESSAGE_REMIND1,
			valueString: data.remindMessage1,
			isPublic: false
		})

		paramArray.push({
			name: API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND2,
			label: API.SETTINGS_LABEL_MEMBER_MESSAGE_REMIND2,
			valueString: data.remindMessage2,
			isPublic: false
		})

		const paramData = {
			settings: paramArray
		}

		memberNotificationMutation.mutate(paramData)
	}

	return (
		<>
			<Modal
				open={isMemberNotificationModalVisible}
				onCancel={hideMemberNotificationModal}
				title="お客様通知設定"
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
					form={memberNotificationForm}
					layout="vertical"
					initialValues={{
						memberPostRegistrationMessage: undefined,
						campaignMessage: undefined,
						reservationMessage: undefined,
						remindMessage1: undefined,
						remindMessage2: undefined
					}}
					onFinish={handleMemberNotification}
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
								name="memberPostRegistrationMessage"
								label="会員証登録されると配信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						{/* <motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="campaignMessage"
								label="キャンペーン応募後に配信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。\n※メッセージに[COMPANY-TEL]を入力すると、配信の時に問い合わせ電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="reservationMessage"
								label="予約後に配信されるメッセージ"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[BUILDING]を入力すると、配信の時に${COMMONS.DEFAULT_SYSTEM_TYPE}名に変換されます。\n※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。\n※メッセージに[DATE]を入力すると、配信の時に予約の日付に変換されます。\n※メッセージに[COMPANY-TEL]を入力すると、配信の時に問い合わせ電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="remindMessage1"
								label="リマインドメッセージ（予約より3日前に配信される）"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[BUILDING]を入力すると、配信の時に${COMMONS.DEFAULT_SYSTEM_TYPE}名に変換されます。\n※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。\n※メッセージに[DATE]を入力すると、配信の時に予約の日付に変換されます。\n※メッセージに[COMPANY-TEL]を入力すると、配信の時に問い合わせ電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="remindMessage2"
								label="リマインドメッセージ（予約より1日前に配信される）"
								extra={
									<p className="whitespace-pre-wrap">{`※メッセージに[BUILDING]を入力すると、配信の時に${COMMONS.DEFAULT_SYSTEM_TYPE}名に変換されます。\n※メッセージに[NAME]を入力すると、配信の時にお客様の名前に変換されます。\n※メッセージに[DATE]を入力すると、配信の時に予約の日付に変換されます。\n※メッセージに[COMPANY-TEL]を入力すると、配信の時に問い合わせ電話番号に変換されます。`}</p>
								}
							>
								<TextArea placeholder="メッセージを入力してください" autoSize />
							</Form.Item>
						</motion.div> */}
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									htmlType="submit"
									size="large"
									className="m-1 w-32"
									loading={memberNotificationMutation.isLoading}
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

export default MemberNotificationModal
