import { Button, Col, Image, message, Modal, Row } from 'antd'
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

const CategoryOrderModal = (props) => {
	const { publicSettings, isCategoryOrderModalVisible, hideCategoryOrderModal } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const includePic = true
	const includeDestroyed = false

	const [categories, setCategories] = useState([])
	const [orderedCategories, setOrderedCategories] = useState([])

	useQuery(
		[API.QUERY_KEY_ADMIN_CATEGORY_LIST, includePic, includeDestroyed],
		() => API.ADMIN_GET_CATEGORY_LIST(includePic, includeDestroyed),
		{
			enabled: isCategoryOrderModalVisible,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setCategories(response?.data || [])
					setOrderedCategories(response?.data || [])
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

	const updateCategoryOrderMutation = useMutation(API.ADMIN_UPDATE_CATEGORY_ORDER, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_CATEGORIES] })
				hideCategoryOrderModal()
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
		if (!isCategoryOrderModalVisible) {
			setCategories([])
		}
	}, [isCategoryOrderModalVisible])

	const handleCategoryOrder = () => {
		const paramData = {
			categories: orderedCategories.map((c, i) => ({
				categoryId: c?.categoryId,
				showOrder: i
			}))
		}

		updateCategoryOrderMutation.mutate(paramData)
	}

	const categoryOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const reOrderedCategories = COMMONS.RE_ORDER(
				orderedCategories,
				result.source.index,
				result.destination.index
			)

			setOrderedCategories(reOrderedCategories)
		}
	}

	const handleRevert = () => {
		setOrderedCategories(categories)
	}

	return (
		<>
			<Modal
				open={isCategoryOrderModalVisible}
				onCancel={hideCategoryOrderModal}
				title={`${COMMONS.DEFAULT_SYSTEM_TYPE}表示順`}
				footer={null}
				destroyOnClose
				maskClosable={false}
				centered
				width={720}
				styles={{ body: { maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' } }}
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
							<Button type="primary" className="m-1 w-32" size="large" onClick={handleCategoryOrder}>
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
						<p>{COMMONS.DEFAULT_SYSTEM_TYPE}を上下にドラッグして並べ替えます</p>
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
						{orderedCategories && orderedCategories?.length > 0 ? (
							<DragDropContext onDragEnd={categoryOnDragEndHandle}>
								<Droppable droppableId="droppableCategory" direction="vertical">
									{(provided, snapshot) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="flex flex-col"
										>
											{orderedCategories.map((category, index) => (
												<Draggable
													key={category?.categoryId + ''}
													draggableId={category?.categoryId + ''}
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
																{category?.categoryImages &&
																category?.categoryImages?.length > 0 ? (
																	category.categoryImages[0]?.picUrl ? (
																		<Image
																			src={`${API.CATEGORIES_UPLOADS_URL}${
																				category.categoryImages[0]?.picUrl || ''
																			}`}
																			preview={false}
																			height={100}
																			width={100}
																			alt={category.title || ''}
																			className="rounded object-contain"
																			fallback="/no-image.png"
																		/>
																	) : (
																		<Image
																			preview={false}
																			src="/no-image.png"
																			height={100}
																			width={100}
																			alt={category.title || ''}
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
																<p className="p-4 font-bold">{category?.title}</p>
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
							<p className="text-center">{`${COMMONS.DEFAULT_SYSTEM_TYPE}がありません。`}</p>
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
								{orderedCategories && orderedCategories.length > 0 ? (
									orderedCategories.map((category) => (
										<MotionColComponent
											key={category?.categoryId}
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={12}
											md={8}
										>
											<div className="flex flex-col">
												<div>
													<div className="flex justify-center">
														{category?.categoryImages &&
														category?.categoryImages?.length > 0 ? (
															category.categoryImages[0]?.picUrl ? (
																<Image
																	src={`${API.CATEGORIES_UPLOADS_URL}${
																		category.categoryImages[0]?.picUrl || ''
																	}`}
																	preview={false}
																	width={100}
																	height={100}
																	alt={category.title || ''}
																	className="rounded object-contain"
																	fallback="/no-image.png"
																/>
															) : (
																<Image
																	preview={false}
																	src="/no-image.png"
																	width={100}
																	height={100}
																	alt={category?.title || ''}
																	className="rounded object-contain"
																/>
															)
														) : (
															<Image
																preview={false}
																src="/no-image.png"
																width={100}
																height={100}
																alt={category.title || ''}
																className="rounded object-contain"
															/>
														)}
													</div>
												</div>
												<div className="p-2">
													<p className="text-xs font-bold text-center">
														{category?.title || 'ー'}
													</p>
												</div>
											</div>
										</MotionColComponent>
									))
								) : (
									<MotionColComponent xs={24} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
										<p className="text-center">{`${COMMONS.DEFAULT_SYSTEM_TYPE}がありません。`}</p>
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

export default CategoryOrderModal
