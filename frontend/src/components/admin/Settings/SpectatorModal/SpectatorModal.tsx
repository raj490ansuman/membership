import { Button, Divider, Form, Select, message, Modal, Image, Radio } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AxiosError } from 'axios'

const { Option } = Select

const SpectatorModal = (props) => {
	const { isSpectatorModalVisible, hideSpectatorModal, currentSpectator } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [spectatorForm] = Form.useForm()

	const [spectatorCandidates, setSpectatorCandidates] = useState([])

	useQuery([API.QUERY_KEY_ADMIN_SPECTATOR_CANDIDATES], () => API.ADMIN_GET_SPECTATOR_CANDIDATES(), {
		enabled: isSpectatorModalVisible,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setSpectatorCandidates(response?.data || [])
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

	const addSpectatorMutation = useMutation(API.ADMIN_ADD_SPECTATOR, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_SPECTATORS]
				})
				hideSpectatorModal()
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
		if (!isSpectatorModalVisible) {
			spectatorForm.resetFields()
		}
	}, [isSpectatorModalVisible, spectatorForm])

	useEffect(() => {
		if (isSpectatorModalVisible && currentSpectator?.memberId) {
			spectatorForm.setFieldsValue({
				spectateMember: currentSpectator?.isSpectatingMember ? 1 : 0,
				spectateCampaign: currentSpectator?.isSpectatingCampaign ? 1 : 0,
				spectateRegistration: currentSpectator?.isSpectatingRegistration ? 1 : 0
			})
		}

		// eslint-disable-next-line
	}, [currentSpectator, isSpectatorModalVisible])

	const handleSpectator = (data) => {
		let paramData = {
			spectators: [
				{
					memberId: currentSpectator?.memberId ? currentSpectator?.memberId : data?.spectator,
					isSpectatingMember: data?.spectateMember,
					isSpectatingCampaign: data?.spectateCampaign,
					isSpectatingRegistration: data?.spectateRegistration
				}
			]
		}

		addSpectatorMutation.mutate(paramData)
	}

	return (
		<>
			<Modal
				open={isSpectatorModalVisible}
				onCancel={hideSpectatorModal}
				title={currentSpectator ? '管理者編集' : '管理者追加'}
				footer={null}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
				destroyOnClose
				centered
			>
				<Form
					form={spectatorForm}
					layout="vertical"
					onFinish={handleSpectator}
					size="large"
					requiredMark={false}
					scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
					initialValues={{
						spectator: undefined,
						spectateMember: 1,
						spectateCampaign: 1,
						spectateRegistration: 1
					}}
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							{currentSpectator?.memberId ? (
								<>
									<div className="flex justify-center">
										{currentSpectator?.Member?.picUrl ? (
											<Image
												preview={{
													mask: <EyeOutlined />,
													src: currentSpectator.Member.picUrl,
													maskClassName: 'rounded-full'
												}}
												width={100}
												height={100}
												style={{
													border: `4px solid ${COMMONS.WHITE_COLOR}`
												}}
												className="rounded-full"
												src={`${currentSpectator.Member.picUrl}/large`}
												fallback="/no-image.png"
											/>
										) : (
											<Image
												preview={false}
												width={100}
												height={100}
												style={{
													border: `4px solid ${COMMONS.WHITE_COLOR}`
												}}
												className="rounded-full"
												src="/no-image.png"
											/>
										)}
									</div>
									<div className="mb-8">
										<p className="text-center font-bold text-xl">
											{currentSpectator?.Member?.displayName || 'ー'}
										</p>
										{/* <p className="text-center text-sm">
											（{currentSpectator?.Member?.['memberAttributeId1'] || 'ー'}）
										</p> */}
									</div>
								</>
							) : (
								<Form.Item
									name="spectator"
									label="メンバー"
									rules={[
										{
											required: true,
											message: 'メンバーを選択してください'
										}
									]}
								>
									<Select
										disabled={currentSpectator?.memberId ? true : false}
										showSearch
										optionFilterProp="children"
										placeholder="管理者に追加するメンバーを選択してください"
										allowClear
									>
										{spectatorCandidates.map((sc) => (
											<Option key={sc?.memberId} value={sc?.memberId}>
												{sc?.picUrl ? (
													<Image
														preview={false}
														src={`${sc.picUrl}/small`}
														style={{ maxHeight: '38px' }}
														className="w-full rounded-full object-contain"
														fallback="/no-image.png"
													/>
												) : (
													<Image
														src="/no-image.png"
														preview={false}
														className="w-full rounded-full object-contain"
														style={{
															maxHeight: '38px'
														}}
													/>
												)}
												<Divider type="vertical" />
												{sc?.displayName || 'ー'}
											</Option>
										))}
									</Select>
								</Form.Item>
							)}
							<div className="flex justify-center mb-4">
								<p>新規お客様通知</p>
							</div>
							<Form.Item
								name="spectateMember"
								className="text-center"
								dependencies={['spectateMember', 'spectateCampaign', 'spectateRegistration']}
								// rules={[
								// 	({ getFieldValue }) => ({
								// 		validator(_, value) {
								// 			if (
								// 				getFieldValue('spectateMember') === 1 ||
								// 				getFieldValue('spectateCampaign') === 1 ||
								// 				getFieldValue('spectateRegistration') === 1
								// 			) {
								// 				return Promise.resolve()
								// 			}
								// 			return Promise.reject(new Error('少なくとも通知の一つを有効にしてください'))
								// 		}
								// 	})
								// ]}
							>
								<Radio.Group
									size="large"
									optionType="button"
									buttonStyle="solid"
									options={[
										{ label: '受け取らない', value: 0 },
										{ label: '受け取る', value: 1 }
									]}
								/>
							</Form.Item>
							{/* <div className="flex justify-center mb-4">
								<p>新規キャンペーン応募通知</p>
							</div>
							<Form.Item
								name="spectateCampaign"
								className="text-center"
								dependencies={['spectateMember', 'spectateCampaign', 'spectateRegistration']}
								rules={[
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												getFieldValue('spectateMember') === 1 ||
												getFieldValue('spectateCampaign') === 1 ||
												getFieldValue('spectateRegistration') === 1
											) {
												return Promise.resolve()
											}
											return Promise.reject(new Error('少なくとも通知の一つを有効にしてください'))
										}
									})
								]}
							>
								<Radio.Group
									size="large"
									optionType="button"
									buttonStyle="solid"
									options={[
										{ label: '受け取らない', value: 0 },
										{ label: '受け取る', value: 1 }
									]}
								/>
							</Form.Item>
							<div className="flex justify-center whitespace-pre-wrap mb-4">
								<p className="text-center">{`予約通知\n（登録とキャンセル）`}</p>
							</div>
							<Form.Item
								name="spectateRegistration"
								className="text-center"
								dependencies={['spectateMember', 'spectateCampaign', 'spectateRegistration']}
								rules={[
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												getFieldValue('spectateMember') === 1 ||
												getFieldValue('spectateCampaign') === 1 ||
												getFieldValue('spectateRegistration') === 1
											) {
												return Promise.resolve()
											}
											return Promise.reject(new Error('少なくとも通知の一つを有効にしてください'))
										}
									})
								]}
							>
								<Radio.Group
									size="large"
									optionType="button"
									buttonStyle="solid"
									options={[
										{ label: '受け取らない', value: 0 },
										{ label: '受け取る', value: 1 }
									]}
								/>
							</Form.Item> */}
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									htmlType="submit"
									size="large"
									className="m-1 w-32"
									loading={addSpectatorMutation.isLoading}
								>
									{currentSpectator ? '保存する' : '追加する'}
								</Button>
							</TapAnimationComponent>
						</motion.div>
					</motion.div>
				</Form>
			</Modal>
		</>
	)
}

export default SpectatorModal
