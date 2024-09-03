import { Button, Form, Input, message, Modal, Radio, Select } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { NumericInputComponent, TapAnimationComponent, ManualOccurrenceComponent } from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { AxiosError } from 'axios'

const { TextArea } = Input
const { Option } = Select

const CustomRadio = styled(Radio)`
	& {
		width: 100%;
	}

	.ant-radio {
		margin-left: 0.25rem;
	}

	.ant-radio + span {
		width: 100%;
		padding: 4px;
	}
`

const ManualModal = (props) => {
	const {
		publicSettings,
		occurrences,
		isRegistrationManualModalVisible,
		hideRegistrationManualModal,
		isSettingTime,
		endRegistration,
		startRegistration,
		isCampaign
	} = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [registrationManualForm] = Form.useForm()

	const [occurrencesDates, setOccurrencesDates] = useState([])
	const [groupedOccurrences, setGroupedOccurrences] = useState([])
	const [selectedOccurrence, setSelectedOccurrence] = useState(undefined)

	const registrationManualMutation = useMutation(API.ADMIN_CREATE_REGISTRATION_MANUAL, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
				})
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL]
				})
				hideRegistrationManualModal()
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				message.warning(COMMONS.ERROR_EMAIL_UNIQUE_MSG)
			} else if (error?.response?.status === COMMONS.RESPONSE_NOT_ACCEPTABLE_ERROR) {
				message.warning(COMMONS.WARN_RESERVATION_PAST_MSG)
			} else if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
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
	const registrationCampaignManualMutation = useMutation(API.ADMIN_CREATE_REGISTRATION_CAMPAIGN_MANUAL, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_CREATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
				})
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL]
				})
				hideRegistrationManualModal()
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				message.warning(COMMONS.ERROR_EMAIL_UNIQUE_MSG)
			} else if (error?.response?.status === COMMONS.RESPONSE_NOT_ACCEPTABLE_ERROR) {
				message.warning(COMMONS.WARN_RESERVATION_PAST_MSG)
			} else if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
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
		if (!isRegistrationManualModalVisible) {
			setSelectedOccurrence(undefined)
			setGroupedOccurrences([])
			setOccurrencesDates([])

			registrationManualForm.resetFields()
		}
	}, [isRegistrationManualModalVisible, registrationManualForm])

	useEffect(() => {
		if (occurrences) {
			if (isSettingTime || isCampaign) {
				const startAt = moment(startRegistration).format('YYYY-MM-DD')
				const endAt = moment(endRegistration).format('YYYY-MM-DD')
				const groups = occurrences
					.filter((o) => moment(isCampaign ? endRegistration : o?.startDate).isAfter(moment()))
					.reduce((groups, occurrence) => {
						if (!groups[`${startAt}~${endAt}`]) {
							groups[`${startAt}~${endAt}`] = []
						}

						groups[`${startAt}~${endAt}`].push(occurrence)

						return groups
					}, {})

				const groupArrays = Object.keys(groups).map((date) => {
					return {
						date,
						occurrences: groups[date]
					}
				})

				setOccurrencesDates(groupArrays.map((ga) => ga?.date))
				setGroupedOccurrences(groupArrays)
			} else {
				const groups = occurrences
					.filter((o) => moment(o?.startAt).isAfter())
					.reduce((groups, occurrence) => {
						if (!groups[moment(occurrence?.startAt).format('YYYY-MM-DD')]) {
							groups[moment(occurrence?.startAt).format('YYYY-MM-DD')] = []
						}

						groups[moment(occurrence?.startAt).format('YYYY-MM-DD')].push(occurrence)

						return groups
					}, {})

				const groupArrays = Object.keys(groups).map((date) => {
					return {
						date,
						occurrences: groups[date]
					}
				})

				setOccurrencesDates(groupArrays.map((ga) => ga?.date))
				setGroupedOccurrences(groupArrays)
			}
		} else {
			setSelectedOccurrence(undefined)
			setGroupedOccurrences([])
			setOccurrencesDates([])
		}
	}, [occurrences, isRegistrationManualModalVisible])

	const handleRegistrationManual = (data) => {
		const paramData = {
			occurrenceId: selectedOccurrence,
			lastName: data.lastName,
			firstName: data.firstName,
			lastNameKana: data.lastNameKana,
			firstNameKana: data.firstNameKana,
			telephone: data.telephone,
			email: data?.email,
			postalCode: data?.postalCode,
			address: data?.address,
			building: data?.building,
			message: data?.memo
		}

		if (isCampaign) {
			registrationCampaignManualMutation.mutate(paramData)
		} else {
			registrationManualMutation.mutate(paramData)
		}
	}

	const postalSearchHandler = () => {
		const postalCode = registrationManualForm.getFieldValue('postalCode')

		if (postalCode.length === 7) {
			API.GET_ADDRESS_BY_POSTAL_CODE(postalCode).then((text) => {
				const matcher = text.match(/({".*"]})/)

				if (matcher) {
					const json = JSON.parse(matcher[0])
					const address = json[postalCode]
					if (address && address[0] && address[1]) {
						const index = address[0] - 1

						registrationManualForm.setFieldValue(
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

	const clearSelectedOccurrences = () => {
		setSelectedOccurrence(undefined)
		registrationManualForm.setFieldValue('occurrences', [])
	}

	return (
		<>
			<Modal
				open={isRegistrationManualModalVisible}
				onCancel={hideRegistrationManualModal}
				title={isCampaign ? '手作業での応募' : '手作業での予約'}
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
							form={registrationManualForm}
							onFinish={handleRegistrationManual}
							layout="vertical"
							size="large"
							requiredMark={false}
							colon={false}
							scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
							initialValues={{
								date: undefined,
								occurrences: [],
								lastName: undefined,
								firstName: undefined,
								lastNameKana: undefined,
								firstNameKana: undefined,
								telephone: undefined,
								email: undefined,
								postalCode: undefined,
								address: undefined,
								building: undefined,
								message: undefined
							}}
						>
							<p
								className="px-4 py-2 text-lg text-center font-bold mb-4 rounded"
								style={{
									backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
									color: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{isCampaign ? '応募日' : '予約日'}
							</p>
							<Form.Item
								name="date"
								rules={[
									{
										required: true,
										message: isCampaign ? '応募日を選択してください' : '予約日を選択してください'
									}
								]}
							>
								<Select
									placeholder={isCampaign ? '応募日を選択してください' : '予約日を選択してください'}
									onChange={(e) => {
										clearSelectedOccurrences()
									}}
								>
									{occurrencesDates.map((date) => (
										<Option
											key={date}
											value={date}
											style={{
												textAlign: 'center'
											}}
										>
											{date}
										</Option>
									))}
								</Select>
							</Form.Item>
							<p
								className="px-4 py-2 text-lg text-center font-bold mb-4 rounded"
								style={{
									backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
									color: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{isCampaign ? '応募時間' : '予約時間'}
							</p>
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) => {
									return prevValues.date !== currentValues.date
								}}
							>
								{({ getFieldValue }) =>
									getFieldValue('date') ? (
										<Form.Item
											name="occurrences"
											rules={[
												{
													required: true,
													message: '時間を選択してください'
												}
											]}
										>
											<Radio.Group
												className="w-full"
												onChange={(e) => {
													setSelectedOccurrence(e?.target?.value)
												}}
											>
												{groupedOccurrences.find((go) => go?.date === getFieldValue('date'))
													?.occurrences ? (
													groupedOccurrences
														.find((go) => go?.date === getFieldValue('date'))
														.occurrences.map((occurrence, i) => (
															<div
																key={occurrence?.occurrenceId}
																className={`inline-block mb-2 rounded border ${
																	i % 2 === 0 ? 'mr-2' : ''
																}`}
																style={
																	selectedOccurrence === occurrence?.occurrenceId
																		? {
																				borderColor:
																					publicSettings?.PRIMARY_COLOR
																						.valueString,
																				backgroundColor:
																					publicSettings?.PRIMARY_LIGHT_COLOR
																						.valueString,
																				width: 'calc(50% - 0.25rem)'
																		  }
																		: {
																				borderColor: COMMONS.CUSTOM_GRAY_COLOR,
																				backgroundColor: COMMONS.WHITE_COLOR,
																				width: 'calc(50% - 0.25rem)'
																		  }
																}
															>
																<CustomRadio
																	key={occurrence?.occurrenceId}
																	value={occurrence?.occurrenceId}
																>
																	<ManualOccurrenceComponent
																		{...props}
																		isCampaign={isCampaign}
																		key={occurrence?.occurrenceId}
																		occurrence={occurrence}
																		status={
																			COMMONS.GET_LEFT_SLOTS(
																				occurrence?.maxAttendee || 0,
																				occurrence?.sumExpected || 0
																			) > COMMONS.OCCURRENCE_WARN_COUNT
																				? COMMONS.OCCURRENCE_STATUS_AVAILABLE
																				: COMMONS.GET_LEFT_SLOTS(
																						occurrence?.maxAttendee || 0,
																						occurrence?.sumExpected || 0
																				  ) <= 0
																				? COMMONS.OCCURRENCE_STATUS_FULL
																				: COMMONS.OCCURRENCE_STATUS_ALMOST_FULL
																		}
																	/>
																</CustomRadio>
															</div>
														))
												) : (
													<p className="text-center my-4">
														{isCampaign
															? '応募時間がありません。'
															: '予約時間がありません。'}
													</p>
												)}
											</Radio.Group>
										</Form.Item>
									) : (
										<p className="text-center my-4">
											{isCampaign ? '応募日を選択してください' : '予約日を選択してください'}
										</p>
									)
								}
							</Form.Item>
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
									className="px-4 py-2 text-lg text-center font-bold mb-4 rounded"
									style={{
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										color: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									メッセージ
								</p>
								<div>
									<Form.Item name="memo">
										<TextArea
											autoSize
											placeholder="追記事項やご質問がございましたら、ご入力ください。"
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
											loading={registrationManualMutation.isLoading}
										>
											この内容で登録する
										</Button>
									</TapAnimationComponent>
								</div>
								<div className="flex justify-center mt-4">
									<TapAnimationComponent>
										<Button className="w-32" size="large" onClick={hideRegistrationManualModal}>
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

export default ManualModal
