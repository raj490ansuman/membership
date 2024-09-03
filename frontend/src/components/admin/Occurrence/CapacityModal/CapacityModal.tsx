import { Button, Form, Input, InputNumber, message, Modal } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AxiosError } from 'axios'

const { TextArea } = Input

const CapacityModal = (props) => {
	const { occurrence, isOccurrenceCapacityModalVisible, hideOccurrenceCapacityModal } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [capacityForm] = Form.useForm()

	const updateCapacityMutation = useMutation(API.ADMIN_UPDATE_OCCURRENCE, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL] })
				queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL] })
				queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL] })
				hideOccurrenceCapacityModal()
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
		if (!isOccurrenceCapacityModalVisible) {
			capacityForm.resetFields()
		}

		// eslint-disable-next-line
	}, [isOccurrenceCapacityModalVisible])

	useEffect(() => {
		if (occurrence && isOccurrenceCapacityModalVisible) {
			capacityForm.setFieldsValue({
				capacity: occurrence?.maxAttendee,
				remarks: occurrence?.remarks
			})
		}

		// eslint-disable-next-line
	}, [occurrence, isOccurrenceCapacityModalVisible])

	const handleCapacityUpdate = (data) => {
		let paramData = {
			maxAttendee: data?.capacity,
			remarks: data?.remarks,
			occurrenceId: occurrence?.occurrenceId
		}

		updateCapacityMutation.mutate(paramData)
	}

	return (
		<>
			<Modal
				open={isOccurrenceCapacityModalVisible}
				onCancel={hideOccurrenceCapacityModal}
				title="最大人数編集"
				footer={null}
				destroyOnClose
				centered
				zIndex={1005}
			>
				<div className="p-2">
					<Form
						form={capacityForm}
						layout="vertical"
						initialValues={{
							capacity: 0
						}}
						onFinish={handleCapacityUpdate}
						requiredMark={false}
						size="large"
						scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
					>
						<motion.div
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
							initial="hidden"
							animate="show"
							exit="hidden"
						>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="capacity"
									label="参加可能最大人数"
									rules={[
										{
											required: true,
											message: '最大人数は必須です'
										}
									]}
								>
									<InputNumber min={1} className="w-full" />
								</Form.Item>
								<Form.Item name="remarks" label="備考欄">
									<TextArea placeholder="上記の時間に対しての備考欄" autoSize />
								</Form.Item>
							</motion.div>
							<motion.div
								variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
								className="flex justify-center"
							>
								<TapAnimationComponent>
									<Button type="primary" htmlType="submit" loading={updateCapacityMutation.isLoading}>
										保存する
									</Button>
								</TapAnimationComponent>
							</motion.div>
						</motion.div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default CapacityModal
