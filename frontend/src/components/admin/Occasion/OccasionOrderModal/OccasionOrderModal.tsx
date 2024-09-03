import { Button, Col, Image, message, Modal, Row } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { AxiosError } from 'axios'

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const OccasionOrderModal = (props) => {
	const { publicSettings, isOccasionOrderModalVisible, hideOccasionOrderModal, occasions } = props
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [orderedOccasions, setOrderedOccasions] = useState([])

	const updateOccasionOrderMutation = useMutation(API.ADMIN_UPDATE_OCCASION_ORDER, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASIONS]
				})
				hideOccasionOrderModal()
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
		if (!isOccasionOrderModalVisible) {
			setOrderedOccasions([])
		} else {
			setOrderedOccasions(occasions)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOccasionOrderModalVisible])

	const handleOccasionOrder = () => {
		const paramData = {
			occasions: orderedOccasions.map((c, i) => ({
				occasionId: c?.occasionId,
				showOrder: i
			}))
		}

		updateOccasionOrderMutation.mutate(paramData)
	}

	const occasionOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const reOrderedOccasions = COMMONS.RE_ORDER(orderedOccasions, result.source.index, result.destination.index)

			setOrderedOccasions(reOrderedOccasions)
		}
	}

	const handleRevert = () => {
		setOrderedOccasions(occasions)
	}

	return (
		<>
			<Modal
				open={isOccasionOrderModalVisible}
				onCancel={hideOccasionOrderModal}
				title={`キャンペーンプレゼント表示順`}
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
							<Button type="primary" className="m-1 w-32" size="large" onClick={handleOccasionOrder}>
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
						<p>{`キャンペーンプレゼントを上下にドラッグして並べ替えます`}</p>
					</motion.div>
				</motion.div>
				<MotionRowComponent
					gutter={[32, 32]}
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
				>
					<MotionColComponent xs={24} md={12} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						{orderedOccasions && orderedOccasions?.length > 0 ? (
							<DragDropContext onDragEnd={occasionOnDragEndHandle}>
								<Droppable droppableId="droppableOccasion" direction="vertical">
									{(provided, snapshot) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="flex flex-col"
										>
											{orderedOccasions.map((occasion, index) => (
												<Draggable
													key={occasion?.occasionId + ''}
													draggableId={occasion?.occasionId + ''}
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
																{occasion?.occasionImages &&
																occasion?.occasionImages?.length > 0 ? (
																	occasion.occasionImages[0]?.picUrl ? (
																		<Image
																			src={`${API.OCCASIONS_UPLOADS_URL}${
																				occasion.occasionImages[0]?.picUrl || ''
																			}`}
																			preview={false}
																			height={100}
																			width={100}
																			alt={occasion.title || ''}
																			className="rounded object-contain"
																			fallback="/no-image.png"
																		/>
																	) : (
																		<Image
																			preview={false}
																			src="/no-image.png"
																			height={100}
																			width={100}
																			alt={occasion.title || ''}
																			className="rounded object-contain"
																		/>
																	)
																) : (
																	<Image
																		src="/no-image.png"
																		width={100}
																		height={100}
																		className="rounded"
																		preview={false}
																	/>
																)}
																<p className="p-4 font-bold">{occasion?.title}</p>
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
							<p className="text-center">{`キャンペーンプレゼントがありません。`}</p>
						)}
					</MotionColComponent>
					<MotionColComponent xs={24} md={12} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<div
							className="flex flex-col p-4 rounded"
							style={{
								color: publicSettings?.PRIMARY_COLOR?.valueString
							}}
						>
							<p className="font-bold text-xl mb-4">プレビュー</p>
							<MotionRowComponent
								gutter={[16, 16]}
								variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
								initial="hidden"
								animate="show"
								exit="hidden"
							>
								{orderedOccasions && orderedOccasions.length > 0 ? (
									orderedOccasions.map((occasion) => (
										<MotionColComponent
											key={occasion?.occasionId}
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={12}
											md={8}
										>
											<div className="flex flex-col">
												<div>
													<div className="flex justify-center">
														{occasion?.occasionImages &&
														occasion?.occasionImages?.length > 0 ? (
															occasion.occasionImages[0]?.picUrl ? (
																<Image
																	src={`${API.OCCASIONS_UPLOADS_URL}${
																		occasion.occasionImages[0]?.picUrl || ''
																	}`}
																	preview={false}
																	width={100}
																	height={100}
																	alt={occasion.title || ''}
																	className="rounded object-contain"
																	fallback="/no-image.png"
																/>
															) : (
																<Image
																	preview={false}
																	src="/no-image.png"
																	width={100}
																	height={100}
																	alt={occasion?.title || ''}
																	className="rounded object-contain"
																/>
															)
														) : (
															<Image
																preview={false}
																src="/no-image.png"
																width={100}
																height={100}
																alt={occasion.title || ''}
																className="rounded object-contain"
															/>
														)}
													</div>
												</div>
												<div className="p-2">
													<p className="text-xs font-bold text-center">
														{occasion?.title || 'ー'}
													</p>
												</div>
											</div>
										</MotionColComponent>
									))
								) : (
									<MotionColComponent xs={24} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
										<p className="text-center">{`キャンペーンプレゼントがありません。`}</p>
									</MotionColComponent>
								)}
							</MotionRowComponent>
						</div>
					</MotionColComponent>
				</MotionRowComponent>
			</Modal>
		</>
	)
}

export default OccasionOrderModal
