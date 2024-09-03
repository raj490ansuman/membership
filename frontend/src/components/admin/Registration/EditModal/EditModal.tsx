import { Button, Form, Input, message, Modal } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { NumericInputComponent, TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

const { TextArea } = Input

const EditModal = (props) => {
	const { publicSettings, registration, occurrence, isRegistrationEditModalVisible, hideRegistrationEditModal } =
		props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [registrationEditForm] = Form.useForm()

	const registrationEditMutation = useMutation(API.ADMIN_UPDATE_REGISTRATION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
				})
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL]
				})
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCURRENCE_DETAIL]
				})
				hideRegistrationEditModal()
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
		if (isRegistrationEditModalVisible && registration) {
			registrationEditForm.setFieldsValue({
				lastName: registration?.Member?.lastName,
				firstName: registration?.Member?.firstName,
				lastNameKana: registration?.Member?.lastNameKana,
				firstNameKana: registration?.Member?.firstNameKana,
				telephone: registration?.Member?.telephone,
				email: registration?.Member?.email,
				postalCode: registration?.Member?.postalCode,
				address: registration?.Member?.address,
				building: registration?.Member?.building,
				message: registration?.message,
				remarks: registration?.remarks
			})
		}

		// eslint-disable-next-line
	}, [registration, isRegistrationEditModalVisible])

	const handleRegistrationEdit = (data) => {
		const paramData = {
			registrationId: registration?.registrationId,
			lastName: data.lastName,
			firstName: data.firstName,
			lastNameKana: data.lastNameKana,
			firstNameKana: data.firstNameKana,
			telephone: data.telephone,
			email: data?.email,
			postalCode: data?.postalCode,
			address: data?.address,
			building: data?.building,
			message: data?.message,
			remarks: data?.remarks
		}

		registrationEditMutation.mutate(paramData)
	}

	const postalSearchHandler = () => {
		const postalCode = registrationEditForm.getFieldValue('postalCode')

		if (postalCode.length === 7) {
			API.GET_ADDRESS_BY_POSTAL_CODE(postalCode).then((text) => {
				const matcher = text.match(/({".*"]})/)

				if (matcher) {
					const json = JSON.parse(matcher[0])
					const address = json[postalCode]
					if (address && address[0] && address[1]) {
						const index = address[0] - 1

						registrationEditForm.setFieldValue(
							'address',
							`${COMMONS.PREFECTURES[index]['label']}${address[1]}${address[2]}${
								address[3] ? address[3] : ''
							}`
						)
					} else {
						message.warning(COMMONS.WARN_POSTAL_CODE_WRONG_MSG)
					}
				}
			})
		}
	}

	return (
		<>
			<Modal
				open={isRegistrationEditModalVisible}
				onCancel={hideRegistrationEditModal}
				title="予約内容編集"
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
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="mb-8"
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Form
							form={registrationEditForm}
							onFinish={handleRegistrationEdit}
							layout="vertical"
							size="large"
							requiredMark={false}
							colon={false}
							scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
							initialValues={{
								lastName: undefined,
								firstName: undefined,
								lastNameKana: undefined,
								firstNameKana: undefined,
								telephone: undefined,
								email: undefined,
								postalCode: undefined,
								address: undefined,
								building: undefined,
								message: undefined,
								remarks: undefined
							}}
						>
							<p
								className="text-center bg-custom-light-yellow px-4 py-2 text-lg font-bold mb-4"
								style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
							>
								予約日
							</p>
							<p className="text-center text-lg font-bold px-4 mt-4 mb-8">
								{occurrence?.startAt ? moment(occurrence.startAt).format('YYYY年M月D日') : 'ー'}
							</p>
							<p
								className="text-center bg-custom-light-yellow px-4 py-2 text-lg font-bold mb-4"
								style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
							>
								予約時間
							</p>
							<p className="text-center px-4 mt-4 mb-8">
								<span
									className="inline-block rounded-full text-white px-2 font-bold"
									style={{
										backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									{occurrence?.startAt ? moment(occurrence.startAt).format('HH:mm') : 'ー'}～
									{occurrence?.endAt ? moment(occurrence.endAt).format('HH:mm') : 'ー'}
								</span>
							</p>
							<p
								className="px-4 py-2 text-lg text-center font-bold mb-4 rounded"
								style={{
									backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
									color: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								お客様情報
							</p>
							<div className="mb-8">
								<Form.Item required label="氏名（漢字）" className="mb-0">
									<Form.Item
										name="lastName"
										className="inline-block mr-2"
										style={{ width: 'calc(50% - 0.25rem)' }}
										rules={[
											{
												required: true,
												whitespace: true,
												message: '姓を入力してください'
											},
											{
												max: 50,
												message: '50文字未満である必要があります'
											}
										]}
									>
										<Input placeholder="例：山田" onPressEnter={(e) => e.preventDefault()} />
									</Form.Item>
									<Form.Item
										name="firstName"
										className="inline-block"
										style={{ width: 'calc(50% - 0.25rem)' }}
										rules={[
											{
												required: true,
												whitespace: true,
												message: '名を入力してください'
											},
											{
												max: 50,
												message: '50文字未満である必要があります'
											}
										]}
									>
										<Input placeholder="例：太郎" onPressEnter={(e) => e.preventDefault()} />
									</Form.Item>
								</Form.Item>
								<Form.Item required label="氏名（フリガナ）" className="mb-0">
									<Form.Item
										name="lastNameKana"
										className="inline-block mr-2"
										style={{ width: 'calc(50% - 0.25rem)' }}
										rules={[
											{
												required: true,
												whitespace: true,
												message: '姓を入力してください'
											},
											{
												max: 50,
												message: '50文字未満である必要があります'
											},
											{
												pattern: new RegExp('[\u30a0-\u30ff]'),
												message: '全角カタカナで入力してください'
											}
										]}
									>
										<Input placeholder="例：ヤマダ" onPressEnter={(e) => e.preventDefault()} />
									</Form.Item>
									<Form.Item
										name="firstNameKana"
										className="inline-block"
										style={{ width: 'calc(50% - 0.25rem)' }}
										rules={[
											{
												required: true,
												whitespace: true,
												message: '名を入力してください'
											},
											{
												max: 50,
												message: '50文字未満である必要があります'
											},
											{
												pattern: new RegExp('[\u30a0-\u30ff]'),
												message: '全角カタカナで入力してください'
											}
										]}
									>
										<Input placeholder="例：タロウ" onPressEnter={(e) => e.preventDefault()} />
									</Form.Item>
								</Form.Item>
								<Form.Item
									label="電話番号"
									name="telephone"
									rules={[
										{
											required: true,
											message: '電話番号を入力してください'
										},
										{
											max: 15,
											message: '電話番号は15数字未満である必要があります'
										}
									]}
								>
									<Input placeholder="例：080-0000-0000" allowClear />
								</Form.Item>
								<Form.Item
									label="メールアドレス"
									name="email"
									rules={[
										{
											type: 'email',
											message: '有効なメールアドレスを入力してください'
										}
									]}
								>
									<Input placeholder="例：yamada@pregio.co.jp" allowClear />
								</Form.Item>
								<Form.Item
									name="postalCode"
									label="郵便番号"
									rules={[
										{
											len: 7,
											message: ''
										}
									]}
								>
									<NumericInputComponent
										placeholder="例：5670000"
										maxLength={7}
										allowClear
										onPressEnter={(e) => {
											e.preventDefault()
											postalSearchHandler()
										}}
										onChange={(e) => {
											postalSearchHandler()
										}}
										pattern="[0-9]*"
										inputMode="numeric"
									/>
								</Form.Item>
								<Form.Item label="住所" className="mb-0">
									<Form.Item name="address">
										<TextArea placeholder="⼤阪市中央区南船場1-18-11" autoSize />
									</Form.Item>
									<Form.Item name="building">
										<TextArea placeholder="SRビル⻑堀12階" autoSize />
									</Form.Item>
								</Form.Item>
							</div>
							<div className="mb-8">
								<p
									className="bg-custom-light-yellow px-4 py-2 text-lg font-bold mb-4"
									style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
								>
									メッセージ
								</p>
								<div className="px-4">
									<Form.Item name="message">
										<TextArea
											autoSize
											placeholder="追記事項やご質問がございましたら、ご入力ください。"
										/>
									</Form.Item>
								</div>
							</div>
							<div className="mb-8">
								<p
									className="bg-custom-light-yellow px-4 py-2 text-lg font-bold mb-4"
									style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
								>
									管理者だけの備考
								</p>
								<div className="px-4">
									<Form.Item name="remarks">
										<TextArea
											autoSize
											placeholder="この予約に対して追記事項がございましたら、ご入力ください。"
										/>
									</Form.Item>
								</div>
							</div>
							<div className="flex flex-col mb-8 px-4">
								<div className="flex justify-center">
									<TapAnimationComponent>
										<Button
											type="primary"
											className="w-80 h-12"
											size="large"
											htmlType="submit"
											loading={registrationEditMutation.isLoading}
										>
											保存する
										</Button>
									</TapAnimationComponent>
								</div>
								<div className="flex justify-center mt-4">
									<TapAnimationComponent>
										<Button
											className="w-32"
											size="large"
											onClick={() => {
												hideRegistrationEditModal()
											}}
										>
											閉じる
										</Button>
									</TapAnimationComponent>
								</div>
							</div>
						</Form>
					</motion.div>
				</motion.div>
			</Modal>
		</>
	)
}

export default EditModal
