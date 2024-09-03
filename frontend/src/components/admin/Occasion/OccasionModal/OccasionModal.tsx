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

const OccasionModal = (props) => {
	const { isOccasionModalVisible, hideOccasionModal, currentOccasion, currentCategory } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [occasionForm] = Form.useForm()
	const [occasionImages, setOccasionImages] = useState([])
	const [templates, setTemplates] = useState([])
	const [currentTemplateOccasion, setCurrentTemplateOccasion] = useState(undefined)
	const [isSettingTime, setIsSettingTime] = useState(false)

	const [numberPeople, setNumberPeople] = useState(0)
	const [startDate, setStartDate] = useState()
	const [startRegistration, setStartRegistration] = useState()
	const [isMultiEvent, setIsMultiEvent] = useState(false)
	const [numberOfPeople, setNumberOfPeople] = useState()
	useQuery([API.QUERY_KEY_ADMIN_OCCASION_TEMPLATES], () => API.ADMIN_GET_OCCASION_TEMPLATES(), {
		enabled: isOccasionModalVisible,
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
		[API.QUERY_KEY_ADMIN_OCCASION_TEMPLATE_DETAIL, currentTemplateOccasion],
		() => API.ADMIN_GET_OCCASION_TEMPLATE_DETAIL(currentTemplateOccasion),
		{
			enabled: isOccasionModalVisible && !!currentTemplateOccasion,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (response?.data) {
						setOccasionImages([])

						setIsSettingTime(response?.data?.isSettingTime)
						setIsMultiEvent(response?.data?.isMultiEvent)
						setNumberOfPeople(response?.data?.numberOfPeople)
						setStartRegistration(moment(response?.data.startRegistration))
						setStartDate(moment(response?.data?.startDate))

						handleNumberPeople(
							response?.data?.numberOfPeople,
							response?.data?.startDate,
							response?.data?.endDate
						)

						if (
							response?.data?.message &&
							Array.isArray(JSON.parse(response?.data?.message)) &&
							currentCategory?.categoryMessages.length > 0
						) {
							JSON.parse(response?.data?.message).forEach((item) => {
								const index = currentCategory?.categoryMessages.findIndex((i) => i.label === item)
								occasionForm.setFieldValue(`label${index}`, true)
							})
						}

						occasionForm.setFieldsValue({
							isDisplayed:
								response?.data?.isDisplayed !== undefined ? response?.data.isDisplayed + '' : undefined,
							title: response?.data?.title,
							occasionImages: [{}],
							description: response?.data?.description,
							occasionDetails: response?.data?.occasionDetails || [],
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

	const createOccasionMutation = useMutation(API.ADMIN_CREATE_OCCASION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASIONS]
				})
				hideOccasionModal()
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

	const updateOccasionMutation = useMutation(API.ADMIN_UPDATE_OCCASION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASIONS]
				})
				hideOccasionModal()
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
		if (!isOccasionModalVisible) {
			occasionForm.resetFields()
			setOccasionImages([])
			setTemplates([])
			setCurrentTemplateOccasion(undefined)
		}
	}, [isOccasionModalVisible, occasionForm])
	useEffect(() => {
		if (isOccasionModalVisible && currentOccasion) {
			setOccasionImages(currentOccasion?.occasionImages || [])
			setIsSettingTime(currentOccasion?.isSettingTime)
			setIsMultiEvent(currentOccasion?.isMultiEvent)
			setNumberOfPeople(currentOccasion?.numberOfPeople)
			setStartRegistration(moment(currentOccasion.startRegistration))
			setStartDate(moment(currentOccasion?.startDate))

			if (
				currentOccasion?.message &&
				Array.isArray(JSON.parse(currentOccasion?.message)) &&
				currentCategory?.categoryMessages.length > 0
			) {
				JSON.parse(currentOccasion?.message).forEach((item) => {
					const index = currentCategory?.categoryMessages.findIndex((i) => i.label === item)
					occasionForm.setFieldValue(`label${index}`, true)
				})
			}

			handleNumberPeople(currentOccasion?.numberOfPeople, currentOccasion?.startDate, currentOccasion?.endDate)

			occasionForm.setFieldsValue({
				isDisplayed: currentOccasion?.isDisplayed !== undefined ? currentOccasion.isDisplayed + '' : undefined,
				title: currentOccasion?.title,
				occasionImages: currentOccasion?.occasionImages
					? currentOccasion.occasionImages.map((image) => {
							return { image: image?.picUrl }
					  })
					: [{}],
				description: currentOccasion?.description,
				occasionDetails: currentOccasion?.occasionDetails || [],

				isSettingTime: currentOccasion?.isSettingTime,
				...(currentOccasion?.isSettingTime
					? {
							startRegistration: moment(currentOccasion?.startRegistration),
							endRegistration: moment(currentOccasion?.endRegistration),
							startDate: moment(currentOccasion?.startDate),
							endDate: moment(currentOccasion?.endDate),
							numberOfPeople: currentOccasion?.numberOfPeople
					  }
					: {
							notRegisterEventSameTime: currentOccasion?.notRegisterEventSameTime
					  }),
				isMultiEvent: currentOccasion?.isMultiEvent
			})
		}

		// eslint-disable-next-line
	}, [isOccasionModalVisible, currentOccasion])

	const handleOccasion = (data) => {
		const formData = new FormData()
		let notes
		if (currentCategory?.categoryMessages) {
			notes = currentCategory?.categoryMessages
				?.filter((_, index) => data[`label${index}`])
				.map((item) => item.label)
		}

		formData.append('message', notes ? JSON.stringify(notes) : [])

		formData.append('isDisplayed', data?.isDisplayed + '')
		formData.append('title', data?.title || '')
		formData.append('description', data?.description || '')

		if (data?.isSettingTime) {
			formData.append('startRegistration', moment(data?.startRegistration).toISOString())
			formData.append('endRegistration', moment(data?.endRegistration).toISOString())
			formData.append('startDate', moment(data?.startDate).toISOString())
			formData.append('endDate', moment(data?.endDate).toISOString())
			formData.append('numberOfPeople', Number(data?.numberOfPeople))
			formData.append('isSendImage', data?.isSendImage || false)
		} else {
			if (data?.isMultiEvent) {
				formData.append('notRegisterEventSameTime', data?.notRegisterEventSameTime || false)
			}
		}

		formData.append('isMultiEvent', data?.isMultiEvent || false)
		formData.append('isSettingTime', data?.isSettingTime || false)

		if (data?.occasionDetails && data?.occasionDetails?.length > 0) {
			formData.append(
				'occasionDetails',
				JSON.stringify(data.occasionDetails.map((od, i) => ({ ...od, showOrder: i })))
			)
		} else {
			formData.append('occasionDetails', '')
		}

		if (occasionImages && occasionImages.length > 0) {
			formData.append(
				'occasionImagesData',
				JSON.stringify(
					occasionImages.map((image, i) => ({
						originalName: image?.file?.name || image?.picUrl,
						showOrder: i
					}))
				)
			)

			occasionImages
				.filter((image) => image?.file)
				.map((image) => image?.file)
				.forEach((imageData) => {
					formData.append('occasionImages', imageData)
				})
		} else {
			formData.append('occasionImages', '')
			formData.append('occasionImagesData', '')
		}

		let paramData = {
			formData: formData
		}

		if (currentOccasion) {
			paramData.occasionId = currentOccasion?.occasionId

			updateOccasionMutation.mutate(paramData)
		} else {
			formData.append('categoryId', currentCategory?.categoryId)

			createOccasionMutation.mutate(paramData)
		}
	}

	const handleTemplateChange = (occasionId) => {
		setCurrentTemplateOccasion(occasionId)
	}

	const occasionImagesOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const orderedOccasionImages = COMMONS.RE_ORDER(
				occasionForm.getFieldValue('occasionImages'),
				result.source.index,
				result.destination.index
			)

			const orderedOccasionImageFiles = COMMONS.RE_ORDER(
				occasionImages,
				result.source.index,
				result.destination.index
			)

			occasionForm.setFieldsValue({
				occasionImages: orderedOccasionImages
			})

			setOccasionImages(orderedOccasionImageFiles)
		}
	}

	const occasionDetailsOnDragEndHandle = (result) => {
		if (!result.destination) {
			return
		} else {
			const orderedOccasionDetails = COMMONS.RE_ORDER(
				occasionForm.getFieldValue('occasionDetails'),
				result.source.index,
				result.destination.index
			)

			occasionForm.setFieldsValue({
				occasionDetails: orderedOccasionDetails
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
				open={isOccasionModalVisible}
				onCancel={hideOccasionModal}
				title={
					currentOccasion
						? `${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム編集`
						: `新規${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム`
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
						form={occasionForm}
						layout="vertical"
						initialValues={{
							isDisplayed: 'true',
							occasionImages: [{}],
							occasionDetails: [{}]
						}}
						onFinish={handleOccasion}
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
										<Option key={template?.occasionId} value={template?.occasionId}>
											{(template?.title || 'ー') + 'のテンプレート'}
										</Option>
									))}
								</Select>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Flex gap={10} align="center">
									期間型イベント設定
									<FormItem name="isSettingTime" valuePropName="checked">
										<Switch
											disabled={currentOccasion}
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
														occasionForm.resetFields(['endRegistration'])
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
																				moment(startRegistration).format('HH')
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
														currentOccasion &&
														moment().isAfter(currentOccasion?.startRegistration)
															? true
															: false
													}
													locale={jaJP}
													format="YYYY-MM-DD HH:mm"
													showTime={{
														defaultValue: moment('00:00:00', 'HH:mm')
													}}
													onChange={(value) => {
														setNumberPeople(occasionForm.getFieldValue('numberOfPeople'))
														setStartDate(value)
														occasionForm.resetFields(['endDate'])
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
														currentOccasion &&
														moment().isAfter(currentOccasion?.startRegistration)
															? true
															: false
													}
													format="YYYY-MM-DD HH:mm"
													showTime={{
														defaultValue: moment('00:00:00', 'HH:mm')
													}}
													onChange={(value) => {
														handleNumberPeople(
															occasionForm.getFieldValue('numberOfPeople'),
															occasionForm.getFieldValue('startDate'),
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
																			i < Number(moment(startDate).format('HH'))
																	),
																disabledMinutes: () =>
																	Array.from({ length: 60 }, (_, i) => i).filter(
																		(i) =>
																			i <= Number(moment(startDate).format('mm'))
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
																	occasionForm.getFieldValue('startDate'),
																	occasionForm.getFieldValue('endDate')
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

							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item
									name="isDisplayed"
									label="表示状態"
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
											<span className="font-bold">{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム名`}</span>
											<span className="custom-required-decoration">必須</span>
										</p>
									}
									rules={[
										{
											required: true,
											message: `${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム名は必須です`
										}
									]}
								>
									<Input
										placeholder={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム名を入力してください`}
										allowClear
									/>
								</Form.Item>
							</motion.div>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<p>
									<span className="font-bold">{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}</span>
									<span className="custom-required-decoration">必須</span>
								</p>
								<p className="text-xs text-gray-400 mb-4 mt-2">
									※項目をドラッグして表示順を自由に調整できます
								</p>
								<div>
									<Form.List name="occasionImages">
										{(fields, { add, remove }) => (
											<DragDropContext onDragEnd={occasionImagesOnDragEndHandle}>
												<Droppable droppableId="droppableOccasionImage" direction="vertical">
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
																						<span>{`${
																							COMMONS.DEFAULT_SYSTEM_TYPE
																						}プログラム画像（${
																							index + 1
																						}）`}</span>
																						<span
																							className="custom-required-decoration"
																							style={{ marginLeft: 0 }}
																						>
																							必須
																						</span>
																					</p>
																				}
																				valuePropName="file"
																				className="mb-0 text-center"
																				rules={[
																					{
																						required: true,
																						message: `${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像をアップロードしてください`
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

																							if (occasionImages[index]) {
																								setOccasionImages(
																									occasionImages.map(
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
																									...occasionImages
																								]
																								duplicateArray[index] =
																									{
																										file: _file,
																										preview:
																											_preview
																									}

																								setOccasionImages(
																									duplicateArray
																								)
																							}
																						}}
																					>
																						<TapAnimationComponent>
																							{occasionImages[index] &&
																							(occasionImages[index]
																								?.preview ||
																								occasionImages[index]
																									?.picUrl) ? (
																								<div className="flex justify-center">
																									<Image
																										preview={false}
																										src={
																											occasionImages[
																												index
																											]
																												?.preview ||
																											`${API.OCCASIONS_UPLOADS_URL}${occasionImages[index]?.picUrl}`
																										}
																										alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
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
																							setOccasionImages(
																								occasionImages.filter(
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
																	{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像追加`}
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
								<p className="font-bold">{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム概要`}</p>
								<p className="text-xs text-gray-400 mb-4 mt-2">
									※項目をドラッグして表示順を自由に調整できます
								</p>
								<div>
									<Form.List name="occasionDetails">
										{(fields, { add, remove }) => (
											<DragDropContext onDragEnd={occasionDetailsOnDragEndHandle}>
												<Droppable droppableId="droppableOccasionDetail" direction="vertical">
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
																				}プログラム概要（${index + 1}）`}
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
																	{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム概要追加`}
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
								<p className="font-bold">イベントプログラムメッセージ</p>
								{!currentOccasion
									? currentCategory?.categoryMessages?.map((item, index) => (
											<FormItem
												key={item?.showOrder}
												name={`label${index}`}
												valuePropName="checked"
											>
												<Checkbox>{item?.label}</Checkbox>
											</FormItem>
									  ))
									: currentCategory?.categoryMessages?.map((item, index) => (
											<FormItem
												key={item?.showOrder}
												name={`label${index}`}
												valuePropName="checked"
											>
												<Checkbox>{item?.label}</Checkbox>
											</FormItem>
									  ))}
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
											currentOccasion
												? updateOccasionMutation.isLoading
												: createOccasionMutation.isLoading
										}
									>
										{currentOccasion ? '保存する' : '作成する'}
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

export default OccasionModal
