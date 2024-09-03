import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Image,
	Input,
	message,
	Modal,
	Row,
	Select,
	Tag,
	Upload
} from 'antd'
import { CloseOutlined, PlusOutlined, CameraOutlined } from '@ant-design/icons'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import moment from 'moment'
import jaJP from 'antd/lib/date-picker/locale/ja_JP'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'

const CustomUpload = styled(Upload)`
	.ant-upload {
		width: 100%;
		max-height: '200px';
	}
`

const { TextArea } = Input
const { Option } = Select

const CampaignModal = (props) => {
	const { isCampaignModalVisible, hideCampaignModal, currentCampaign } = props
	const { publicSettings } = useLayoutConfigContext()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [campaignForm] = Form.useForm()
	const [categoryImages, setCategoryImages] = useState([])
	const [categoryTags, setCategoryTags] = useState([])
	const [categoryAreas, setCategoryAreas] = useState([])
	const [templates, setTemplates] = useState([])
	const [startRegistration, setStartRegistration] = useState()
	const [currentTemplateCampaign, setCurrentTemplateCampaign] = useState(undefined)

	useQuery([API.QUERY_KEY_ADMIN_CATEGORY_TAGS], () => API.ADMIN_GET_CATEGORY_TAGS(), {
		enabled: isCampaignModalVisible,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setCategoryTags(response?.data || [])
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

	useQuery([API.QUERY_KEY_ADMIN_CATEGORY_AREAS], () => API.ADMIN_GET_CATEGORY_AREAS(), {
		enabled: isCampaignModalVisible,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setCategoryAreas(response?.data || [])
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

	useQuery([API.QUERY_KEY_ADMIN_CAMPAIGN_TEMPLATES], () => API.ADMIN_GET_CAMPAIGN_TEMPLATES(true), {
		enabled: isCampaignModalVisible,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setTemplates(response?.data || [])
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

	useQuery(
		[API.QUERY_KEY_ADMIN_CAMPAIGN_TEMPLATE_DETAIL, currentTemplateCampaign],
		() => API.ADMIN_GET_CAMPAIGN_TEMPLATE_DETAIL(currentTemplateCampaign),
		{
			enabled: isCampaignModalVisible && !!currentTemplateCampaign,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (response?.data) {
						setCategoryImages([])
						setStartRegistration(moment(response?.data?.startRegistration))

						campaignForm.setFieldsValue({
							isDisplayed:
								response?.data?.isDisplayed !== undefined ? response.data.isDisplayed + '' : undefined,
							title: response?.data?.title,
							categoryImages: [{}],
							description: response?.data?.description,
							categoryDetails: response?.data?.categoryDetails || [],
							categoryTags: response?.data?.categoryTags
								? response.data.categoryTags.map((tag) => tag?.contents || '')
								: [],
							campaignText: response?.data?.campaignText,
							categoryAreas: response?.data?.categoryAreas
								? response.data.categoryAreas.map((area) => area?.contents || '')
								: [],
							location: response?.data?.location,

							startRegistration: moment(response?.data?.startRegistration),
							endRegistration: moment(response?.data?.endRegistration),

							isMultiEvent: response?.data?.isMultiEvent,
							isMultipleWinners: response?.data?.isMultipleWinners
						})
					}
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

	const createCampaignMutation = useMutation(API.ADMIN_CREATE_CAMPAIGN, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORIES]
				})
				hideCampaignModal()
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

	const updateCampaignMutation = useMutation(API.ADMIN_UPDATE_CAMPAIGN, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
				})
				hideCampaignModal()
				setStartRegistration()
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
		if (!isCampaignModalVisible) {
			campaignForm.resetFields()
			setCategoryImages([])
			setCategoryTags([])
			setCategoryAreas([])
			setTemplates([])
			setCurrentTemplateCampaign(undefined)
		}
	}, [isCampaignModalVisible, campaignForm])

	useEffect(() => {
		if (isCampaignModalVisible && currentCampaign) {
			setCategoryImages(currentCampaign?.categoryImages || [])
			setStartRegistration(moment(currentCampaign.startRegistration))
			campaignForm.setFieldsValue({
				isDisplayed: currentCampaign?.isDisplayed !== undefined ? currentCampaign.isDisplayed + '' : undefined,
				title: currentCampaign?.title,
				categoryImages: currentCampaign?.categoryImages
					? currentCampaign.categoryImages.map((image) => {
							return { image: image?.picUrl }
					  })
					: [{}],
				description: currentCampaign?.description,
				categoryDetails: currentCampaign?.categoryDetails || [],
				categoryTags: currentCampaign?.categoryTags
					? currentCampaign.categoryTags.map((tag) => tag?.contents || '')
					: [],
				campaignText: currentCampaign?.campaignText,
				categoryAreas: currentCampaign?.categoryAreas
					? currentCampaign.categoryAreas.map((area) => area?.contents || '')
					: [],
				location: currentCampaign?.location,

				startRegistration: moment(currentCampaign?.startRegistration),
				endRegistration: moment(currentCampaign?.endRegistration),

				isMultiEvent: currentCampaign?.isMultiEvent,
				isMultipleWinners: currentCampaign?.isMultipleWinners
			})
		}

		// eslint-disable-next-line
	}, [isCampaignModalVisible, currentCampaign])

	const handleCategory = (data) => {
		const formData = new FormData()

		formData.append('startRegistration', moment(data?.startRegistration).toISOString())
		formData.append('endRegistration', moment(data?.endRegistration).toISOString())
		formData.append('isMultiEvent', data?.isMultiEvent || false)
		formData.append('isMultipleWinners', data?.isMultipleWinners || false)

		formData.append('isDisplayed', data?.isDisplayed + '')
		formData.append('title', data?.title || '')
		formData.append('description', data?.description || '')
		formData.append('campaignText', data?.campaignText || '')
		formData.append('location', data?.location || '')

		if (data?.categoryDetails && data?.categoryDetails?.length > 0) {
			formData.append(
				'categoryDetails',
				JSON.stringify(data.categoryDetails.map((cd, i) => ({ ...cd, showOrder: i })))
			)
		} else {
			formData.append('categoryDetails', '')
		}

		if (data?.categoryTags && data?.categoryTags?.length > 0) {
			formData.append(
				'categoryTags',
				JSON.stringify(data.categoryTags.map((tag, i) => ({ contents: tag, showOrder: i })))
			)
		} else {
			formData.append('categoryTags', '')
		}

		if (data?.categoryAreas && data?.categoryAreas?.length > 0) {
			formData.append(
				'categoryAreas',
				JSON.stringify(
					data.categoryAreas.map((area, i) => ({
						contents: area,
						showOrder: i
					}))
				)
			)
		} else {
			formData.append('categoryAreas', '')
		}

		if (categoryImages && categoryImages.length > 0) {
			formData.append(
				'categoryImagesData',
				JSON.stringify(
					categoryImages.map((image, i) => ({
						originalName: image?.file?.name || image?.picUrl,
						showOrder: i
					}))
				)
			)

			categoryImages
				.filter((image) => image?.file)
				.map((image) => image?.file)
				.forEach((imageData) => {
					formData.append('categoryImages', imageData)
				})
		} else {
			formData.append('categoryImages', '')
			formData.append('categoryImagesData', '')
		}

		let paramData = {
			formData: formData
		}

		if (currentCampaign) {
			paramData.campaignId = currentCampaign?.campaignId

			updateCampaignMutation.mutate(paramData)
		} else {
			createCampaignMutation.mutate(paramData)
		}
	}

	const selectTagRender = (props) => {
		const { label, closable, onClose } = props

		const onPreventMouseDown = (event) => {
			event.preventDefault()
			event.stopPropagation()
		}

		return (
			<Tag
				color={publicSettings?.PRIMARY_COLOR?.valueString}
				onMouseDown={onPreventMouseDown}
				closable={closable}
				onClose={onClose}
				style={{ marginRight: 3 }}
			>
				{label}
			</Tag>
		)
	}

	const handleTemplateChange = (campaignId) => {
		setCurrentTemplateCampaign(campaignId)
	}

	const categoryImagesOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const orderedCategoryImages = COMMONS.RE_ORDER(
				campaignForm.getFieldValue('categoryImages'),
				result.source.index,
				result.destination.index
			)

			const orderedCategoryImageFiles = COMMONS.RE_ORDER(
				categoryImages,
				result.source.index,
				result.destination.index
			)

			campaignForm.setFieldsValue({
				categoryImages: orderedCategoryImages
			})

			setCategoryImages(orderedCategoryImageFiles)
		}
	}

	const categoryDetailsOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const orderedCategoryDetails = COMMONS.RE_ORDER(
				campaignForm.getFieldValue('categoryDetails'),
				result.source.index,
				result.destination.index
			)

			campaignForm.setFieldsValue({
				categoryDetails: orderedCategoryDetails
			})
		}
	}

	return (
		<>
			<Modal
				open={isCampaignModalVisible}
				onCancel={hideCampaignModal}
				title={
					currentCampaign
						? `${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}編集`
						: `新規${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}登録`
				}
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
				<div className="p-2">
					<Form
						size="large"
						form={campaignForm}
						layout="vertical"
						initialValues={{
							isDisplayed: 'true',
							categoryImages: [{}],
							categoryDetails: [{}],
							categoryTags: [],
							categoryAreas: [],
							isSettingTime: false
						}}
						onFinish={handleCategory}
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
								className="flex justify-end mb-4"
							>
								<Select
									placeholder="テンプレートを選択してください"
									onChange={handleTemplateChange}
									style={{ width: '300px', textAlign: 'center' }}
								>
									{templates.map((template) => (
										<Option key={template?.campaignId} value={template?.campaignId}>
											{(template?.title || 'ー') + 'のテンプレート'}
										</Option>
									))}
								</Select>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Row>
									<Col span={12}>
										<Form.Item
											label={
												<p>
													<span>応募開始日</span>
													<span className="custom-required-decoration">必須</span>
												</p>
											}
											name="startRegistration"
											rules={[
												{
													required: true,
													message: ``
												}
											]}
										>
											<DatePicker
												locale={jaJP}
												format="YYYY-MM-DD HH:mm"
												disabled={
													currentCampaign &&
													moment().isAfter(currentCampaign?.startRegistration)
												}
												showTime={{
													defaultValue: moment('00:00:00', 'HH:mm')
												}}
												onChange={(value) => {
													setStartRegistration(value)
													campaignForm.resetFields(['endRegistration'])
												}}
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											name="endRegistration"
											rules={[
												{
													required: true,
													message: ``
												}
											]}
											label={
												<p>
													<span>応募終了日</span>
													<span className="custom-required-decoration">必須</span>
												</p>
											}
										>
											<DatePicker
												locale={jaJP}
												format="YYYY-MM-DD HH:mm"
												disabled={
													currentCampaign &&
													moment().isAfter(currentCampaign?.startRegistration)
												}
												showTime={{
													defaultValue: moment('00:00:00', 'HH:mm')
												}}
												disabledDate={(current) => {
													return (
														startRegistration &&
														current &&
														moment(current).format('YYYY-MM-DD') <
															moment(startRegistration).format('YYYY-MM-DD')
													)
												}}
												disabledTime={(current) => {
													if (
														moment(current).format('YYYY-MM-DD') ===
														moment(startRegistration).format('YYYY-MM-DD')
													) {
														return {
															disabledHours: () =>
																startRegistration &&
																Array.from({ length: 60 }, (_, i) => i).filter(
																	(i) =>
																		i <
																		Number(moment(startRegistration).format('HH'))
																),
															disabledMinutes: () =>
																Array.from({ length: 60 }, (_, i) => i).filter(
																	(i) =>
																		i <=
																		Number(moment(startRegistration).format('mm'))
																)
														}
													}
												}}
											/>
										</Form.Item>
									</Col>
								</Row>

								<Row>
									<Col span={24}>
										<Form.Item name="isMultipleWinners" valuePropName="checked">
											<Checkbox>複数当選可</Checkbox>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item name="isMultiEvent" valuePropName="checked">
											<Checkbox>他のキャンペーンと同時に応募可</Checkbox>
										</Form.Item>
									</Col>
								</Row>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="isDisplayed"
									label={
										<p>
											<span>表示状態</span>
											<span className="custom-required-decoration">必須</span>
										</p>
									}
									rules={[
										{
											required: true,
											message: '表示状態を選択してください'
										}
									]}
								>
									<Select placeholder="表示状態を選択してください">
										<Option value="true">表示</Option>
										<Option value="false">非表示</Option>
									</Select>
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="title"
									label={
										<p>
											<span className="font-bold">
												{COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}タイトル名
											</span>
											<span className="custom-required-decoration">必須</span>
										</p>
									}
									rules={[
										{
											required: true,
											message: `${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}名は必須です`
										}
									]}
								>
									<Input
										placeholder={`${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}タイトル名を入力してください`}
										allowClear
									/>
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<p>
									<span className="font-bold">{COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}画像</span>
									<span className="custom-required-decoration">必須</span>
								</p>
								<p className="text-xs text-gray-400 mb-4 mt-2">
									※項目をドラッグして表示順を自由に調整できます
								</p>
								<div>
									<Form.List name="categoryImages">
										{(fields, { add, remove }) => (
											<DragDropContext onDragEnd={categoryImagesOnDragEndHandle}>
												<Droppable droppableId="droppableCategoryImage" direction="vertical">
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.droppableProps}
															className="w-full"
														>
															{fields.map((field, index) => (
																<Draggable
																	key={field.key + ''}
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
																			<Form.Item
																				{...field}
																				key={[field.key, 'image']}
																				name={[field.name, 'image']}
																				label={
																					<p>
																						<span>
																							{`${
																								COMMONS.PAGE_ADMIN_LIST_CAMPAIGN
																							}画像（${index + 1}`}
																							）
																						</span>
																						<span className="custom-required-decoration">
																							必須
																						</span>
																					</p>
																				}
																				valuePropName="file"
																				className="mb-0 text-center"
																				rules={[
																					{
																						required: true,
																						message: `${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}画像をアップロードしてください`
																					}
																				]}
																			>
																				<span>
																					<CustomUpload
																						accept=".jpg, .jpeg, .png"
																						maxCount={1}
																						showUploadList={false}
																						beforeUpload={() => {
																							return false
																						}}
																						onChange={async (param) => {
																							const _file =
																								await COMMONS.RESIZE_FILE(
																									param?.file,
																									'file'
																								)
																							const _preview =
																								await COMMONS.RESIZE_FILE(
																									param?.file,
																									'base64'
																								)

																							if (categoryImages[index]) {
																								setCategoryImages(
																									categoryImages.map(
																										(ci, i) =>
																											i === index
																												? {
																														file: _file,
																														preview:
																															_preview
																												  }
																												: ci
																									)
																								)
																							} else {
																								let duplicateArray = [
																									...categoryImages
																								]
																								duplicateArray[index] =
																									{
																										file: _file,
																										preview:
																											_preview
																									}

																								setCategoryImages(
																									duplicateArray
																								)
																							}
																						}}
																					>
																						<TapAnimationComponent>
																							{categoryImages[index] &&
																							(categoryImages[index]
																								?.preview ||
																								categoryImages[index]
																									?.picUrl) ? (
																								<div className="flex justify-center">
																									<Image
																										preview={false}
																										src={
																											categoryImages[
																												index
																											]
																												?.preview ||
																											`${API.CATEGORIES_UPLOADS_URL}${categoryImages[index]?.picUrl}`
																										}
																										alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
																										fallback="/no-image.png"
																										style={{
																											maxHeight:
																												'250px'
																										}}
																										className="max-w-full cursor-pointer object-contain"
																									/>
																								</div>
																							) : (
																								<div
																									className="flex justify-center items-center bg-white border border-gray-300 rounded w-full cursor-pointer"
																									style={{
																										height: '250px',
																										maxHeight:
																											'250px'
																									}}
																								>
																									<p className="text-center text-2xl font-bold">
																										<CameraOutlined className="mr-2" />
																									</p>
																								</div>
																							)}
																						</TapAnimationComponent>
																					</CustomUpload>
																				</span>
																			</Form.Item>
																			{fields.length > 1 ? (
																				<Form.Item
																					{...field}
																					className="text-right"
																				>
																					<Button
																						size="default"
																						danger
																						onClick={() => {
																							remove(field.name)
																							setCategoryImages(
																								categoryImages.filter(
																									(ci, i) =>
																										i !== index
																								)
																							)
																						}}
																						icon={<CloseOutlined />}
																					>
																						削除する
																					</Button>
																				</Form.Item>
																			) : null}
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
																	icon={<PlusOutlined className="mr-1" />}
																>
																	画像追加
																</Button>
															</Form.Item>
														</div>
													)}
												</Droppable>
											</DragDropContext>
										)}
									</Form.List>
								</div>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="description"
									label={<p className="font-bold">{`${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}内容`}</p>}
								>
									<TextArea placeholder="例：○○" autoSize={{ minRows: 3 }} />
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<p className="font-bold">{COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}概要</p>
								<p className="text-xs text-gray-400 mb-4 mt-2">
									※項目をドラッグして表示順を自由に調整できます
								</p>
								<div>
									<Form.List name="categoryDetails">
										{(fields, { add, remove }) => (
											<DragDropContext onDragEnd={categoryDetailsOnDragEndHandle}>
												<Droppable droppableId="droppableCategoryDetail" direction="vertical">
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.droppableProps}
															className="w-full"
														>
															{fields.map((field, index) => (
																<Draggable
																	key={field.key + ''}
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
																			<Form.Item
																				label={`${
																					COMMONS.PAGE_ADMIN_LIST_CAMPAIGN
																				}概要（${index + 1}）`}
																				className="mb-0"
																			>
																				<Form.Item
																					{...field}
																					key={[field.key, 'label']}
																					name={[field.name, 'label']}
																					label={
																						<p>
																							<span>ラベル</span>
																							<span className="custom-required-decoration">
																								必須
																							</span>
																						</p>
																					}
																					rules={[
																						{
																							required: true,
																							message:
																								'ラベルを入力してください'
																						}
																					]}
																				>
																					<Input
																						placeholder="対象年齢"
																						allowClear
																					/>
																				</Form.Item>
																				<Form.Item
																					{...field}
																					key={[field.key, 'value']}
																					name={[field.name, 'value']}
																					label={
																						<p>
																							<span>詳細</span>
																							<span className="custom-required-decoration">
																								必須
																							</span>
																						</p>
																					}
																					rules={[
																						{
																							required: true,
																							message:
																								'詳細を入力してください'
																						}
																					]}
																				>
																					<TextArea
																						autoSize={{ minRows: 3 }}
																						placeholder="例：3才～12才"
																						allowClear
																					/>
																				</Form.Item>
																			</Form.Item>
																			<Form.Item
																				{...field}
																				className="text-right"
																			>
																				<Button
																					size="default"
																					danger
																					onClick={() => {
																						remove(field.name)
																					}}
																					icon={<CloseOutlined />}
																				>
																					削除する
																				</Button>
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
																	icon={<PlusOutlined className="mr-1" />}
																>
																	{COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}概要追加
																</Button>
															</Form.Item>
														</div>
													)}
												</Droppable>
											</DragDropContext>
										)}
									</Form.List>
								</div>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item name="categoryTags" label={<p className="font-bold">特徴</p>}>
									<Select
										allowClear
										mode="tags"
										className="w-full"
										placeholder="例：HALLOWEEN"
										tagRender={selectTagRender}
									>
										{categoryTags.map((tag) => (
											<Option key={tag?.contents} value={tag?.contents}>
												{tag?.contents}
											</Option>
										))}
									</Select>
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item name="campaignText" label={<p className="font-bold">キャンペーン情報</p>}>
									<TextArea placeholder="例：〇〇" autoSize={{ minRows: 3 }} />
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item name="categoryAreas" label={<p className="font-bold">開催場所</p>}>
									<Select
										allowClear
										mode="tags"
										className="w-full"
										placeholder="例：中央区"
										tagRender={selectTagRender}
									>
										{categoryAreas.map((area) => (
											<Option key={area?.contents} value={area?.contents}>
												{area?.contents}
											</Option>
										))}
									</Select>
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="location"
									label={<p className="font-bold">周辺地図</p>}
									rules={[
										() => ({
											validator: (_, value) =>
												value
													? value.trim().length > 0 &&
													  value.startsWith('https://www.google.com/maps/embed?')
														? Promise.resolve()
														: Promise.reject(
																new Error(
																	'効なGoogleマップの埋め込みコードを入力してください'
																)
														  )
													: Promise.resolve()
										})
									]}
									extra={
										<p className="whitespace-pre-wrap mt-2">
											{`※GOOGLEマップで場所にクリックし、「共有」ボタンを押し、「地図を埋め込む」にクリックし、\n「HTMLをコピー」してここに貼り付けしてください。`}
										</p>
									}
								>
									<TextArea
										placeholder="例：https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d819.6193110986798!2d135.305944!3d34.743569!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc9849c686a990a7b!2z44OX44Os44K444Kq6Iqm5bGL!5e0!3m2!1sja!2sjp!4v1663202873471!5m2!1sja!2sjp"
										autoSize={{ minRows: 3 }}
										onChange={(val) => {
											if (val?.currentTarget?.value) {
												campaignForm.setFieldsValue({
													location:
														val.currentTarget.value.match(
															/<iframe.*?src=["|'](.*?)["|']/
														)[1] || undefined
												})
											}
										}}
									/>
								</Form.Item>
							</motion.div>
							<Divider />
							<motion.div
								variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
								className="flex justify-center"
							>
								<TapAnimationComponent>
									<Button
										type="primary"
										htmlType="submit"
										loading={
											currentCampaign
												? updateCampaignMutation.isLoading
												: createCampaignMutation.isLoading
										}
									>
										{currentCampaign ? '保存する' : '作成する'}
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

export default CampaignModal
