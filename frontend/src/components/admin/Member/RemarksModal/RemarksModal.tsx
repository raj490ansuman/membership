import { Button, Col, Form, Input, Modal, Row, message } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API, COMMONS } from '@/utils'
import { useEffect } from 'react'

const RemarksModal = (props) => {
	const { isMemberRemarksModalVisible, hideMemberRemarksModal, currentMember } = props

	const [remarksForm] = Form.useForm()
	const queryClient = useQueryClient()

	const memberEditMutation = useMutation(API.ADMIN_RENEW_MEMBER, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			hideMemberRemarksModal()
			// Invalidate the member detail call here instead of all members
			queryClient.invalidateQueries([API.QUERY_KEY_ADMIN_MEMBER_DETAIL, currentMember?.memberId])
		}
	})

	const updateRemarksHandler = (data: Record<string, unknown>) => {
		const formData = new FormData()
		formData.append('memberId', currentMember?.memberId)

		// Map over non-custom registration form items and add them to the payload
		Object.entries(data).map(([key, value]) => {
			if (!formData.has(key)) {
				formData.append(key, String(value))
			}
		})
		memberEditMutation.mutate(formData)
	}

	useEffect(() => {
		if (isMemberRemarksModalVisible) {
			remarksForm.setFieldsValue({ remarks: currentMember?.remarks })
		}
	}, [isMemberRemarksModalVisible, remarksForm, currentMember?.remarks])

	return (
		<Modal
			title="備考追加"
			open={isMemberRemarksModalVisible}
			onCancel={hideMemberRemarksModal}
			footer={null}
			centered
			destroyOnClose
		>
			<Row>
				<Col span={24}>
					<Form
						form={remarksForm}
						name="remarksForm"
						onFinish={updateRemarksHandler}
						initialValues={{ remarks: currentMember?.remarks }}
					>
						<Row gutter={[0, 16]}>
							<Col span={24}>
								<Form.Item name="remarks">
									<Input.TextArea
										allowClear
										showCount
										autoSize={{ minRows: 5, maxRows: 15 }}
										maxLength={255}
										placeholder="備考を入力してください"
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item className="text-center" style={{ marginBottom: 0 }}>
									<Button type="primary" htmlType="submit" loading={memberEditMutation.isLoading}>
										保存
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
		</Modal>
	)
}

export default RemarksModal
