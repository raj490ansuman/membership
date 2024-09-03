import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, message, Modal } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { AxiosError } from 'axios'

const { TextArea } = Input

const QuestionModal = (props) => {
	const { isQuestionModalVisible, hideQuestionModal, currentQuestion, campaignId } = props
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [questionForm] = Form.useForm()

	const createCampaignQuestionMutation = useMutation(API.ADMIN_CREATE_CAMPAIGN_QUESTION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS]
				})
				hideQuestionModal()
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

	const createCampaignQuestionMutationNew = useMutation(API.ADMIN_CREATE_CAMPAIGN_QUESTION_NEW, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS]
				})
				hideQuestionModal()
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

	const updateCampaignQuestionMutation = useMutation(API.ADMIN_UPDATE_CAMPAIGN_QUESTION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS]
				})
				hideQuestionModal()
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
		if (!isQuestionModalVisible) {
			questionForm.resetFields()
		}
	}, [isQuestionModalVisible, questionForm])

	useEffect(() => {
		if (isQuestionModalVisible && currentQuestion?.campaignQuestionId) {
			questionForm.setFieldsValue({
				question: currentQuestion?.contents || '',
				choices: currentQuestion?.campaignChoices
					? currentQuestion.campaignChoices.map((choice) => ({
							contents: choice?.contents
					  }))
					: [{}]
			})
		}

		// eslint-disable-next-line
	}, [currentQuestion, isQuestionModalVisible])

	const handleQuestion = (data) => {
		let paramData = {
			campaignId: campaignId,
			contents: data?.question,
			choices: data?.choices
				? data.choices.map((choice, i) => ({
						contents: choice?.contents,
						showOrder: i
				  }))
				: []
		}

		if (currentQuestion?.campaignQuestionId) {
			paramData.questionId = currentQuestion.campaignQuestionId
			updateCampaignQuestionMutation.mutate(paramData)
		} else {
			// createCampaignQuestionMutation.mutate(paramData)
			createCampaignQuestionMutationNew.mutate(paramData)
		}
	}

	const onChoicesDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) {
			return
		} else {
			const orderedChoices = COMMONS.RE_ORDER(
				questionForm.getFieldValue('choices'),
				result.source.index,
				result.destination.index
			)
			questionForm.setFieldsValue({ choices: orderedChoices })
		}
	}

	return (
		<>
			<Modal
				open={isQuestionModalVisible}
				onCancel={hideQuestionModal}
				title={currentQuestion?.campaignQuestionId ? '質問編集' : '質問追加'}
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
					form={questionForm}
					layout="vertical"
					onFinish={handleQuestion}
					size="large"
					requiredMark={false}
					scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
					initialValues={{
						question: undefined,
						choices: [{}]
					}}
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form.Item
								name="question"
								label="質問内容"
								rules={[
									{
										required: true,
										message: '質問内容を入力してください'
									}
								]}
							>
								<TextArea
									placeholder="例：建物の外観で好きなプログラムは？"
									autoSize={{ minRows: 3 }}
									allowClear
								/>
							</Form.Item>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<p>
								<span className="font-bold">選択肢</span>
								<span className="custom-required-decoration">必須</span>
							</p>
							<p className="text-xs text-gray-400 mb-4 mt-2">
								※項目をドラッグして表示順を自由に調整できます
							</p>
							<Form.List
								name="choices"
								rules={[
									{
										required: true,
										message: '選択肢を入力してください'
									}
								]}
							>
								{(fields, { add, remove }) => (
									<DragDropContext onDragEnd={onChoicesDragEnd}>
										<Droppable droppableId="droppableChoices" direction="vertical">
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.droppableProps}
													className="w-full"
												>
													{fields.map((field, index) => (
														<Draggable
															key={field.key}
															draggableId={field.key + ''}
															index={index}
														>
															{(provided, snapshot) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className="border border-dashed border-gray-300 rounded bg-white p-4 mb-4"
																>
																	<Form.Item label={`選択（${index + 1}）`}>
																		<Form.Item
																			{...field}
																			key={[field.key, 'contents']}
																			name={[field.name, 'contents']}
																			className="inline-block mr-2"
																			style={{
																				width:
																					fields.length > 1
																						? 'calc(80% - 0.25rem)'
																						: '100%'
																			}}
																			rules={[
																				{
																					required: true,
																					message: '選択を入力してください'
																				}
																			]}
																		>
																			<Input
																				placeholder="例：18歳"
																				onPressEnter={(e) => e.preventDefault()}
																				allowClear
																			/>
																		</Form.Item>
																		{fields.length > 1 ? (
																			<Form.Item
																				{...field}
																				className="inline-block"
																			>
																				<Button
																					danger
																					onClick={() => {
																						remove(field.name)
																					}}
																					icon={<CloseOutlined />}
																				>
																					選択削除
																				</Button>
																			</Form.Item>
																		) : null}
																	</Form.Item>
																</div>
															)}
														</Draggable>
													))}
													{provided.placeholder}
													<Form.Item>
														<Button
															type="link"
															onClick={() => add()}
															block
															icon={<PlusOutlined />}
														>
															選択肢追加
														</Button>
													</Form.Item>
												</div>
											)}
										</Droppable>
									</DragDropContext>
								)}
							</Form.List>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									htmlType="submit"
									size="large"
									className="m-1 w-32"
									loading={
										currentQuestion?.campaignQuestionId
											? updateCampaignQuestionMutation.isLoading
											: createCampaignQuestionMutation.isLoading
									}
								>
									{currentQuestion?.campaignQuestionId ? '保存する' : '追加する'}
								</Button>
							</TapAnimationComponent>
						</motion.div>
					</motion.div>
				</Form>
			</Modal>
		</>
	)
}

export default QuestionModal
