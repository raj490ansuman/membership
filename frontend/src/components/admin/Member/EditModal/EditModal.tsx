import { Image, Modal, message } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { API, COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MemberAttributesForm from '@/components/common/MemberAttributesForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { processMemberAttributeFormData } from '@/components/common/MemberAttributesForm/MemberAttribute'

const EditModal = (props) => {
	const {
		isMemberEditDetailModalVisible,
		hideMemberEditDetailModal,
		currentMember,
		memberAttributes,
	} = props

	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const memberEditMutation = useMutation(API.ADMIN_RENEW_MEMBER, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			hideMemberEditDetailModal()
			// Invalidate the member detail call here instead of all members
			queryClient.invalidateQueries([
				API.QUERY_KEY_ADMIN_MEMBER_DETAIL,
				currentMember?.memberId,
			])
		},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning(COMMONS.ERROR_SESSION_MSG)
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error(COMMONS.ERROR_SYSTEM_MSG)
			} else {
				message.error(COMMONS.ERROR_SYSTEM_MSG)
			}
		},
	})

	const updateProfileHandler = (data: Record<string, unknown>) => {
		// TODO: We should not be uploading images that remain the same
		const formData = processMemberAttributeFormData(data, memberAttributes)
		formData.append('memberId', currentMember?.memberId)

		// Map over non-custom registration form items and add them to the payload
		// Object.entries(data).map(([key, value]) => {
		// 	if (!formData.has(key)) {
		// 		formData.append(key, String(value))
		// 	}
		// })
		memberEditMutation.mutate(formData)
	}

	return (
		<>
			<Modal
				title={<span>お客様詳細</span>}
				open={isMemberEditDetailModalVisible}
				onCancel={hideMemberEditDetailModal}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden',
					},
				}}
				footer={null}
				destroyOnClose
				centered
			>
				<motion.div
					className='flex flex-col justify-center'
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<div className='flex justify-center'>
							{currentMember?.picUrl ? (
								<Image
									preview={{
										mask: <EyeOutlined />,
										src: currentMember.picUrl,
										maskClassName: 'rounded-full',
									}}
									width={100}
									height={100}
									style={{
										border: `4px solid ${COMMONS.WHITE_COLOR}`,
									}}
									className='rounded-full'
									src={`${currentMember.picUrl}/large`}
									fallback='/no-image.png'
								/>
							) : (
								<Image
									preview={false}
									width={100}
									height={100}
									style={{
										border: `4px solid ${COMMONS.WHITE_COLOR}`,
									}}
									className='rounded-full'
									src='/no-image.png'
								/>
							)}
						</div>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<MemberAttributesForm
							personalInfo={currentMember}
							memberAttributes={memberAttributes}
							formHandler={updateProfileHandler}
							formMutation={memberEditMutation}
						/>
					</motion.div>
				</motion.div>
			</Modal>
		</>
	)
}

export default EditModal
