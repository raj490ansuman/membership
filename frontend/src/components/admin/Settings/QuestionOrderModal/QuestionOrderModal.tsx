import { Button, Col, message, Modal, Row } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { AxiosError } from 'axios'

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const QuestionOrderModal = (props) => {
	const { publicSettings, isQuestionOrderModalVisible, hideQuestionOrderModal, campaignId } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [campaignQuestions, setCampaignQuestions] = useState([])
	const [orderedCampaignQuestions, setOrderedCampaignQuestions] = useState([])

	useQuery(
		[API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS, campaignId],
		() => API.ADMIN_GET_CAMPAIGN_QUESTIONS_NEW({ campaignId }),
		{
			enabled: isQuestionOrderModalVisible,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setCampaignQuestions(response?.data || [])
					setOrderedCampaignQuestions(response?.data || [])
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
		}
	)

	const updateCampaignQuestionOrderMutation = useMutation(API.ADMIN_UPDATE_CAMPAIGN_QUESTION_ORDER, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS]
				})
				hideQuestionOrderModal()
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
		if (!isQuestionOrderModalVisible) {
			setCampaignQuestions([])
		}
	}, [isQuestionOrderModalVisible])

	const handleCampaignQuestionOrder = () => {
		const paramData = {
			questions: orderedCampaignQuestions.map((q, i) => ({
				campaignQuestionId: q?.campaignQuestionId,
				showOrder: i
			}))
		}

		updateCampaignQuestionOrderMutation.mutate(paramData)
	}

	const campaignQuestionOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const reOrderedCampaignQuestions = COMMONS.RE_ORDER(
				orderedCampaignQuestions,
				result.source.index,
				result.destination.index
			)

			setOrderedCampaignQuestions(reOrderedCampaignQuestions)
		}
	}

	const handleRevert = () => {
		setOrderedCampaignQuestions(campaignQuestions)
	}

	return (
		<>
			<Modal
				open={isQuestionOrderModalVisible}
				onCancel={hideQuestionOrderModal}
				title="質問表示順"
				footer={null}
				destroyOnClose
				maskClosable={false}
				centered
				width={720}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
			>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-end mb-4">
						<TapAnimationComponent>
							<Button className="m-1" size="large" danger onClick={handleRevert}>
								元に戻す
							</Button>
						</TapAnimationComponent>
						<TapAnimationComponent>
							<Button
								type="primary"
								className="m-1 w-32"
								size="large"
								onClick={handleCampaignQuestionOrder}
							>
								保存
							</Button>
						</TapAnimationComponent>
					</motion.div>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						className="flex justify-center rounded mb-8 p-4"
						style={{
							color: publicSettings?.PRIMARY_COLOR?.valueString,
							backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
						}}
					>
						<p>質問を上下にドラッグして並べ替えます</p>
					</motion.div>
				</motion.div>
				<MotionRowComponent
					gutter={[32, 32]}
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
				>
					<MotionColComponent xs={24} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						{orderedCampaignQuestions && orderedCampaignQuestions?.length > 0 ? (
							<DragDropContext onDragEnd={campaignQuestionOnDragEndHandle}>
								<Droppable droppableId="droppableQuestion" direction="vertical">
									{(provided, snapshot) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="flex flex-col"
										>
											{orderedCampaignQuestions.map((question, index) => (
												<Draggable
													key={question?.campaignQuestionId + ''}
													draggableId={question?.campaignQuestionId + ''}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className="mb-4 cursor-pointer"
														>
															<div
																className="flex items-center px-4 border rounded w-full"
																style={{
																	borderColor:
																		publicSettings?.PRIMARY_COLOR?.valueString,
																	backgroundColor:
																		publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
																	color: publicSettings?.PRIMARY_COLOR?.valueString
																}}
															>
																<p className="p-4 font-bold whitespace-pre-wrap">
																	{`${index + 1}）${question?.contents || ''}`}
																</p>
															</div>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						) : (
							<p className="text-center">質問がありません。</p>
						)}
					</MotionColComponent>
				</MotionRowComponent>
			</Modal>
		</>
	)
}

export default QuestionOrderModal
