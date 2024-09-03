import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { Button, Form, Image, Input, message, Modal } from 'antd'
import { TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import { AxiosError } from 'axios'

const { TextArea } = Input

const StyleFormItem = styled(Form.Item)`
	.ant-form-item-label > label::after {
		visibility: visible !important;
	}
`

const ReservationMember = (props) => {
	const { publicSettings, logo, accessToken, category, occasion, occurrence } = props

	const { liffId, categoryId, occasionId } = useParams()
	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const [reservationForm] = Form.useForm()
	const { search } = useLocation()

	const searchParams = new URLSearchParams(search)

	// useQuery(
	//   [API.QUERY_KEY_CLIENT_MY_REGISTRATIONS, accessToken],
	//   () => API.CLIENT_GET_MY_REGISTRATIONS(accessToken),
	//   {
	//     enabled: !!accessToken,
	//     onSuccess: (response) => {
	//       if (isMountedRef.current) {
	//         if (response?.data?.length > 0) {
	//           // navigate
	//           navigate(`${COMMONS.CLIENT_REGISTRATIONS_ROUTE}/${liffId}`)
	//         }
	//       }
	//     },
	//     onError: (error: AxiosError) => {
	//       if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
	//         message.error({
	//           content: COMMONS.ERROR_SYSTEM_MSG,
	//           key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
	//         })
	//       } else {
	//         message.error({
	//           content: COMMONS.ERROR_SYSTEM_MSG,
	//           key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
	//         })
	//       }
	//     },
	//   }
	// )

	const reserveMutation = useMutation(API.CLIENT_RESERVE_OCCASION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				if (response?.data?.registrationId) {
					navigate(`${COMMONS.CLIENT_REGISTRATION_DETAIL_ROUTE}/${liffId}/${response.data.registrationId}`)
				} else {
					navigate(`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`)
				}

				window.scrollTo(0, 0)
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				Modal.warning({
					title: '時間帯が満員になりました。',
					content: COMMONS.WARN_RESERVATION_FULL_MSG,
					centered: true,
					okText: '確認',
					okButtonProps: {
						type: 'primary'
					}
				})
			} else if (error?.response?.status === COMMONS.RESPONSE_BAD_REQUEST_ERROR) {
				message.error({
					content: '時間の重複ですので、予約できません。',
					key: '時間の重複ですので、予約できません。'
				})
			} else if (error?.response?.status === COMMONS.RESPONSE_NOT_ACCEPTABLE_ERROR) {
				Modal.warning({
					title: 'この時間帯を予約することはできません。',
					content: COMMONS.WARN_RESERVATION_PAST_MSG,
					centered: true,
					okText: '確認',
					okButtonProps: {
						type: 'primary'
					}
				})
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

	const reservationHandler = (data) => {
		const isAvailable = COMMONS.GET_LEFT_SLOTS(occurrence?.maxAttendee || 0, occurrence?.maxExpected || 0) >= 1

		if (isAvailable) {
			const paramData = {
				occurrenceId: occurrence?.occurrenceId,
				message: data?.memo,
				note: category?.categoryMessages?.length > 0 || category?.isCampaign ? data : null,
				accessToken: accessToken
			}

			reserveMutation.mutate(paramData)
		} else {
			Modal.warning({
				title: '時間帯が満員になりました。',
				content: COMMONS.WARN_RESERVATION_FULL_MSG,
				centered: true,
				okText: '確認',
				okButtonProps: {
					type: 'primary'
				}
			})
		}
	}

	return (
		<motion.div
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="my-8"
		>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
				{logo ? (
					<Image
						preview={false}
						width={'100%'}
						style={{ maxHeight: '150px' }}
						className="w-full object-contain"
						src={`${API.SETTINGS_UPLOADS_URL}${logo}`}
						fallback="/no-image.png"
					/>
				) : (
					''
				)}
			</motion.div>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-4">
				<p
					className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
					style={{
						backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
						color: publicSettings?.PRIMARY_COLOR?.valueString
					}}
				>
					{`ご希望の${COMMONS.DEFAULT_SYSTEM_TYPE}・${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム`}
				</p>
				<p className="text-black text-center text-lg font-bold">{category?.title || ''}</p>
				{occasion?.title && <p className="text-center text-base font-bold">（{occasion.title}）</p>}
			</motion.div>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
				<p
					className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
					style={{
						backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
						color: publicSettings?.PRIMARY_COLOR?.valueString
					}}
				>
					ご希望の時間帯
				</p>
				<div className="text-center">
					{category?.isSettingTime ? (
						<p className="px-4 font-bold text-lg">
							{occurrence?.startDate ? moment(occurrence?.startDate).format('YYYY年M月D日（ddd）') : 'ー'}
						</p>
					) : (
						<p className="px-4 font-bold text-lg">
							{occurrence?.startAt ? moment(occurrence.startAt).format('YYYY年M月D日（ddd）') : 'ー'}
						</p>
					)}

					<p className="px-4 mt-2">
						{category?.isSettingTime ? (
							<span
								className="inline-block rounded-full text-white px-2 font-bold"
								style={{
									backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{`${category?.startDate ? moment(category?.startDate).format('HH:mm') : 'ー'}
                ～
                ${category?.endDate ? moment(category?.endDate).format('HH:mm') : 'ー'}`}
							</span>
						) : (
							<span
								className="inline-block rounded-full text-white px-2 font-bold"
								style={{
									backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{`${occurrence?.startAt ? moment(occurrence.startAt).format('HH:mm') : 'ー'}
                ～
                ${occurrence?.endAt ? moment(occurrence.endAt).format('HH:mm') : 'ー'}`}
							</span>
						)}
					</p>
				</div>
			</motion.div>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
				<Form
					form={reservationForm}
					onFinish={reservationHandler}
					size="large"
					layout="horizontal"
					requiredMark={false}
					colon={false}
					scrollToFirstError
				>
					<div className="mb-8">
						<p
							className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
							style={{
								backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
								color: publicSettings?.PRIMARY_COLOR?.valueString
							}}
						>
							メッセージ
						</p>
						<div className="px-4">
							<Form.Item name="memo">
								<TextArea autoSize placeholder="追記事項やご質問がございましたら、ご入力ください。" />
							</Form.Item>
						</div>
						{(searchParams.get('isProgram') === 'false' && category?.categoryMessages?.length > 0) ||
						(searchParams.get('isProgram') === 'true' &&
							occasion?.message &&
							JSON.parse(occasion?.message)?.filter((item) =>
								category?.categoryMessages.find((i) => i.label === item)
							)?.length > 0)
							? searchParams.get('isProgram') === 'false'
								? category?.categoryMessages?.map((item, index) => (
										<div className="px-4">
											<StyleFormItem
												name={`label${index}`}
												label={
													<p>
														<span className="font-bold">{item.label}</span>
													</p>
												}
												rules={[
													{
														required: true,
														message: `${item.label} は必須です。`
													}
												]}
											>
												<TextArea autoSize placeholder={item.label} />
											</StyleFormItem>
										</div>
								  ))
								: JSON.parse(occasion?.message)
										?.filter((item) => category?.categoryMessages.find((i) => i.label === item))
										.map((item, index) => (
											<div className="px-4">
												<StyleFormItem
													name={`label${index}`}
													label={
														<p>
															<span className="font-bold">{item}</span>
														</p>
													}
													rules={[
														{
															required: true,
															message: `${item} は必須です。`
														}
													]}
												>
													<TextArea autoSize placeholder={item} />
												</StyleFormItem>
											</div>
										))
							: ''}
					</div>
					<div className="flex flex-col mb-8 px-4">
						<TapAnimationComponent className="w-full">
							<Button
								type="primary"
								className="w-full h-12"
								size="large"
								htmlType="submit"
								loading={reserveMutation.isLoading}
							>
								この内容で予約する
							</Button>
						</TapAnimationComponent>
						<div className="flex justify-center mt-4">
							<TapAnimationComponent>
								<Link
									to={`${
										COMMONS.CLIENT_CATEGORIES_ROUTE
									}/${liffId}/${categoryId}/${occasionId}?isProgram=${searchParams.get('isProgram')}`}
								>
									<Button className="w-32" size="large">
										戻る
									</Button>
								</Link>
							</TapAnimationComponent>
						</div>
					</div>
				</Form>
			</motion.div>
		</motion.div>
	)
}

export default ReservationMember
