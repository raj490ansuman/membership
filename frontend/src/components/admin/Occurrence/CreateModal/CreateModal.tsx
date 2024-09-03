import {
	ClockCircleTwoTone,
	DoubleLeftOutlined,
	DoubleRightOutlined,
	LeftOutlined,
	QuestionCircleOutlined,
	RightOutlined,
	StopTwoTone,
	UndoOutlined,
	EditOutlined
} from '@ant-design/icons'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import {
	Button,
	Card,
	Col,
	Collapse,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Radio,
	Row,
	Select,
	Tooltip
} from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { DayAdjustmentModalComponent, TapAnimationComponent } from '@/components'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { io } from 'socket.io-client'
import { useResizeDetector } from 'react-resize-detector'
import { AxiosError } from 'axios'

const moment = extendMoment(Moment)

const { Option } = Select
const { TextArea } = Input
const { Panel } = Collapse

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

const CustomCollapse = styled(Collapse)`
	.ant-collapse-item > .ant-collapse-header {
		justify-content: center;
	}

	.ant-collapse-item-active > .ant-collapse-header {
		border-top-left-radius: 6px !important;
		border-top-right-radius: 6px !important;
		justify-content: center;
		background-color: ${(props) => props?.$publicSettings?.PRIMARY_LIGHT_COLOR.valueString};
		color: ${(props) => props?.$publicSettings?.PRIMARY_COLOR?.valueString};
	}
`

const CalendarWrapper = styled.div`
	a {
		color: inherit !important;
	}

	.fc .fc-toolbar-title {
		display: inline-block;
		vertical-align: middle;
		margin-left: 1em;
		margin-right: 1em;
		font-size: 2em;
		font-weight: bold;
		white-space: pre-wrap;
		text-align: center;
	}

	.fc-day-sat a {
		color: #00c2ff !important;
	}

	.fc-day-sun a {
		color: #c40055 !important;
	}

	.fc .fc-bg-event {
		opacity: 0.7;
		font-weight: bold;
	}

	.fc-timegrid-slot {
		height: 2em !important;
	}

	.fc .fc-timegrid-col.fc-day-past {
		background-color: rgba(195, 195, 195, 0.2);
	}

	.fc .fc-timegrid-col.fc-day-today {
		background-color: rgba(255, 220, 40, 0.05);
		background-color: var(--fc-today-bg-color, rgba(255, 220, 40, 0.05));
	}
`

