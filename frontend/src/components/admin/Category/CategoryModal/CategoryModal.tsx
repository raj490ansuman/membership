import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Flex,
	Form,
	Image,
	Input,
	InputNumber,
	message,
	Modal,
	Row,
	Select,
	Switch,
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

const CustomUpload = styled(Upload)`
	.ant-upload {
		width: 100%;
		max-height: '200px';
	}
`

const FormItem = styled(Form.Item)`
	margin-bottom: 0px;
`
const { TextArea } = Input
const { Option } = Select

const placeholder = `例：子どもの名前１人目
        年齢`

const CategoryModal = (props) => {
	const { publicSettings, isCategoryModalVisible, hideCategoryModal, currentCategory } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [categoryForm] = Form.useForm()
	const [categoryImages, setCategoryImages] = useState([])
	const [categoryTags, setCategoryTags] = useState([])
	const [categoryAreas, setCategoryAreas] = useState([])
	const [templates, setTemplates] = useState([])
	const [isSettingTime, setIsSettingTime] = useState(false)
	const [isProgram, setIsProgram] = useState(false)

	const [numberPeople, setNumberPeople] = useState(0)
	const [startDate, setStartDate] = useState()
	const [startRegistration, setStartRegistration] = useState()
	const [isMultiEvent, setIsMultiEvent] = useState(false)
	const [numberOfPeople, setNumberOfPeople] = useState()
	const [currentTemplateCategory, setCurrentTemplateCategory] = useState(undefined)

	useQuery([API.QUERY_KEY_ADMIN_CATEGORY_TAGS], () => API.ADMIN_GET_CATEGORY_TAGS(), {
		enabled: isCategoryModalVisible,
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
		enabled: isCategoryModalVisible,
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

	useQuery([API.QUERY_KEY_ADMIN_CATEGORY_TEMPLATES], () => API.ADMIN_GET_CATEGORY_TEMPLATES(), {
		enabled: isCategoryModalVisible,
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
		[API.QUERY_KEY_ADMIN_CATEGORY_TEMPLATE_DETAIL, currentTemplateCategory],
		() => API.ADMIN_GET_CATEGORY_TEMPLATE_DETAIL(currentTemplateCategory),
		{
			enabled: isCategoryModalVisible && !!currentTemplateCategory,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (response?.data) {
						setCategoryImages([])
						setIsSettingTime(response?.data?.isSettingTime)
						setIsProgram(response?.data?.isProgram)
						setIsMultiEvent(response?.data?.isMultiEvent)
						setNumberOfPeople(response?.data?.numberOfPeople)
						setStartRegistration(moment(response?.data?.startRegistration))
						setStartDate(moment(response?.data?.startDate))

						handleNumberPeople(
							response?.data?.numberOfPeople,
							response?.data?.startDate,
							response?.data?.endDate
						)

						categoryForm.setFieldsValue({
							isDisplayed:
								response?.data?.isDisplayed !== undefined ? response.data.isDisplayed + '' : undefined,
							title: response?.data?.title,
							sub: response?.data?.sub,
							isSendImage: currentCategory?.isSendImage,
							isProgram: currentCategory?.isProgram,
							categoryImages: [{}],
							description: response?.data?.description,
							categoryDetails: response?.data?.categoryDetails || [],
							categoryMessages: response?.data?.categoryMessages || [],
							categoryTags: response?.data?.categoryTags
								? response.data.categoryTags.map((tag) => tag?.contents || '')
								: [],
							campaignText: response?.data?.campaignText,
							categoryAreas: response?.data?.categoryAreas
								? response.data.categoryAreas.map((area) => area?.contents || '')
								: [],
							location: response?.data?.location,

							isSettingTime: response?.data?.isSettingTime,
							...(response?.data?.isSettingTime
								? {
										startRegistration: moment(response?.data?.startRegistration),
										endRegistration: moment(response?.data?.endRegistration),
										startDate: moment(response?.data?.startDate),
										endDate: moment(response?.data?.endDate),
										numberOfPeople: response?.data?.numberOfPeople
								  }
								: {
										notRegisterEventSameTime: response?.data?.notRegisterEventSameTime
								  }),
							isMultiEvent: response?.data?.isMultiEvent
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

	const createCategoryMutation = useMutation(API.ADMIN_CREATE_CATEGORY, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORIES]
				})
				hideCategoryModal()
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

	const updateCategoryMutation = useMutation(API.ADMIN_UPDATE_CATEGORY, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
				})
				hideCategoryModal()
				setStartDate()
				setStartRegistration()
				setNumberOfPeople()
				setIsSettingTime(false)
				setIsProgram(false)
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
		if (!isCategoryModalVisible) {
			categoryForm.resetFields()
			setCategoryImages([])
			setCategoryTags([])
			setCategoryAreas([])
			setTemplates([])
			setCurrentTemplateCategory(undefined)
		}
	}, [isCategoryModalVisible, categoryForm])

	useEffect(() => {
		if (isCategoryModalVisible && currentCategory) {
			setCategoryImages(currentCategory?.categoryImages || [])
			setIsSettingTime(currentCategory?.isSettingTime)
			setIsProgram(currentCategory?.isProgram)
			setIsMultiEvent(currentCategory?.isMultiEvent)
			setNumberOfPeople(currentCategory?.numberOfPeople)
			setStartRegistration(moment(currentCategory.startRegistration))
			setStartDate(moment(currentCategory?.startDate))

			handleNumberPeople(currentCategory?.numberOfPeople, currentCategory?.startDate, currentCategory?.endDate)

			categoryForm.setFieldsValue({
				isDisplayed: currentCategory?.isDisplayed !== undefined ? currentCategory.isDisplayed + '' : undefined,
				title: currentCategory?.title,
				sub: currentCategory?.sub,
				isProgram: currentCategory?.isProgram,
				isSendImage: currentCategory?.isSendImage,
				categoryImages: currentCategory?.categoryImages
					? currentCategory.categoryImages.map((image) => {
							return { image: image?.picUrl }
					  })
					: [{}],
				description: currentCategory?.description,
				categoryDetails: currentCategory?.categoryDetails || [],
				categoryMessages: currentCategory?.categoryMessages || [],
				categoryTags: currentCategory?.categoryTags
					? currentCategory.categoryTags.map((tag) => tag?.contents || '')
					: [],
				campaignText: currentCategory?.campaignText,
				categoryAreas: currentCategory?.categoryAreas
					? currentCategory.categoryAreas.map((area) => area?.contents || '')
					: [],
				location: currentCategory?.location,

				isSettingTime: currentCategory?.isSettingTime,
				...(currentCategory?.isSettingTime
					? {
							startRegistration: moment(currentCategory?.startRegistration),
							endRegistration: moment(currentCategory?.endRegistration),
							startDate: moment(currentCategory?.startDate),
							endDate: moment(currentCategory?.endDate),
							numberOfPeople: currentCategory?.numberOfPeople
					  }
					: {
							notRegisterEventSameTime: currentCategory?.notRegisterEventSameTime
					  }),
				isMultiEvent: currentCategory?.isMultiEvent
			})
		}

		// eslint-disable-next-line
	}, [isCategoryModalVisible, currentCategory])

	const handleCategory = (data) => {
		const formData = new FormData()

		if (data?.isSettingTime) {
			formData.append('startRegistration', moment(data?.startRegistration).toISOString())
			formData.append('endRegistration', moment(data?.endRegistration).toISOString())
			formData.append('startDate', moment(data?.startDate).toISOString())
			formData.append('endDate', moment(data?.endDate).toISOString())
			formData.append('numberOfPeople', Number(data?.numberOfPeople))
		} else {
			if (data?.isMultiEvent) {
				formData.append('notRegisterEventSameTime', data?.notRegisterEventSameTime || false)
			}
		}
		formData.append('isSendImage', data?.isSendImage || false)
		formData.append('isProgram', data?.isProgram || false)
		formData.append('isMultiEvent', data?.isMultiEvent || false)
		formData.append('isSettingTime', data?.isSettingTime || false)
		formData.append('isDisplayed', data?.isDisplayed + '')
		formData.append('title', data?.title || '')
		formData.append('sub', data?.sub || '')
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

		if (data?.categoryMessages && data?.categoryMessages?.length > 0) {
			formData.append(
				'categoryMessages',
				JSON.stringify(
					data.categoryMessages.filter((item) => item?.label).map((cd, i) => ({ ...cd, showOrder: i }))
				)
			)
		} else {
			formData.append('categoryMessages', '')
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

		if (currentCategory) {
			paramData.categoryId = currentCategory?.categoryId

			updateCategoryMutation.mutate(paramData)
		} else {
			createCategoryMutation.mutate(paramData)
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

	const handleTemplateChange = (categoryId) => {
		setCurrentTemplateCategory(categoryId)
	}

	const categoryImagesOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const orderedCategoryImages = COMMONS.RE_ORDER(
				categoryForm.getFieldValue('categoryImages'),
				result.source.index,
				result.destination.index
			)

			const orderedCategoryImageFiles = COMMONS.RE_ORDER(
				categoryImages,
				result.source.index,
				result.destination.index
			)

			categoryForm.setFieldsValue({
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
				categoryForm.getFieldValue('categoryDetails'),
				result.source.index,
				result.destination.index
			)

			categoryForm.setFieldsValue({
				categoryDetails: orderedCategoryDetails
			})
		}
	}
	const categoryMessageOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const orderedCategoryMessages = COMMONS.RE_ORDER(
				categoryForm.getFieldValue('categoryMessages'),
				result.source.index,
				result.destination.index
			)

			categoryForm.setFieldsValue({
				categoryMessages: orderedCategoryMessages
			})
		}
	}

	const handleNumberPeople = (numberOfPeople, startDate, endDate) => {
		if (numberOfPeople && startDate && endDate) {
			setNumberPeople(
				numberOfPeople *
					(moment(moment(endDate).format('YYYY-MM-DD')).diff(
						moment(moment(startDate).format('YYYY-MM-DD')),
						'days'
					) +
						1)
			)
		} else {
			setNumberPeople(numberOfPeople)
		}
	}

	return (
		<>
			<Modal
				open={isCategoryModalVisible}
				onCancel={hideCategoryModal}
				title={
					currentCategory ? `${COMMONS.DEFAULT_SYSTEM_TYPE}編集` : `新規${COMMONS.PAGE_ADMIN_LIST_EVENTS}登録`
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
						form={categoryForm}
						layout="vertical"
						initialValues={{
							isDisplayed: 'true',
							categoryImages: [{}],
							categoryDetails: [{}],
							categoryMessages: [{}],
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
										<Option key={template?.categoryId} value={template?.categoryId}>
											{(template?.title || 'ー') + 'のテンプレート'}
										</Option>
									))}
								</Select>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Flex gap={10} align="center">
									イベントプログラム設定
									<FormItem name="isProgram" valuePropName="checked">
										<Switch
											disabled={currentCategory ? true : false}
											onClick={(e) => {
												setIsProgram(e)
											}}
										/>
									</FormItem>
								</Flex>
							</motion.div>

							{!isProgram && (
								<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
									<Flex gap={10} align="center">
										期間型イベント設定
										<FormItem name="isSettingTime" valuePropName="checked">
											<Switch
												disabled={currentCategory ? true : false}
												onClick={(e) => {
													setIsSettingTime(e)
												}}
											/>
										</FormItem>
									</Flex>

									{isSettingTime ? (
										<Row>
											<Col span={12}>
												<Form.Item
													label={
														<p>
															<span>イベント予約受付開始日</span>
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
														showTime={{
															defaultValue: moment('00:00:00', 'HH:mm')
														}}
														onChange={(value) => {
															setStartRegistration(value)
															categoryForm.resetFields(['endRegistration'])
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
															<span>イベント予約受付終了日</span>
															<span className="custom-required-decoration">必須</span>
														</p>
													}
												>
													<DatePicker
														locale={jaJP}
														format="YYYY-MM-DD HH:mm"
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
																				Number(
																					moment(startRegistration).format(
																						'HH'
																					)
																				)
																		),
																	disabledMinutes: () =>
																		Array.from({ length: 60 }, (_, i) => i).filter(
																			(i) => {
																				if (
																					moment(startRegistration).format(
																						'HH'
																					) === moment(current).format('HH')
																				) {
																					return (
																						i <=
																						Number(
																							moment(
																								startRegistration
																							).format('mm')
																						)
																					)
																				} else {
																					return false
																				}
																			}
																		)
																}
															}
														}}
													/>
												</Form.Item>
											</Col>

											<Col span={12}>
												<Form.Item
													name="startDate"
													label={
														<p>
															<span>イベント開始日</span>
															<span className="custom-required-decoration">必須</span>
														</p>
													}
													rules={[
														{
															required: true,
															message: ``
														}
													]}
												>
													<DatePicker
														disabled={
															currentCategory &&
															moment().isAfter(currentCategory?.startRegistration)
																? true
																: false
														}
														locale={jaJP}
														format="YYYY-MM-DD HH:mm"
														showTime={{
															defaultValue: moment('00:00:00', 'HH:mm')
														}}
														onChange={(value) => {
															setNumberPeople(
																categoryForm.getFieldValue('numberOfPeople')
															)
															setStartDate(value)
															categoryForm.resetFields(['endDate'])
														}}
													/>
												</Form.Item>
											</Col>
											<Col span={12}>
												<Form.Item
													name="endDate"
													rules={[
														{
															required: true,
															message: ``
														}
													]}
													label={
														<p>
															<span>イベント終了日</span>
															<span className="custom-required-decoration">必須</span>
														</p>
													}
												>
													<DatePicker
														locale={jaJP}
														disabled={
															currentCategory &&
															moment().isAfter(currentCategory?.startRegistration)
																? true
																: false
														}
														format="YYYY-MM-DD HH:mm"
														showTime={{
															defaultValue: moment('00:00:00', 'HH:mm')
														}}
														onChange={(value) => {
															handleNumberPeople(
																categoryForm.getFieldValue('numberOfPeople'),
																categoryForm.getFieldValue('startDate'),
																value
															)
														}}
														disabledDate={(current) => {
															return (
																startDate &&
																current &&
																moment(current).format('YYYY-MM-DD') <
																	moment(startDate).format('YYYY-MM-DD')
															)
														}}
														disabledTime={(current) => {
															if (
																moment(current).format('YYYY-MM-DD') ===
																moment(startDate).format('YYYY-MM-DD')
															) {
																return {
																	disabledHours: () =>
																		startDate &&
																		Array.from({ length: 60 }, (_, i) => i).filter(
																			(i) =>
																				i <
																				Number(moment(startDate).format('HH'))
																		),
																	disabledMinutes: () =>
																		Array.from({ length: 60 }, (_, i) => i).filter(
																			(i) =>
																				i <=
																				Number(moment(startDate).format('mm'))
																		)
																}
															}
														}}
													/>
												</Form.Item>
											</Col>

											<Col span={24}>
												<Form.Item
													name="numberOfPeople"
													label={
														<p>
															<span>イベント申込み可能最大人数</span>
															<span className="custom-required-decoration">必須</span>
														</p>
													}
													rules={[
														{
															required: true,
															message: ``
														}
													]}
												>
													<Flex align="center" gap={30}>
														<Flex align="center" gap={10}>
															<InputNumber
																defaultValue={numberOfPeople}
																onChange={(value) => {
																	handleNumberPeople(
																		value,
																		categoryForm.getFieldValue('startDate'),
																		categoryForm.getFieldValue('endDate')
																	)
																}}
																className="w-full"
																min={0}
															/>
															<div className="w-20"> 人/日</div>
														</Flex>
														<div>期間中 {numberPeople}人</div>
													</Flex>
												</Form.Item>

												<Form.Item name="isMultiEvent" valuePropName="checked">
													<Checkbox onChange={(e) => setIsMultiEvent(e.target.checked)}>
														他のイベントと同時に申込み可
													</Checkbox>
												</Form.Item>
											</Col>
										</Row>
									) : (
										<Row>
											<Col span={24}>
												<Form.Item name="isMultiEvent" valuePropName="checked">
													<Checkbox onChange={(e) => setIsMultiEvent(e.target.checked)}>
														他のイベントと同時に申込み可
													</Checkbox>
												</Form.Item>
											</Col>
											{isMultiEvent && !isSettingTime && (
												<Col span={24}>
													<Form.Item name="notRegisterEventSameTime" valuePropName="checked">
														<Checkbox>時間の重複は不可</Checkbox>
													</Form.Item>
												</Col>
											)}
										</Row>
									)}
								</motion.div>
							)}
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
												{COMMONS.PAGE_ADMIN_LIST_EVENTS}タイトル名
											</span>
											<span className="custom-required-decoration">必須</span>
										</p>
									}
									rules={[
										{
											required: true,
											message: `${COMMONS.PAGE_ADMIN_LIST_EVENTS}名は必須です`
										}
									]}
								>
									<Input
										placeholder={`${COMMONS.PAGE_ADMIN_LIST_EVENTS}タイトル名を入力してください`}
										allowClear
									/>
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="sub"
									label={
										<p>
											<span className="font-bold">サブ説明</span>
											<span className="custom-required-decoration">必須</span>
										</p>
									}
									rules={[
										{
											required: true,
											message: ``
										}
									]}
								>
									<Input allowClear />
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Flex gap={10} align="center">
									<p>
										<span className="font-bold">{COMMONS.PAGE_ADMIN_LIST_EVENTS}画像</span>
										<span className="custom-required-decoration">必須</span>
									</p>
								</Flex>

								<Flex gap={10} align="center">
									<p>
										<span className="font-bold">予約したLINEユーザーにイベント写真を送信</span>
									</p>

									<FormItem name="isSendImage" valuePropName="checked">
										<Switch />
									</FormItem>
								</Flex>

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
																								COMMONS.PAGE_ADMIN_LIST_EVENTS
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
																						message: `${COMMONS.PAGE_ADMIN_LIST_EVENTS}画像をアップロードしてください`
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
									label={<p className="font-bold">{`${COMMONS.PAGE_ADMIN_LIST_EVENTS}内容`}</p>}
								>
									<TextArea placeholder="例：○○" autoSize={{ minRows: 3 }} />
								</Form.Item>
							</motion.div>

							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<p className="font-bold">{COMMONS.DEFAULT_SYSTEM_TYPE}概要</p>
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
																					COMMONS.DEFAULT_SYSTEM_TYPE
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
																						placeholder="例：対象年齢"
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
																						placeholder="例：３才～12才"
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
																	{COMMONS.DEFAULT_SYSTEM_TYPE}概要追加
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
								<p className="font-bold">{COMMONS.PAGE_ADMIN_LIST_EVENTS}メッセージ</p>
								<p className="text-xs text-gray-400 mb-4 mt-2">
									※項目をドラッグして表示順を自由に調整できます
								</p>
								<div>
									<Form.List name="categoryMessages">
										{(fields, { add, remove }) => (
											<DragDropContext onDragEnd={categoryMessageOnDragEndHandle}>
												<Droppable droppableId="droppableCategoryMessages" direction="vertical">
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
																					COMMONS.PAGE_ADMIN_LIST_EVENTS
																				}概要（${index + 1}）`}
																				className="mb-0"
																			>
																				<Form.Item
																					{...field}
																					key={[field.key, 'label']}
																					name={[field.name, 'label']}
																					label="ラベル"
																					// label={
																					//   <p>
																					//     <span>ラベル</span>
																					//     <span className="custom-required-decoration">
																					//       必須
																					//     </span>
																					//   </p>
																					// }
																					// rules={[
																					//   {
																					//     required: true,
																					//     message:
																					//       "ラベルを入力してください",
																					//   },
																					// ]}
																				>
																					<TextArea
																						autoSize={{ minRows: 2 }}
																						// placeholder="例：子どもの名前１人目&#10;&nbsp;&nbsp;年齢"
																						placeholder={placeholder}
																						allowClear
																					/>
																				</Form.Item>
																				{/* <Form.Item
                                          {...field}
                                          key={[field.key, "value"]}
                                          name={[field.name, "value"]}
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
                                              message: "詳細を入力してください",
                                            },
                                          ]}
                                        >
                                          <TextArea
                                            autoSize={{ minRows: 3 }}
                                            placeholder="例：3才～12才"
                                            allowClear
                                          />
                                        </Form.Item> */}
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
																	{COMMONS.PAGE_ADMIN_LIST_EVENTS}メッセージ追加
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
												categoryForm.setFieldsValue({
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
											currentCategory
												? updateCategoryMutation.isLoading
												: createCategoryMutation.isLoading
										}
									>
										{currentCategory ? '保存する' : '作成する'}
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

export default CategoryModal
