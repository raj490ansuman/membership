import { useState, useEffect } from 'react'
import {
	Button,
	Col,
	Form,
	message,
	Row,
	Modal,
	DatePicker,
	Input,
	Divider,
	Tag,
	Select,
} from 'antd'
import { UndoOutlined, SearchOutlined } from '@ant-design/icons'
import equal from 'fast-deep-equal'
import styled from 'styled-components'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { AxiosError } from 'axios'
import AudienceMemberAttributeFilters from '../MemberAttributeFilters'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

const { Option } = Select

const AudienceModal = (
	props: Props & { isAudienceModalVisible: boolean; hideAudienceModal: () => void },
) => {
	const { isAudienceModalVisible, hideAudienceModal, memberAttributes } = props
	const { publicSettings } = useLayoutConfigContext()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [audienceForm] = Form.useForm()
	const [membersFilterForm] = Form.useForm()

	const [campaignQuestions, setCampaignQuestions] = useState([])

	const [resultTotal, setResultTotal] = useState(0)

	const [audienceSearchedValue, setAudienceSearchedValue] = useState(undefined)

	const [modal, contextHolder] = Modal.useModal()

	// useQuery([API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS], () => API.ADMIN_GET_CAMPAIGN_QUESTIONS(), {
	// 	enabled: isAudienceModalVisible,
	// 	onSuccess: (response) => {
	// 		if (isMountedRef.current) {
	// 			setCampaignQuestions(response?.data || [])
	// 		}
	// 	}
	// })

	// useQuery([API.QUERY_KEY_ADMIN_CATEGORY_TEMPLATES], () => API.ADMIN_GET_CATEGORY_TEMPLATES(), {
	// 	enabled: isAudienceModalVisible,
	// 	onSuccess: (response) => {
	// 		if (isMountedRef.current) {
	// 			setCategories(response?.data || [])
	// 		}
	// 	}
	// })

	// useQuery([API.QUERY_KEY_ADMIN_OCCASION_TEMPLATES], () => API.ADMIN_GET_OCCASION_TEMPLATES(), {
	// 	enabled: isAudienceModalVisible,
	// 	onSuccess: (response) => {
	// 		if (isMountedRef.current) {
	// 			setOccasions(response?.data || [])
	// 		}
	// 	}
	// })

	const audienceCreateMutation = useMutation(API.ADMIN_CREATE_AUDIENCE, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_CREATE_MSG)
			hideAudienceModal()
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_AUDIENCES],
			})
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				message.warning(COMMONS.WARN_AUDIENCE_NAME_EXIST_MSG)
			} else if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	const searchAudienceMembersMutation = useMutation(API.ADMIN_SEARCH_AUDIENCE_MEMBERS, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setResultTotal(response?.data?.count || 0)
			}
		},
	})

	const handleCreate = () => {
		if (resultTotal > 0) {
			membersFilterForm
				.validateFields()
				.then((filterValues) => {
					if (equal(filterValues, audienceSearchedValue)) {
						modal.confirm({
							title: 'オーディエンス作成',
							content: (
								<>
									<Form
										form={audienceForm}
										name='audienceForm'
										layout='vertical'
										preserve={false}
										initialValues={{
											name: undefined,
										}}
										scrollToFirstError
									>
										<Row justify='center'>
											<Col span={24}>
												<Form.Item
													name='name'
													label='オーディエンス名'
													rules={[
														{
															required: true,
															whitespace: true,
															message:
																'オーディエンス名を入力してください',
														},
														{
															max: 50,
															message:
																'オーディエンス名は50文字以内である必要があります',
														},
													]}
												>
													<Input allowClear maxLength={50} />
												</Form.Item>
											</Col>
										</Row>
									</Form>
								</>
							),
							okText: '確認',
							okType: 'primary',
							cancelText: '閉じる',
							centered: true,
							onOk(close) {
								audienceForm
									.validateFields()
									.then((audienceValues) => {
										const paramData = {
											...processAudienceSearchParams(filterValues),
											audienceName: audienceValues.name,
										}

										audienceCreateMutation.mutate(paramData, {
											onSuccess: (data, variables, context) => {
												close()
											},
										})
									})
									.catch((error) => {})
							},
						})
					} else {
						message.warning(COMMONS.WARN_AUDIENCE_NOT_MATCH_MSG)
					}
				})
				.catch((error) => {})
		} else {
			message.warning(COMMONS.WARN_AUDIENCE_COUNT_ZERO_MSG)
		}
	}

	const processAudienceSearchParams = (data) => {
		let questions = []

		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				if (key.includes('question') && data[key]) {
					const questionId = key.split('-')[1]
					questions.push({ questionId: Number(questionId), value: data[key] })
				}
			} else {
				continue
			}
		}

		const newFilters: { [key: string]: string | undefined } = {}

		Object.keys(data).forEach((key) => {
			if (key.includes('Min') && data[key]?.$isDayjsObject) {
				newFilters[key] = data[key] ? new Date(data[key].startOf('day')) : data[key]
			} else if (key.includes('Max') && data[key]?.$isDayjsObject) {
				newFilters[key] = data[key] ? new Date(data[key].endOf('day')) : data[key]
			} else {
				newFilters[key] = data[key]
			}
		})

		let params = {
			...newFilters,
			categoryId: data?.categoryId,
			occasionId: data?.occasionId,
			isCampaign: data?.isCampaign,
			address: data?.address ? data?.address : undefined,
			createdAtMin: data?.createdAtMin
				? data.createdAtMin.startOf('day').toISOString()
				: undefined,
			createdAtMax: data?.createdAtMax
				? data.createdAtMax.endOf('day').toISOString()
				: undefined,
			memberSinceMin: data?.memberSinceMin
				? data.memberSinceMin.startOf('day').toISOString()
				: undefined,
			memberSinceMax: data?.memberSinceMax
				? data.memberSinceMax.endOf('day').toISOString()
				: undefined,
			lastVisitMin: data?.lastVisitMin
				? data.lastVisitMin.startOf('day').toISOString()
				: undefined,
			lastVisitMax: data?.lastVisitMax
				? data.lastVisitMax.endOf('day').toISOString()
				: undefined,
			hasWon: data?.hasWon,
			candidateAtMin: data?.candidateAtMin
				? data.candidateAtMin?.startOf('day')?.toISOString()
				: undefined,
			candidateAtMax: data?.candidateAtMax
				? data.candidateAtMax?.endOf('day')?.toISOString()
				: undefined,
			questions: questions.length > 0 ? questions : undefined,
		}

		return params
	}

	const handleFilter = () => {
		membersFilterForm
			.validateFields()
			.then((values) => {
				if (!equal(values, audienceSearchedValue)) {
					const paramData = processAudienceSearchParams(values)

					setAudienceSearchedValue(values)

					searchAudienceMembersMutation.mutate(paramData)
				}
			})
			.catch((error) => {})
	}

	const clearFilters = () => {
		membersFilterForm.resetFields()
	}

	useEffect(() => {
		if (isAudienceModalVisible) {
			clearFilters()
			setResultTotal(0)
			setAudienceSearchedValue(undefined)
		}

		//eslint-disable-next-line
	}, [isAudienceModalVisible])

	return (
		<>
			<Modal
				title='新規作成'
				open={isAudienceModalVisible}
				onCancel={hideAudienceModal}
				footer={null}
				destroyOnClose
				centered
				width={720}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden',
					},
				}}
			>
				<Row>
					<Col xs={24} className='mb-4'>
						<div className='flex justify-end'>
							<Button type='dashed' icon={<UndoOutlined />} onClick={clearFilters}>
								フィルタークリア
							</Button>
						</div>
					</Col>
					<Col xs={24} className='mb-4 p-4 bg-gray-100'>
						<Form
							form={membersFilterForm}
							layout='vertical'
							onFinish={handleFilter}
							initialValues={{
								categoryId: undefined,
								occasionId: undefined,
								isCampaign: undefined,
								address: undefined,
								createdAtMin: undefined,
								createdAtMax: undefined,
								memberSinceMin: undefined,
								memberSinceMax: undefined,
								lastVisitMin: undefined,
								lastVisitMax: undefined,
								hasWon: undefined,
								candidateAtMin: undefined,
								candidateAtMax: undefined,
								...Object.assign({}, [
									...campaignQuestions.map((q) => ({
										[`question-${q.campaignQuestionId}`]: undefined,
									})),
								]),
							}}
						>
							{/* <Divider>{`${COMMONS.DEFAULT_SYSTEM_TYPE}と${COMMONS.DEFAULT_SYSTEM_TYPE}プログラムで検索`}</Divider>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item help={COMMONS.DEFAULT_SYSTEM_TYPE} name="categoryId" className="mb-4">
										<Select
											allowClear
											showSearch
											placeholder={`${COMMONS.DEFAULT_SYSTEM_TYPE}で検索`}
										>
											{categories.map((c) => (
												<Option key={c.categoryId} value={c.categoryId}>
													{c.title}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										help={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム`}
										name="occasionId"
										className="mb-4"
									>
										<Select
											allowClear
											showSearch
											placeholder={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラムで検索`}
										>
											{occasions.map((o) => (
												<Option key={o.occasionId} value={o.occasionId}>
													{o.title}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row> */}
							{/* <Divider>キャンペーン質問の選択で検索</Divider>
							{campaignQuestions.length > 0 ? (
								<Row gutter={[16, 16]} justify="start">
									{campaignQuestions.map((q) => (
										<Col key={q?.campaignQuestionId} xs={{ span: 24 }} md={{ span: 12 }}>
											<Form.Item
												help={
													<p className="whitespace-pre-wrap">{`Q${q.showOrder + 1}：${
														q.contents || ''
													}`}</p>
												}
												name={`question-${q.campaignQuestionId}`}
												className="mb-4"
											>
												<Select
													allowClear
													mode="multiple"
													showSearch={false}
													placeholder="選択検索"
													tagRender={(props) => {
														const { label, closable, onClose } = props
														const onPreventMouseDown = (event) => {
															event.preventDefault()
															event.stopPropagation()
														}
														return (
															<Tag
																onMouseDown={onPreventMouseDown}
																closable={closable}
																onClose={onClose}
																style={{ marginRight: 3 }}
															>
																{label}
															</Tag>
														)
													}}
												>
													{q?.campaignChoices.map((c) => (
														<Option key={c.campaignChoiceId} value={c.contents}>
															{c.contents}
														</Option>
													))}
												</Select>
											</Form.Item>
										</Col>
									))}
								</Row>
							) : (
								<p className="text-center">検索可能な質問はありません。</p>
							)}
							<Divider>キャンペーン応募状態で検索</Divider>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }}>
									<Form.Item name="isCampaign" className="mb-4">
										<Select allowClear placeholder="キャンペーン応募状態">
											<Option value={1}>キャンペーン応募済み</Option>
											<Option value={0}>キャンペーン応募してない</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row> */}
							{/* <Divider>住所で検索</Divider>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }}>
									<Form.Item name="address" className="mb-4">
										<Input placeholder="住所を検索" allowClear />
									</Form.Item>
								</Col>
							</Row> */}
							<Divider>会員登録状態で検索</Divider>
							<Row gutter={[16, 16]} justify='start'>
								<Col xs={{ span: 24 }}>
									<Form.Item name='isRegistered' className='mb-4'>
										<Select placeholder='会員登録あり／会員登録なし' allowClear>
											<Option value={true}>会員登録あり</Option>
											<Option value={false}>会員登録なし</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Divider>ブロック状態で検索</Divider>
							<Row gutter={[16, 16]} justify='start'>
								<Col xs={{ span: 24 }}>
									<Form.Item name='isFriends' className='mb-4'>
										<Select
											placeholder='ブロックユーザーのみ／ブロックユーザーを含まない'
											allowClear
										>
											<Option value={1}>ブロックユーザーを含まない</Option>
											<Option value={0}>ブロックユーザーのみ</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Divider>LINEチャットで検索</Divider>
							<Row gutter={[16, 16]} justify='start'>
								<Col xs={{ span: 24 }}>
									<Form.Item name='messages' className='mb-4'>
										<Select placeholder='未読／既読' allowClear>
											<Option value='unread'>未読</Option>
											<Option value='read'>既読</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Divider>友だち追加日で検索</Divider>
							<Row gutter={[16, 16]} justify='start'>
								<Col xs={{ span: 24 }}>
									<Form.Item className='mb-0'>
										<Form.Item
											help='この日付から'
											name='createdAtMin'
											className='inline-block mr-2 mb-4'
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder='日付で検索'
												className='w-full'
												inputReadOnly
											/>
										</Form.Item>
										<Form.Item
											help='この日付まで'
											name='createdAtMax'
											className='inline-block mb-4'
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder='日付で検索'
												className='w-full'
												inputReadOnly
											/>
										</Form.Item>
									</Form.Item>
								</Col>
							</Row>
							<Divider>会員登録日で検索</Divider>
							<Row gutter={[16, 16]} justify='start'>
								<Col xs={{ span: 24 }}>
									<Form.Item className='mb-0'>
										<Form.Item
											help='この日付から'
											name='memberSinceMin'
											className='inline-block mr-2 mb-4'
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder='日付で検索'
												className='w-full'
												inputReadOnly
											/>
										</Form.Item>
										<Form.Item
											help='この日付まで'
											name='memberSinceMax'
											className='inline-block mb-4'
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder='日付で検索'
												className='w-full'
												inputReadOnly
											/>
										</Form.Item>
									</Form.Item>
								</Col>
							</Row>
							<Divider>最終来店日で検索</Divider>
							<Row gutter={[16, 16]} justify='start'>
								<Col xs={{ span: 24 }}>
									<Form.Item className='mb-0'>
										<Form.Item
											help='この日付から'
											name='lastVisitMin'
											className='inline-block mr-2 mb-4'
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder='日付で検索'
												className='w-full'
												inputReadOnly
											/>
										</Form.Item>
										<Form.Item
											help='この日付まで'
											name='lastVisitMax'
											className='inline-block mb-4'
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder='日付で検索'
												className='w-full'
												inputReadOnly
											/>
										</Form.Item>
									</Form.Item>
								</Col>
							</Row>

							{/***************************************/}
							{/* DYNAMIC CUSTOMER REGISTERED FILTERS */}
							{/***************************************/}

							<AudienceMemberAttributeFilters memberAttributes={memberAttributes} />

							{/***************************************/}
							{/***************************************/}
							{/***************************************/}
							{/* <Divider>当選状態で検索</Divider>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }}>
									<Form.Item name="hasWon" className="mb-4">
										<Select allowClear placeholder="当選状態">
											<Option value={1}>当選済み</Option>
											<Option value={0}>当選待ち</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Divider>抽選日で検索</Divider>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }}>
									<Form.Item className="mb-0">
										<Form.Item
											help="この日付から"
											name="candidateAtMin"
											className="inline-block mr-2 mb-4"
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder="日付で検索"
												className="w-full"
												inputReadOnly
											/>
										</Form.Item>
										<Form.Item
											help="この日付まで"
											name="candidateAtMax"
											className="inline-block mb-4"
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder="日付で検索"
												className="w-full"
												inputReadOnly
											/>
										</Form.Item>
									</Form.Item>
								</Col>
							</Row> */}
							<Divider />
							<Row gutter={[8, 8]} justify='center'>
								<Col>
									<Button
										type='dashed'
										icon={<SearchOutlined />}
										size='large'
										className='bg-white px-6'
										onClick={handleFilter}
									>
										検索
									</Button>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col span={24}>
						<div
							className='p-4 rounded-full border'
							style={{
								backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
								borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
								color: publicSettings?.PRIMARY_COLOR?.valueString,
							}}
						>
							<p className='text-center text-lg font-bold'>
								検索結果：{resultTotal}件
							</p>
						</div>
					</Col>
					<Divider />
					<Col span={24} className='text-center'>
						<Button
							type='primary'
							size='large'
							htmlType='submit'
							className='px-12'
							onClick={handleCreate}
						>
							作成
						</Button>
					</Col>
				</Row>
			</Modal>
			{contextHolder}
		</>
	)
}

export default AudienceModal