const CreateModal = (props) => {
	const { publicSettings, isOccurrenceCreateModalVisible, hideOccurrenceCreateModal } = props
	const { categoryId, occasionId } = useParams()
	const { width, height, ref } = useResizeDetector()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const occurrenceManageCalendarRef = useRef(null)

	const [occurrenceForm] = Form.useForm()
	const [occurrenceModalForm] = Form.useForm()
	const [occurrenceGenerateForm] = Form.useForm()

	const [category, setCategory] = useState(undefined)
	const [occasion, setOccasion] = useState(undefined)
	const [occurrences, setOccurrences] = useState([])

	const [filterOccurrencesFrom, setFilterOccurrencesFrom] = useState(
		moment().startOf('week').hours(0).minutes(0).format('YYYY-MM-DD HH:mm')
	)
	const [filterOccurrencesTo, setFilterOccurrencesTo] = useState(
		moment().endOf('week').hours(23).minutes(59).format('YYYY-MM-DD HH:mm')
	)
	const [eventInterval, setEventInterval] = useState(COMMONS.BUSINESS_INTERVAL_TIME_VALUE)
	const [reservableCount, setReservableCount] = useState(0)
	const [publicHolidays, setPublicHolidays] = useState([])

	const [isDayAdjustmentModalVisible, setIsDayAdjustmentModalVisible] = useState(false)
	const [days, setDays] = useState(COMMONS.DAYS_OF_WEEK)
	const [currentDay, setCurrentDay] = useState(undefined)

	const [modal, contextHolder] = Modal.useModal()

	useQuery(
		[API.QUERY_KEY_ADMIN_CATEGORY_DETAIL, categoryId, filterOccurrencesFrom, filterOccurrencesTo],
		() => API.ADMIN_GET_CATEGORY_DETAIL(categoryId, filterOccurrencesFrom, filterOccurrencesTo),
		{
			enabled: isOccurrenceCreateModalVisible && !occasionId && !!categoryId,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (response?.data) {
						setCategory(response?.data || undefined)
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

	useQuery(
		[API.QUERY_KEY_ADMIN_OCCASION_DETAIL, occasionId, filterOccurrencesFrom, filterOccurrencesTo],
		() => API.ADMIN_GET_OCCASION_DETAIL(occasionId, filterOccurrencesFrom, filterOccurrencesTo),
		{
			enabled: isOccurrenceCreateModalVisible && !!occasionId && !!categoryId,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setOccasion(response?.data || undefined)
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

	useQuery([API.QUERY_KEY_PUBLIC_HOLIDAYS], API.GET_PUBLIC_HOLIDAYS, {
		enabled: isOccurrenceCreateModalVisible,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setPublicHolidays(response?.data ? Object.keys(response.data) : [])
			}
		},
		onError: (error: AxiosError) => {}
	})

	const createOccurrenceMutation = useMutation(API.ADMIN_CREATE_OCCURRENCE, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_ADD_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
				})
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL]
				})
				hideOccurrenceCreateModal()
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

	const occurrenceDeleteMutation = useMutation(API.ADMIN_DELETE_OCCURRENCE, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
			})
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL]
			})
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
		if (!isOccurrenceCreateModalVisible) {
			occurrenceForm.resetFields()
			occurrenceModalForm.resetFields()
			occurrenceGenerateForm.resetFields()

			setOccurrences([])
			setEventInterval(COMMONS.BUSINESS_INTERVAL_TIME_VALUE)
			setDays(COMMONS.DAYS_OF_WEEK)

			setFilterOccurrencesFrom(moment().startOf('week').hours(0).minutes(0).format('YYYY-MM-DD HH:mm'))
			setFilterOccurrencesTo(moment().endOf('week').hours(23).minutes(59).format('YYYY-MM-DD HH:mm'))
		}
	}, [isOccurrenceCreateModalVisible, occurrenceForm, occurrenceModalForm, occurrenceGenerateForm])

	useEffect(() => {
		if (isOccurrenceCreateModalVisible) {
			if (publicSettings?.ADMIN_INITIAL_RESERVABLE_COUNT) {
				setReservableCount(publicSettings.ADMIN_INITIAL_RESERVABLE_COUNT)
			}

			setEventInterval(COMMONS.BUSINESS_INTERVAL_TIME_VALUE)
		}
	}, [isOccurrenceCreateModalVisible, publicSettings])

	useEffect(() => {
		if (occurrenceManageCalendarRef.current) {
			window.dispatchEvent(new Event('resize'))
		}
	}, [width, height])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_CATEGORY, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.categoryId === Number(categoryId)) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_ADMIN_CATEGORY_DETAIL]
					})
				}
			}
		})

		socket.on(API.SOCKET_OCCASION, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.occasionId === Number(occasionId)) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_ADMIN_OCCASION_DETAIL]
					})
				}
			}
		})

		return () => {
			socket.off(API.SOCKET_CATEGORY)
			socket.off(API.SOCKET_OCCASION)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const handleCreateOccurrence = () => {
		const paramData = {
			occurrences: occurrences,
			categoryId: categoryId,
			occasionId: occasionId
		}

		createOccurrenceMutation.mutate(paramData)
	}

	const showDayAdjustmentModal = (selectedDay) => {
		setCurrentDay(days.find((day) => day?.value === selectedDay))
		setIsDayAdjustmentModalVisible(true)
	}

	const hideDayAdjustmentModal = () => {
		setCurrentDay(undefined)
		setIsDayAdjustmentModalVisible(false)
	}

	const handleGenerateOccurrence = (data) => {
		const startDate = moment(data?.startDate, 'YYYY-MM-DD')
		const endDate = moment(data?.endDate, 'YYYY-MM-DD')

		const dateRange = moment.range(startDate, endDate)

		const availableDates = Array.from(
			dateRange.by('days', {
				step: 1,
				excludeEnd: false
			})
		)
			.filter((d) => days.find((day) => day.value === d.isoWeekday())?.enabled)
			.filter((d) =>
				data?.includeHoliday === '1'
					? true
					: publicHolidays.includes(moment(d).format('YYYY-MM-DD'))
					? false
					: true
			)

		let tempOccurrences = []

		availableDates.forEach((ad) => {
			const availableDayTimes = days.find((d) => d.value === ad.isoWeekday())?.times

			if (availableDayTimes && availableDayTimes.length > 0) {
				availableDayTimes.forEach((adt) => {
					if (adt?.startTime && adt?.endTime) {
						const availableTimeRange = moment.range(adt.startTime, adt.endTime)

						const availableTimes = Array.from(
							availableTimeRange.by('minutes', {
								step: eventInterval,
								excludeEnd: true
							})
						)

						tempOccurrences = [
							...tempOccurrences,
							...availableTimes.map((time) => ({
								maxAttendee: reservableCount,
								startAt: moment(ad).hour(moment(time).hour()).minute(moment(time).minute()).toISOString,
								endAt: moment(ad)
									.hour(moment(time).hour())
									.minute(moment(time).minute())
									.add(eventInterval, 'minutes').toISOString,
								remarks: data.remarks
							}))
						]
					}
				})
			}
		})

		setOccurrences([
			...occurrences,
			...tempOccurrences
				.filter((tmp) => {
					const tmpRange = moment.range(
						moment(tmp.startAt, 'YYYY-MM-DD HH:mm'),
						moment(tmp.endAt, 'YYYY-MM-DD HH:mm')
					)

					let isOverlap = false
					occurrences.every((o) => {
						const existRange = moment.range(
							moment(o.startAt, 'YYYY-MM-DD HH:mm'),
							moment(o.endAt, 'YYYY-MM-DD HH:mm')
						)

						isOverlap = tmpRange.overlaps(existRange)

						return isOverlap ? false : true
					})

					return !isOverlap
				})
				.filter((tmp) => {
					const tmpRange = moment.range(
						moment(tmp.startAt, 'YYYY-MM-DD HH:mm'),
						moment(tmp.endAt, 'YYYY-MM-DD HH:mm')
					)

					let isOverlap = false
					occasion?.occurrences.every((o) => {
						const existRange = moment.range(moment(o.startAt), moment(o.endAt))

						isOverlap = tmpRange.overlaps(existRange)

						return isOverlap ? false : true
					})

					return !isOverlap
				})
		])

		message.success(COMMONS.SUCCESS_CREATE_MSG)
	}

	const clearOccurrence = () => {
		setOccurrences([])
	}

	return (
		<>
			<Modal
				open={isOccurrenceCreateModalVisible}
				onCancel={() => {
					setFilterOccurrencesFrom(moment().startOf('week').hours(0).minutes(0).format('YYYY-MM-DD HH:mm'))
					setFilterOccurrencesTo(moment().endOf('week').hours(23).minutes(59).format('YYYY-MM-DD HH:mm'))

					hideOccurrenceCreateModal()
				}}
				title="時間追加"
				footer={null}
				width={720}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
				maskClosable={false}
				destroyOnClose
				centered
				transitionName=""
				maskTransitionName=""
			>
				<div className="p-2">
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-between">
							<div>
								<p className="mb-2">既定予約可能最大人数</p>
								<InputNumber
									min={0}
									className="w-28"
									value={reservableCount}
									onChange={setReservableCount}
								/>
							</div>
							<div>
								<p className="mb-2">1枠の時間</p>
								<Select
									className="w-28"
									value={eventInterval}
									onChange={(value) => {
										setEventInterval(parseInt(value))
										clearOccurrence()
									}}
								>
									{COMMONS.ARRAY_RANGE_CREATOR(15, 495, 15).map((min) => (
										<Option key={min} value={min}>
											{min >= 60
												? `${Math.floor(min / 60)}時間${min % 60 > 0 ? `${min % 60}分` : ''}`
												: `${min}分`}
										</Option>
									))}
								</Select>
							</div>
						</motion.div>
						<CustomCollapse $publicSettings={publicSettings} className="my-4">
							<Panel header="詳細設定" key="detail">
								<motion.div
									variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
									initial="hidden"
									animate="show"
									exit="hidden"
								>
									<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
										<p className="text-center font-bold">
											予約可能スケジュールを表⽰する期間を設定することができます。
										</p>
										<p className="text-center mb-4">
											時間帯ごとの予約可能最大人数と1枠の時間は上記の設定を利用します。
										</p>
										<Form
											form={occurrenceGenerateForm}
											layout="vertical"
											size="large"
											requiredMark={false}
											onFinish={handleGenerateOccurrence}
											initialValues={{
												startDate: undefined,
												endDate: undefined,
												includeHoliday: '0',
												remarks: undefined
											}}
											scrollToFirstError
										>
											<Form.Item label="期間の設定をする" className="mb-0" required>
												<Form.Item
													name="startDate"
													className="inline-block mr-2"
													style={{ width: 'calc(50% - 0.25rem)' }}
													extra="※開始日"
													rules={[
														{
															required: true,
															message: '必須です'
														}
													]}
												>
													<CustomDatePicker
														className="w-full"
														inputReadOnly
														allowClear={false}
														disabledDate={(current) => current.isBefore(moment(), 'day')}
													/>
												</Form.Item>
												<Form.Item
													name="endDate"
													className="inline-block"
													style={{ width: 'calc(50% - 0.25rem)' }}
													extra="※終了日"
													rules={[
														{
															required: true,
															message: '必須です'
														}
													]}
												>
													<CustomDatePicker
														className="w-full"
														inputReadOnly
														allowClear={false}
														disabledDate={(current) => current.isBefore(moment(), 'day')}
													/>
												</Form.Item>
											</Form.Item>
											<div className="flex flex-wrap justify-center my-4">
												{days.map((d) => (
													<div
														key={d?.value}
														className="flex flex-col border py-2 px-1 m-0.5 rounded cursor-pointer"
														style={{
															borderColor: d?.enabled
																? publicSettings?.PRIMARY_COLOR?.valueString
																: COMMONS.CUSTOM_GRAY_COLOR,
															backgroundColor: d?.enabled
																? publicSettings?.PRIMARY_LIGHT_COLOR.valueString
																: ''
														}}
														onClick={() => {
															showDayAdjustmentModal(d?.value)
														}}
													>
														<p
															className="font-bold text-center"
															style={
																d.value === 6
																	? { color: COMMONS.SATURDAY_COLOR }
																	: d.value === 7
																	? { color: COMMONS.SUNDAY_COLOR }
																	: {}
															}
														>
															{d.longLabel}
														</p>
														<div className="flex flex-col mt-2">
															{d?.times && d?.times?.length > 0
																? d.times.map((time) => (
																		<p key={time?.startTime} className="text-xxs">
																			{time?.startTime
																				? moment(
																						time.startTime,
																						'HH:mm:ss'
																				  ).format('HH:mm')
																				: ''}
																			~
																			{time?.endTime
																				? moment(
																						time.endTime,
																						'HH:mm:ss'
																				  ).format('HH:mm')
																				: ''}
																		</p>
																  ))
																: ''}
														</div>
														<div className="flex justify-center">
															<EditOutlined className="text-xs mt-1" />
														</div>
													</div>
												))}
											</div>
											<Form.Item
												name="includeHoliday"
												label="祝⽇は予約を受け付けますか？"
												className="mb-0"
											>
												<Radio.Group>
													<Radio value="1">受け付ける</Radio>
													<Radio value="0">受け付けない</Radio>
												</Radio.Group>
											</Form.Item>
											<Form.Item name="remarks" label="備考欄">
												<TextArea placeholder="上記の時間に対しての備考欄" autoSize />
											</Form.Item>
											<div className="flex justify-center mt-4">
												<Button type="primary" className="px-12" htmlType="submit">
													自動作成
												</Button>
											</div>
											<p className="text-center mt-4">
												※時間帯を実際に作られる為には保存する必要があります
											</p>
										</Form>
									</motion.div>
								</motion.div>
							</Panel>
						</CustomCollapse>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-end mb-4">
							<TapAnimationComponent>
								<Button
									onClick={() => {
										occurrenceManageCalendarRef.current
											.getApi()
											.gotoDate(
												moment(occurrenceManageCalendarRef.current.getApi().getDate())
													.subtract(2, 'week')
													.toDate()
											)

										setFilterOccurrencesFrom(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.startOf('week')
												.hours(0)
												.minutes(0)
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterOccurrencesTo(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.endOf('week')
												.hours(23)
												.minutes(59)
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
									className="mr-1"
								>
									<DoubleLeftOutlined />
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									onClick={() => {
										occurrenceManageCalendarRef.current.getApi().prev()

										setFilterOccurrencesFrom(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.startOf('week')
												.hours(0)
												.minutes(0)
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterOccurrencesTo(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.endOf('week')
												.hours(23)
												.minutes(59)
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
									className="mr-1"
								>
									<LeftOutlined />
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									onClick={() => {
										occurrenceManageCalendarRef.current.getApi().today()

										setFilterOccurrencesFrom(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.startOf('week')
												.hours(0)
												.minutes(0)
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterOccurrencesTo(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.endOf('week')
												.hours(23)
												.minutes(59)
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
									className="mr-1"
								>
									今週
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									onClick={() => {
										occurrenceManageCalendarRef.current.getApi().next()

										setFilterOccurrencesFrom(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.startOf('week')
												.hours(0)
												.minutes(0)
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterOccurrencesTo(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.endOf('week')
												.hours(23)
												.minutes(59)
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
									className="mr-1"
								>
									<RightOutlined />
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									onClick={() => {
										occurrenceManageCalendarRef.current
											.getApi()
											.gotoDate(
												moment(occurrenceManageCalendarRef.current.getApi().getDate())
													.add(2, 'week')
													.toDate()
											)

										setFilterOccurrencesFrom(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.startOf('week')
												.hours(0)
												.minutes(0)
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterOccurrencesTo(
											moment(occurrenceManageCalendarRef.current.getApi().getDate())
												.endOf('week')
												.hours(23)
												.minutes(59)
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
								>
									<DoubleRightOutlined />
								</Button>
							</TapAnimationComponent>
						</motion.div>
						<CalendarWrapper ref={ref}>
							<FullCalendar
								locale="ja"
								ref={occurrenceManageCalendarRef}
								plugins={[timeGridPlugin, interactionPlugin, momentPlugin]}
								initialView="timeGridWeek"
								height="auto"
								headerToolbar={{
									left: '',
									center: 'title',
									right: ''
								}}
								titleFormat={(date) => {
									return moment(date.date).format('YYYY年M月')
								}}
								firstDay={0}
								businessHours={false}
								allDaySlot={false}
								slotLabelFormat={{
									hour: '2-digit',
									minute: '2-digit',
									omitZeroMinute: false
								}}
								slotMinTime={COMMONS.BUSINESS_OPEN_TIME}
								slotMaxTime={COMMONS.BUSINESS_CLOSE_TIME}
								slotDuration={`${
									eventInterval >= 60
										? `${Math.floor(eventInterval / 60)}:${
												eventInterval % 60 === 0 ? '00' : eventInterval % 60
										  }:00`
										: `00:${eventInterval}:00`
								}`}
								slotLabelInterval={`${
									eventInterval >= 60
										? `${Math.floor(eventInterval / 60)}:${
												eventInterval % 60 < 10 ? `0${eventInterval % 60}` : eventInterval % 60
										  }:00`
										: `00:${eventInterval}:00`
								}`}
								dayHeaderFormat={(date) => {
									return moment(date?.date).format('D（ddd）')
								}}
								eventTimeFormat={{
									hour: '2-digit',
									minute: '2-digit',
									meridiem: false
								}}
								slotEventOverlap={false}
								displayEventTime={true}
								displayEventEnd={false}
								nowIndicator={true}
								selectable={true}
								selectOverlap={false}
								unselectAuto={true}
								selectAllow={(selectInfo) => moment().isBefore(selectInfo.start)}
								events={[
									...(category && category?.occurrences
										? category.occurrences.map((occurrence) => {
												return {
													groupId: occurrence?.sumExpected > 0 ? 'reserved' : 'not-reserved',
													occurrenceId: occurrence?.occurrenceId,
													reservationCount: occurrence?.sumExpected,
													display: 'background',
													backgroundColor:
														occurrence?.sumExpected > 0
															? COMMONS.THIRD_COLOR
															: publicSettings?.PRIMARY_COLOR?.valueString,
													start: moment(occurrence?.startAt).format('YYYY-MM-DD HH:mm'),
													end: moment(occurrence?.endAt).format('YYYY-MM-DD HH:mm')
												}
										  })
										: []),
									...(occasion && occasion?.occurrences
										? occasion.occurrences.map((occurrence) => {
												return {
													groupId: occurrence?.sumExpected > 0 ? 'reserved' : 'not-reserved',
													occurrenceId: occurrence?.occurrenceId,
													reservationCount: occurrence?.sumExpected,
													display: 'background',
													backgroundColor:
														occurrence?.sumExpected > 0
															? COMMONS.THIRD_COLOR
															: publicSettings?.PRIMARY_COLOR?.valueString,
													start: moment(occurrence?.startAt).format('YYYY-MM-DD HH:mm'),
													end: moment(occurrence?.endAt).format('YYYY-MM-DD HH:mm')
												}
										  })
										: []),
									...(occurrences
										? occurrences.map((occurrence) => {
												return {
													groupId: 'background',
													display: 'background',
													backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
													start: moment(occurrence?.startAt).format('YYYY-MM-DD HH:mm'),
													end: moment(occurrence?.endAt).format('YYYY-MM-DD HH:mm')
												}
										  })
										: [])
								]}
								eventContent={(arg) => {
									if (arg?.event?.groupId === 'reserved') {
										return (
											<Tooltip
												title={`予約が${
													arg?.event?.extendedProps?.reservationCount || 0
												}件あります。`}
												trigger={['click']}
											>
												<div className="flex justify-center items-center h-full cursor-not-allowed">
													<StopTwoTone
														twoToneColor={COMMONS.THIRD_COLOR}
														className="text-base leading-none p-1"
													/>
												</div>
											</Tooltip>
										)
									} else if (
										arg?.event?.groupId === 'background' ||
										arg?.event?.groupId === 'not-reserved'
									) {
										return (
											<div className="flex justify-center items-center h-full cursor-pointer">
												<ClockCircleTwoTone
													twoToneColor={publicSettings?.PRIMARY_COLOR?.valueString}
													className="text-base leading-none p-1"
												/>
											</div>
										)
									}
								}}
								eventClick={(eventInfo) => {
									if (
										eventInfo?.event?.groupId === 'background' ||
										eventInfo?.event?.groupId === 'not-reserved'
									) {
										modal.confirm({
											title: '時間削除',
											centered: true,
											icon: <QuestionCircleOutlined className="text-custom-red" />,
											content: (
												<Row gutter={[0, 16]} className="mt-4" justify="center">
													<Col span={24}>
														<Card
															styles={{
																body: {
																	maxHeight: '50vh',
																	overflow: 'auto'
																}
															}}
														>
															<Card.Grid
																hoverable={false}
																className="w-full text-center text-custom-red p-2"
															>
																{`${moment(eventInfo?.event?.start).format(
																	'YYYY年M月D日 HH:mm'
																)}`}
															</Card.Grid>
														</Card>
													</Col>
												</Row>
											),
											okText: '削除する',
											okButtonProps: {
												danger: true
											},
											onOk: () => {
												if (eventInfo?.event?.groupId === 'background') {
													setOccurrences(
														occurrences.filter(
															(occurrence) =>
																occurrence.startAt !==
																moment(eventInfo?.event?.start).format(
																	'YYYY-MM-DD HH:mm'
																)
														)
													)
												} else if (eventInfo?.event?.groupId === 'not-reserved') {
													const paramData = {
														occurrenceId: eventInfo?.event?.extendedProps?.occurrenceId
													}

													occurrenceDeleteMutation.mutate(paramData)
												}
											},
											cancelText: '閉じる'
										})
									}
								}}
								select={(selectInfo) => {
									occurrenceModalForm.setFieldValue('occurrenceMaxParticipation', reservableCount)

									modal.confirm({
										title: '時間追加',
										centered: true,
										icon: (
											<QuestionCircleOutlined
												style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
											/>
										),
										okButtonProps: {
											size: 'large',
											type: 'primary'
										},
										cancelButtonProps: {
											size: 'large'
										},
										content: (
											<Row gutter={[0, 16]} className="mt-4" justify="center">
												<Col span={24}>
													<Card
														styles={{
															body: {
																maxHeight: '50vh',
																overflow: 'auto'
															}
														}}
													>
														{Array.from(
															moment
																.range(selectInfo.start, selectInfo.end)
																.by('minutes', {
																	step: eventInterval,
																	excludeEnd: true
																})
														).map((chunk) => (
															<Card.Grid
																key={chunk}
																hoverable={false}
																style={{
																	color: publicSettings?.PRIMARY_COLOR?.valueString
																}}
																className="w-full text-center p-2"
															>
																{moment(chunk).format('YYYY年M月D日 HH:mm')}
															</Card.Grid>
														))}
													</Card>
												</Col>
												<Col span={24}>
													<Form
														form={occurrenceModalForm}
														layout="vertical"
														size="large"
														requiredMark={false}
														scrollToFirstError
													>
														<Form.Item
															name="occurrenceMaxParticipation"
															label="予約可能最大人数"
															rules={[
																{
																	required: true,
																	message: '予約可能最大人数は必須です'
																}
															]}
														>
															<InputNumber min={0} className="w-full" />
														</Form.Item>
														<Form.Item name="occurrenceRemarks" label="備考欄">
															<TextArea
																placeholder="上記の時間に対しての備考欄"
																autoSize
															/>
														</Form.Item>
													</Form>
												</Col>
											</Row>
										),
										okText: '追加する',
										onOk: () => {
											occurrenceModalForm
												.validateFields()
												.then((values) => {
													const dateRange = moment.range(selectInfo.start, selectInfo.end)

													const dateChunk = Array.from(
														dateRange.by('minutes', {
															step: eventInterval,
															excludeEnd: true
														})
													)

													setOccurrences([
														...occurrences,
														...dateChunk.map((date) => ({
															maxAttendee: values.occurrenceMaxParticipation || 10,
															startAt: moment(date).toISOString(),
															endAt: moment(date)
																.add(eventInterval, 'minutes')
																.toISOString(),
															remarks: values.occurrenceRemarks
														}))
													])
												})
												.catch((error) => {})
										},
										cancelText: '閉じる'
									})
								}}
							/>
						</CalendarWrapper>
						<motion.div
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
							className="flex justify-center mt-4"
						>
							<TapAnimationComponent>
								<Button danger icon={<UndoOutlined />} onClick={() => clearOccurrence()}>
									やり直し
								</Button>
							</TapAnimationComponent>
						</motion.div>
						<Divider />
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex justify-center">
							<TapAnimationComponent>
								<Button
									type="primary"
									onClick={handleCreateOccurrence}
									size="large"
									className="m-1 w-32"
									loading={createOccurrenceMutation.isLoading}
									disabled={!occurrences || occurrences?.length === 0}
								>
									保存する
								</Button>
							</TapAnimationComponent>
						</motion.div>
					</motion.div>
				</div>
			</Modal>
			<DayAdjustmentModalComponent
				{...props}
				currentDay={currentDay}
				days={days}
				setDays={setDays}
				isDayAdjustmentModalVisible={isDayAdjustmentModalVisible}
				hideDayAdjustmentModal={hideDayAdjustmentModal}
			/>
			{contextHolder}
		</>
	)
}

export default CreateModal
