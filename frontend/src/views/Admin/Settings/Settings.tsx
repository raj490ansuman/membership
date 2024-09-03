import {
	CameraOutlined,
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	OrderedListOutlined,
	PlusOutlined,
	SaveOutlined
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Col, Descriptions, Form, Input, InputNumber, Modal, Row, Upload, message } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import {
	BaseAnimationComponent,
	CancellationModalComponent,
	PageHeaderComponent,
	QuestionModalComponent,
	QuestionOrderModalComponent,
	ReservationLimitModalComponent,
	TapAnimationComponent
} from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { queries } from '@/queries'

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const { TextArea } = Input

const Settings = (props: Props) => {
	const { auth } = props
	const navigate = useNavigate()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()

	const [systemColorForm] = Form.useForm()
	const [systemTitleForm] = Form.useForm()
	const [customMembershipForm] = Form.useForm()
	const [clientCategoriesScreenTitleForm] = Form.useForm()
	const [clientCategoriesScreenSubtitleForm] = Form.useForm()
	const [adminInitialReservableCountForm] = Form.useForm()
	const [reservationConfirmUrlForm] = Form.useForm()
	const [companyTelephoneForm] = Form.useForm()

	const layoutContext = useLayoutConfigContext()
	const { storePic, publicSettings } = layoutContext

	const [isCancellationModalVisible, setIsCancellationModalVisible] = useState(false)
	const [isReservationLimitModalVisible, setIsReservationLimitModalVisible] = useState(false)

	const [campaignQuestions, setCampaignQuestions] = useState([])
	const [currentQuestion, setCurrentQuestion] = useState(undefined)
	const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false)
	const [isQuestionOrderModalVisible, setIsQuestionOrderModalVisible] = useState(false)

	const [modal, contextHolder] = Modal.useModal()

	useQuery([API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS], () => API.ADMIN_GET_CAMPAIGN_QUESTIONS(), {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setCampaignQuestions(response?.data || [])
			}
		}
	})

	const storePicUploadMutation = useMutation(API.ADMIN_UPLOAD_STORE_PIC, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPLOAD_MSG)
			queryClient.invalidateQueries({ queryKey: queries.settings.storePic.queryKey })
		}
	})

	const publicSettingsUpdateMutation = useMutation(API.ADMIN_UPDATE_PUBLIC_SETTINGS, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			queryClient.invalidateQueries({
				queryKey: queries.settings.publicSettings.queryKey
			})
		}
	})

	const deleteCampaignQuestionMutation = useMutation(API.ADMIN_DELETE_CAMPAIGN_QUESTION, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS]
			})
		}
	})

	const updateRichmenuVisibilityMutation = useMutation(API.ADMIN_UPDATE_RICHMENU_VISIBILITY, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_RICHMENUS]
			})
		}
	})

	useEffect(() => {
		if (!auth) {
			navigate(COMMONS.PERMISSION_ERROR_ROUTE)
		}
	}, [auth, navigate])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_FAVICON, () => {
			queryClient.invalidateQueries({ queryKey: queries.settings.favicon.queryKey })
		})

		socket.on(API.SOCKET_LOGO, () => {
			queryClient.invalidateQueries({ queryKey: queries.settings.logo.queryKey })
		})

		socket.on(API.SOCKET_STORE_PIC, () => {
			queryClient.invalidateQueries({ queryKey: queries.settings.storePic.queryKey })
		})

		return () => {
			socket.off(API.SOCKET_FAVICON)
			socket.off(API.SOCKET_LOGO)
			socket.off(API.SOCKET_STORE_PIC)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	/**
	 * Even though we initialize forms with publicSettings placeholder data, we need to reset the forms in order
	 * to rerender and display the latest data.
	 */
	useEffect(() => {
		systemColorForm.resetFields()
		systemTitleForm.resetFields()
		customMembershipForm.resetFields()
		clientCategoriesScreenTitleForm.resetFields()
		clientCategoriesScreenSubtitleForm.resetFields()
		adminInitialReservableCountForm.resetFields()
		reservationConfirmUrlForm.resetFields()
		companyTelephoneForm.resetFields()
		// eslint-disable-next-line
	}, [publicSettings])

	const handleClientCategoriesScreenTitle = (data: FormData) => {
		const paramData = {
			key: API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_TITLE,
			label: API.SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_TITLE,
			isPublic: true,
			valueString: data.clientCategoriesScreenTitle
		}

		if (publicSettings?.CLIENT_CATEGORIES_SCREEN_TITLE.valueString !== data.clientCategoriesScreenTitle) {
			publicSettingsUpdateMutation.mutate(paramData)
		}
	}

	const handleClientCategoriesScreenSubtitle = (data: FormData) => {
		const paramData = {
			key: API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_SUBTITLE,
			label: API.SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_SUBTITLE,
			isPublic: true,
			valueString: data.clientCategoriesScreenSubtitle
		}

		if (publicSettings?.CLIENT_CATEGORIES_SCREEN_SUBTITLE.valueString !== data.clientCategoriesScreenSubtitle) {
			publicSettingsUpdateMutation.mutate(paramData)
		}
	}

	const handleAdminInitialReservableCount = (data: FormData) => {
		const paramData = {
			key: API.SETTINGS_KEY_ADMIN_INITIAL_RESERVABLE_COUNT,
			label: API.SETTINGS_LABEL_ADMIN_INITIAL_RESERVABLE_COUNT,
			isPublic: false,
			valueNumber: data.adminInitialReservableCount
		}

		if (publicSettings?.ADMIN_INITIAL_RESERVABLE_COUNT.valueNumber !== data.adminInitialReservableCount) {
			publicSettingsUpdateMutation.mutate(paramData)
		}
	}

	const handleReservationConfirmUrl = (data: FormData) => {
		const paramData = {
			key: API.SETTINGS_KEY_RESERVATION_CONFIRM_URL,
			label: API.SETTINGS_LABEL_RESERVATION_CONFIRM_URL,
			isPublic: false,
			valueString: data.reservationConfirmUrl
		}

		if (publicSettings?.RESERVATION_CONFIRM_URL.valueString !== data.reservationConfirmUrl) {
			publicSettingsUpdateMutation.mutate(paramData)
		}
	}

	const handleCompanyTelephone = (data: FormData) => {
		const paramData = {
			key: API.SETTINGS_KEY_COMPANY_TELEPHONE,
			label: API.SETTINGS_LABEL_COMPANY_TELEPHONE,
			isPublic: false,
			valueString: data.companyTelephone
		}

		if (publicSettings?.COMPANY_TELEPHONE.valueString !== data.companyTelephone) {
			publicSettingsUpdateMutation.mutate(paramData)
		}
	}

	const handleCampaignQuestionDelete = (question: { campaignQuestionId: number; contents: string }) => {
		const paramData = {
			questionId: question?.campaignQuestionId
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className="text-red-600" />,
			content: (
				<p>
					<span className="text-red-600">「{question?.contents || ''}」</span>
					を削除してもよろしいでしょうか？
				</p>
			),
			okText: '削除',
			okButtonProps: {
				size: 'large',
				type: 'primary',
				danger: true
			},
			cancelText: '閉じる',
			cancelButtonProps: {
				size: 'large'
			},
			centered: true,
			onOk() {
				deleteCampaignQuestionMutation.mutate(paramData)
			}
		})
	}

	const handleRichmenuVisibility = (rmType: string, isDisplayed: boolean) => {
		const paramData = {
			rmType: rmType,
			isDisplayed: isDisplayed
		}

		modal.confirm({
			title: '確認',
			content: (
				<p>
					<span style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}>
						「
						{rmType === 'defaultRM'
							? '登録前のリッチメニュー'
							: rmType === 'memberRM'
							? '登録後のリッチメニュー'
							: 'ー'}
						」
					</span>
					を
					<span
						style={{
							color: publicSettings?.PRIMARY_COLOR?.valueString
						}}
					>
						{isDisplayed ? '表示' : '非表示'}
					</span>
					してもよろしいでしょうか？
				</p>
			),
			okText: '確認',
			okType: 'primary',
			cancelText: '閉じる',
			centered: true,
			onOk() {
				updateRichmenuVisibilityMutation.mutate(paramData)
			}
		})
	}

	const showCancellationModal = () => {
		setIsCancellationModalVisible(true)
	}

	const hideCancellationModal = () => {
		setIsCancellationModalVisible(false)
	}

	const showQuestionModal = (question: any) => {
		setCurrentQuestion(question)
		setIsQuestionModalVisible(true)
	}

	const hideQuestionModal = () => {
		setCurrentQuestion(undefined)
		setIsQuestionModalVisible(false)
	}

	const showQuestionOrderModal = () => {
		setIsQuestionOrderModalVisible(true)
	}

	const hideQuestionOrderModal = () => {
		setIsQuestionOrderModalVisible(false)
	}

	const showReservationLimitModal = () => {
		setIsReservationLimitModalVisible(true)
	}

	const hideReservationLimitModal = () => {
		setIsReservationLimitModalVisible(false)
	}

	return (
		<>
			<BaseAnimationComponent>
				<PageHeaderComponent publicSettings={publicSettings} title="設定" />
				<Card bordered={false}>
					<Row gutter={[16, 16]}>
						{auth && auth.auth && auth.auth === COMMONS.AUTH_MASTER ? (
							<Col xs={24} hidden>
								<Card
									title="基本設定"
									bordered={true}
									type="inner"
									styles={{
										header: {
											color: publicSettings?.PRIMARY_COLOR?.valueString,
											backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
										}
									}}
									style={{
										borderColor: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									<MotionRowComponent
										gutter={[8, 8]}
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial="hidden"
										animate="show"
										exit="hidden"
									>
										<MotionColComponent
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={24}
											md={12}
											xl={8}
											className="text-center"
										>
											<Card
												title={`${COMMONS.DEFAULT_SYSTEM_TYPE}予約画面タイトル設定`}
												className="h-full"
											>
												<Form
													form={clientCategoriesScreenTitleForm}
													onFinish={handleClientCategoriesScreenTitle}
													layout="vertical"
													preserve={false}
													initialValues={{
														clientCategoriesScreenTitle:
															publicSettings?.CLIENT_CATEGORIES_SCREEN_TITLE
																.valueString || ''
													}}
													size="large"
												>
													<Row justify="center">
														<Col span={24}>
															<Form.Item
																name="clientCategoriesScreenTitle"
																rules={[
																	{
																		required: true,
																		message: '必須です'
																	},
																	{
																		whitespace: true,
																		message: '必須です'
																	}
																]}
															>
																<TextArea
																	autoSize={{ minRows: 3, maxRows: 6 }}
																	placeholder={`例：ご希望の${COMMONS.DEFAULT_SYSTEM_TYPE}をお選び下さい`}
																	allowClear
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row justify="center">
														<Col>
															<TapAnimationComponent>
																<Button
																	icon={<SaveOutlined />}
																	type="primary"
																	htmlType="submit"
																	loading={publicSettingsUpdateMutation.isLoading}
																>
																	設定する
																</Button>
															</TapAnimationComponent>
														</Col>
													</Row>
												</Form>
											</Card>
										</MotionColComponent>
										<MotionColComponent
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={24}
											md={12}
											xl={8}
											className="text-center"
										>
											<Card
												title={`${COMMONS.DEFAULT_SYSTEM_TYPE}予約画面サブタイトル設定`}
												className="h-full"
											>
												<Form
													form={clientCategoriesScreenSubtitleForm}
													onFinish={handleClientCategoriesScreenSubtitle}
													layout="vertical"
													preserve={false}
													initialValues={{
														clientCategoriesScreenSubtitle:
															publicSettings?.CLIENT_CATEGORIES_SCREEN_SUBTITLE
																.valueString || ''
													}}
													size="large"
												>
													<Row justify="center">
														<Col span={24}>
															<Form.Item
																name="clientCategoriesScreenSubtitle"
																rules={[
																	{
																		required: true,
																		message: '必須です'
																	},
																	{
																		whitespace: true,
																		message: '必須です'
																	}
																]}
															>
																<TextArea
																	autoSize={{ minRows: 3, maxRows: 6 }}
																	placeholder="例：※予約枠が埋まっていてもご相談ください"
																	allowClear
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row justify="center">
														<Col>
															<TapAnimationComponent>
																<Button
																	icon={<SaveOutlined />}
																	type="primary"
																	htmlType="submit"
																	loading={publicSettingsUpdateMutation.isLoading}
																>
																	設定する
																</Button>
															</TapAnimationComponent>
														</Col>
													</Row>
												</Form>
											</Card>
										</MotionColComponent>
										<MotionColComponent
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={24}
											md={12}
											xl={8}
											className="text-center"
										>
											<Card title="予約可能人数の初期値の設定" className="h-full">
												<Form
													form={adminInitialReservableCountForm}
													onFinish={handleAdminInitialReservableCount}
													layout="vertical"
													preserve={false}
													initialValues={{
														adminInitialReservableCount:
															publicSettings?.ADMIN_INITIAL_RESERVABLE_COUNT
																.valueNumber || 0
													}}
													size="large"
												>
													<Row justify="center">
														<Col span={24}>
															<Form.Item
																name="adminInitialReservableCount"
																rules={[
																	{
																		required: true,
																		message: '必須です'
																	}
																]}
															>
																<InputNumber
																	placeholder="例：10"
																	className="w-full"
																	addonAfter="人"
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row justify="center">
														<Col>
															<TapAnimationComponent>
																<Button
																	icon={<SaveOutlined />}
																	type="primary"
																	htmlType="submit"
																	loading={publicSettingsUpdateMutation.isLoading}
																>
																	設定する
																</Button>
															</TapAnimationComponent>
														</Col>
													</Row>
												</Form>
											</Card>
										</MotionColComponent>
										<MotionColComponent
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={24}
											md={12}
											xl={8}
											className="text-center"
										>
											<Card title="予約確認ボタン先の設定" className="h-full">
												<Form
													form={reservationConfirmUrlForm}
													onFinish={handleReservationConfirmUrl}
													layout="vertical"
													preserve={false}
													initialValues={{
														reservationConfirmUrl:
															publicSettings?.RESERVATION_CONFIRM_URL.valueString
													}}
													size="large"
												>
													<Row justify="center">
														<Col span={24}>
															<Form.Item
																name="reservationConfirmUrl"
																rules={[
																	{
																		required: true,
																		message: '必須です'
																	},
																	{
																		type: 'url',
																		message: '入力のURLが有効なURLではありません'
																	}
																]}
															>
																<Input
																	placeholder="例：https://liff.line.me/1657462809-gO2K0OpQ"
																	onPressEnter={(e: React.KeyboardEvent) =>
																		e.preventDefault()
																	}
																	allowClear
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row justify="center">
														<Col>
															<TapAnimationComponent>
																<Button
																	icon={<SaveOutlined />}
																	type="primary"
																	htmlType="submit"
																	loading={publicSettingsUpdateMutation.isLoading}
																>
																	設定する
																</Button>
															</TapAnimationComponent>
														</Col>
													</Row>
												</Form>
											</Card>
										</MotionColComponent>
										<MotionColComponent
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={24}
											md={12}
											xl={8}
											className="text-center"
										>
											<Card title="問い合わせ電話番号の設定" className="h-full">
												<Form
													form={companyTelephoneForm}
													onFinish={handleCompanyTelephone}
													layout="vertical"
													preserve={false}
													initialValues={{
														companyTelephone: publicSettings?.COMPANY_TELEPHONE.valueString
													}}
													size="large"
												>
													<Row justify="center">
														<Col span={24}>
															<Form.Item
																name="companyTelephone"
																rules={[
																	{
																		required: true,
																		message: '必須です'
																	}
																]}
															>
																<Input
																	placeholder="例：123-4567-8999"
																	onPressEnter={(e: React.KeyboardEvent) =>
																		e.preventDefault()
																	}
																	allowClear
																/>
															</Form.Item>
														</Col>
													</Row>
													<Row justify="center">
														<Col>
															<TapAnimationComponent>
																<Button
																	icon={<SaveOutlined />}
																	type="primary"
																	htmlType="submit"
																	loading={publicSettingsUpdateMutation.isLoading}
																>
																	設定する
																</Button>
															</TapAnimationComponent>
														</Col>
													</Row>
												</Form>
											</Card>
										</MotionColComponent>
										<MotionColComponent
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
											xs={24}
											md={12}
											xl={8}
											className="text-center"
										>
											<Card title="店舗画像設定" className="h-full">
												<TapAnimationComponent>
													<Upload
														accept=".jpg, .jpeg, .png, .svg"
														showUploadList={false}
														beforeUpload={() => {
															return false
														}}
														onChange={async (param: any) => {
															storePicUploadMutation.mutate(param.file)
														}}
													>
														{storePic ? (
															<img
																src={`${API.SETTINGS_UPLOADS_URL}${storePic}`}
																alt="店舗画像"
																style={{
																	maxHeight: '150px'
																}}
																className="max-w-full rounded object-contain cursor-pointer"
															/>
														) : (
															<div
																className="flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 rounded cursor-pointer"
																style={{
																	height: '150px',
																	width: '200px'
																}}
															>
																<p className="text-center text-2xl font-bold">
																	<CameraOutlined />
																</p>
															</div>
														)}
													</Upload>
												</TapAnimationComponent>
											</Card>
										</MotionColComponent>
									</MotionRowComponent>
								</Card>
							</Col>
						) : (
							''
						)}
						{auth && auth.auth && auth.auth === COMMONS.AUTH_MASTER ? (
							<Col xs={24} hidden>
								<Card
									title="予約時間制限設定"
									bordered={true}
									type="inner"
									styles={{
										header: {
											color: publicSettings?.PRIMARY_COLOR?.valueString,
											backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
										}
									}}
									style={{
										borderColor: publicSettings?.PRIMARY_COLOR?.valueString
									}}
									extra={
										<div className="flex">
											<TapAnimationComponent>
												<Button
													type="primary"
													size="large"
													icon={<EditOutlined />}
													onClick={showReservationLimitModal}
												>
													編集
												</Button>
											</TapAnimationComponent>
										</div>
									}
								>
									<motion.div
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial="hidden"
										animate="show"
										exit="hidden"
									>
										<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
											<Descriptions column={{ xs: 1, sm: 2 }} bordered layout="vertical">
												<Descriptions.Item label="予約時間制限">
													{publicSettings?.RESERVATION_LIMIT_ENABLED.valueFlag
														? '制限された'
														: '無制限'}
												</Descriptions.Item>
												<Descriptions.Item label="予約可能期間">
													{publicSettings?.RESERVATION_LIMIT_ENABLED.valueFlag
														? `開始時間より${
																publicSettings?.RESERVATION_LIMIT_DAY.valueNumber
														  }日前${moment(
																`${publicSettings?.RESERVATION_LIMIT_HOUR.valueNumber}:${publicSettings?.RESERVATION_LIMIT_MINUTE.valueNumber}`,
																'HH:mm'
														  ).format('HH[時]mm[分]')}までに予約可能`
														: '開始前にいつでも予約可能'}
												</Descriptions.Item>
											</Descriptions>
										</motion.div>
									</motion.div>
								</Card>
							</Col>
						) : (
							''
						)}
						{auth && auth.auth && auth.auth === COMMONS.AUTH_MASTER ? (
							<Col xs={24} hidden>
								<Card
									title="予約キャンセル設定"
									bordered={true}
									type="inner"
									styles={{
										header: {
											color: publicSettings?.PRIMARY_COLOR?.valueString,
											backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
										}
									}}
									style={{
										borderColor: publicSettings?.PRIMARY_COLOR?.valueString
									}}
									extra={
										<div className="flex">
											<TapAnimationComponent>
												<Button
													type="primary"
													size="large"
													icon={<EditOutlined />}
													onClick={showCancellationModal}
												>
													編集
												</Button>
											</TapAnimationComponent>
										</div>
									}
								>
									<motion.div
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial="hidden"
										animate="show"
										exit="hidden"
									>
										<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
											<Descriptions column={{ xs: 1, sm: 2 }} bordered layout="vertical">
												<Descriptions.Item label="予約キャンセル可能">
													{publicSettings?.CANCEL_ALLOWED.valueFlag ? '可能' : '不可能'}
												</Descriptions.Item>
												<Descriptions.Item label="予約キャンセル期間">
													{publicSettings?.CANCEL_ALLOWED.valueFlag
														? `予約より${
																publicSettings?.CANCEL_LIMIT_DAY.valueNumber
														  }日前${moment(
																`${publicSettings?.CANCEL_LIMIT_HOUR.valueNumber}:${publicSettings?.CANCEL_LIMIT_MINUTE.valueNumber}`,
																'HH:mm'
														  ).format('HH[時]mm[分]')}までにキャンセル可能`
														: 'ー'}
												</Descriptions.Item>
												<Descriptions.Item label="キャンセルに関する説明文">
													<p className="whitespace-pre-wrap">
														{publicSettings?.CANCEL_TEXT.valueString || 'ー'}
													</p>
												</Descriptions.Item>
											</Descriptions>
										</motion.div>
									</motion.div>
								</Card>
							</Col>
						) : (
							''
						)}
						{auth && auth.auth && auth.auth === COMMONS.AUTH_MASTER ? (
							<Col xs={24} hidden>
								<Card
									title="キャンペーンフォーム設定"
									bordered={true}
									type="inner"
									styles={{
										header: {
											color: publicSettings?.PRIMARY_COLOR?.valueString,
											backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
										}
									}}
									style={{
										borderColor: publicSettings?.PRIMARY_COLOR?.valueString
									}}
									extra={
										<div className="flex">
											<div className="mr-2">
												<TapAnimationComponent>
													<Button
														type="primary"
														size="large"
														icon={<PlusOutlined />}
														onClick={showQuestionModal}
													>
														質問追加
													</Button>
												</TapAnimationComponent>
											</div>
											<div>
												<TapAnimationComponent>
													<Button
														type="primary"
														size="large"
														icon={<OrderedListOutlined />}
														onClick={showQuestionOrderModal}
													>
														質問表示順
													</Button>
												</TapAnimationComponent>
											</div>
										</div>
									}
								>
									<motion.div
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial="hidden"
										animate="show"
										exit="hidden"
									>
										<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
											<Descriptions
												column={1}
												bordered
												size="small"
												labelStyle={{ width: '250px' }}
											>
												{campaignQuestions && campaignQuestions.length > 0 ? (
													campaignQuestions.map(
														(question: {
															campaignChoices: any
															campaignQuestionId: number
															contents: string
														}) => (
															<Descriptions.Item
																key={question?.campaignQuestionId}
																className="whitespace-pre-wrap"
																label={question?.contents || ''}
															>
																<div className="flex flex-col">
																	<div className="flex justify-end mb-2">
																		<TapAnimationComponent>
																			<Button
																				icon={<EditOutlined />}
																				onClick={() => {
																					showQuestionModal(question)
																				}}
																			>
																				編集
																			</Button>
																		</TapAnimationComponent>
																		<TapAnimationComponent className="ml-1">
																			<Button
																				danger
																				icon={<DeleteOutlined />}
																				onClick={() => {
																					handleCampaignQuestionDelete(
																						question
																					)
																				}}
																			>
																				削除
																			</Button>
																		</TapAnimationComponent>
																	</div>
																	<div className="flex flex-col">
																		{question?.campaignChoices &&
																		question?.campaignChoices?.length > 0 ? (
																			question.campaignChoices.map(
																				(choice: any, i: number) => (
																					<p
																						key={choice?.campaignChoiceId}
																						className="whitespace-pre-wrap break-all"
																					>
																						{`${i + 1}）${
																							choice?.contents || ''
																						}`}
																					</p>
																				)
																			)
																		) : (
																			<p>質問の選択肢がありません。</p>
																		)}
																	</div>
																</div>
															</Descriptions.Item>
														)
													)
												) : (
													<Descriptions.Item
														className="whitespace-pre-wrap"
														label="質問がありません。"
													>
														<p>質問の選択肢がありません。</p>
													</Descriptions.Item>
												)}
											</Descriptions>
										</motion.div>
									</motion.div>
								</Card>
							</Col>
						) : (
							''
						)}
					</Row>
				</Card>
			</BaseAnimationComponent>
			<CancellationModalComponent
				{...props}
				isCancellationModalVisible={isCancellationModalVisible}
				hideCancellationModal={hideCancellationModal}
			/>
			<ReservationLimitModalComponent
				{...props}
				isReservationLimitModalVisible={isReservationLimitModalVisible}
				hideReservationLimitModal={hideReservationLimitModal}
			/>
			<QuestionModalComponent
				{...props}
				isQuestionModalVisible={isQuestionModalVisible}
				hideQuestionModal={hideQuestionModal}
				currentQuestion={currentQuestion}
			/>
			<QuestionOrderModalComponent
				{...props}
				isQuestionOrderModalVisible={isQuestionOrderModalVisible}
				hideQuestionOrderModal={hideQuestionOrderModal}
			/>
			{contextHolder}
		</>
	)
}

export default Settings
