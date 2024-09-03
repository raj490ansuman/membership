import { API } from '@/utils'
import { COMMONS } from '@/utils'
import {
	DoubleLeftOutlined,
	LeftOutlined,
	RightOutlined,
	DoubleRightOutlined,
	UserAddOutlined
} from '@ant-design/icons'
import { Button, message } from 'antd'
import {
	BaseAnimationComponent,
	PageHeaderComponent,
	RegistrationStatDetailModalComponent,
	TapAnimationComponent
} from '@/components'
import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import moment, { MomentInput } from 'moment'
import styled from 'styled-components'

const CalendarWrapper = styled.div`
	a {
		color: inherit !important;
	}

	.fc-day-sat a {
		color: #00c2ff !important;
	}

	.fc-day-sun a {
		color: #c40055 !important;
	}

	.fc .fc-toolbar-title {
		font-weight: bold;
		font-size: 2em;
		color: ${(props: Props) =>
			props.$publicSettings?.PRIMARY_COLOR?.valueString
				? props.$publicSettings?.PRIMARY_COLOR?.valueString
				: COMMONS.PRIMARY_COLOR};
	}

	.fc .fc-daygrid-day {
		min-height: 70px;
	}

	.fc .fc-daygrid-day-frame {
		min-height: 70px;
	}

	.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
		min-height: 0;
	}

	.fc .fc-daygrid-body-natural .fc-daygrid-day-events {
		margin-bottom: 0;
	}

	.fc .fc-daygrid-day-events {
		margin-top: 0;
	}

	.fc .fc-daygrid-day-top {
		justify-content: center;
	}

	.fc .fc-daygrid-day-top .fc-daygrid-day-number:hover {
		color: #000 !important;
	}

	.fc .fc-daygrid-day-bottom {
		padding: 0;
	}

	.fc .fc-highlight {
		background: ${(props) =>
			props.$publicSettings?.PRIMARY_COLOR?.valueString
				? props.$publicSettings?.PRIMARY_COLOR?.valueString
				: COMMONS.PRIMARY_COLOR};
	}

	.fc .fc-bg-event {
		opacity: 0.7;
		font-weight: bold;
	}
`

const HomeV2 = (props: Props) => {
	const { publicSettings } = props

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()
	const calendarRef = useRef<any>()
	const currentDateRef = useRef<Date>()

	const [registrations, setRegistrations] = useState<{ date: string; registrations: string[] }[]>([])

	const [isStatDetailModalVisible, setIsStatDetailModalVisible] = useState(false)

	const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined)
	const [currentRegistrations, setCurrentRegistrations] = useState<string[] | undefined>(undefined)

	const [filterStatsFrom, setFilterStatsFrom] = useState(
		moment().startOf('month').startOf('day').format('YYYY-MM-DD HH:mm')
	)
	const [filterStatsTo, setFilterStatsTo] = useState(moment().endOf('month').endOf('day').format('YYYY-MM-DD HH:mm'))

	useQuery(
		[API.QUERY_KEY_ADMIN_DAILY_STATS, filterStatsFrom, filterStatsTo],
		() => API.ADMIN_GET_DAILY_STATS(filterStatsFrom, filterStatsTo),
		{
			onSuccess: (response: FetchResponse) => {
				if (isMountedRef.current) {
					setRegistrations(response?.data?.registrations || [])

					if (response?.data?.registrations && response.data.registrations.length > 0) {
						const groups = response.data.registrations.reduce(
							(groups: { [x: string]: any[] }, registration: { startAt: moment.MomentInput }) => {
								if (!groups[moment(registration?.startAt).format('YYYY-MM-DD')]) {
									groups[moment(registration?.startAt).format('YYYY-MM-DD')] = []
								}

								groups[moment(registration?.startAt).format('YYYY-MM-DD')].push(registration)

								return groups
							},
							{}
						)

						const groupArrays = Object.keys(groups).map((date) => {
							return {
								date,
								registrations: groups[date]
							}
						})

						setRegistrations(groupArrays)

						if (currentDateRef.current) {
							setCurrentRegistrations(
								groupArrays.find((r) => moment(r?.date).isSame(moment(currentDateRef.current), 'day'))
									?.registrations || []
							)
						}
					} else {
						setRegistrations([])
						setCurrentRegistrations([])
					}
				}
			},
			onError: (error: { response: { status: number } }) => {
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

	useEffect(() => {
		currentDateRef.current = currentDate
	}, [currentDate])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_CATEGORY, () => {
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS] })
		})

		socket.on(API.SOCKET_OCCASION, () => {
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS] })
		})

		socket.on(API.SOCKET_OCCURRENCE, () => {
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS] })
		})

		socket.on(API.SOCKET_REGISTRATION, () => {
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_DAILY_STATS] })
		})

		return () => {
			socket.off(API.SOCKET_CATEGORY)
			socket.off(API.SOCKET_OCCASION)
			socket.off(API.SOCKET_OCCURRENCE)
			socket.off(API.SOCKET_REGISTRATION)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const showStatDetailModal = (date: Date) => {
		setCurrentDate(date)
		setCurrentRegistrations(
			registrations && registrations.length > 0
				? registrations.find((r) => moment(r?.date).isSame(moment(date), 'day'))?.registrations || []
				: []
		)
		setIsStatDetailModalVisible(true)
	}

	const hideStatDetailModal = () => {
		setCurrentDate(undefined)
		setCurrentRegistrations(undefined)
		setIsStatDetailModalVisible(false)
	}

	return (
		<>
			<BaseAnimationComponent>
				<PageHeaderComponent publicSettings={publicSettings} title="ホーム（予約リスト）" />
				<div className="mx-6">
					<div className="flex flex-col justify-center items-center mb-4">
						<div className="flex justify-end items-center w-full">
							<TapAnimationComponent>
								<Button
									className="m-1"
									onClick={() => {
										calendarRef.current
											.getApi()
											.gotoDate(
												moment(calendarRef.current.getApi().getDate())
													.subtract(2, 'month')
													.toDate()
											)

										setFilterStatsFrom(
											moment(filterStatsFrom)
												.subtract(2, 'month')
												.startOf('month')
												.startOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterStatsTo(
											moment(filterStatsTo)
												.subtract(2, 'month')
												.endOf('month')
												.endOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
								>
									<DoubleLeftOutlined />
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									className="m-1"
									onClick={() => {
										calendarRef.current
											.getApi()
											.gotoDate(
												moment(calendarRef.current.getApi().getDate())
													.subtract(1, 'month')
													.toDate()
											)

										setFilterStatsFrom(
											moment(filterStatsFrom)
												.subtract(1, 'month')
												.startOf('month')
												.startOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterStatsTo(
											moment(filterStatsTo)
												.subtract(1, 'month')
												.endOf('month')
												.endOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
								>
									<LeftOutlined />
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									className="m-1"
									onClick={() => {
										calendarRef.current.getApi().today()

										setFilterStatsFrom(
											moment().startOf('month').startOf('day').format('YYYY-MM-DD HH:mm')
										)
										setFilterStatsTo(
											moment().endOf('month').endOf('day').format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
								>
									今月
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									className="m-1"
									onClick={() => {
										calendarRef.current
											.getApi()
											.gotoDate(
												moment(calendarRef.current.getApi().getDate()).add(1, 'month').toDate()
											)

										setFilterStatsFrom(
											moment(filterStatsFrom)
												.add(1, 'month')
												.startOf('month')
												.startOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterStatsTo(
											moment(filterStatsTo)
												.add(1, 'month')
												.endOf('month')
												.endOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
								>
									<RightOutlined />
								</Button>
							</TapAnimationComponent>
							<TapAnimationComponent>
								<Button
									className="m-1"
									onClick={() => {
										calendarRef.current
											.getApi()
											.gotoDate(
												moment(calendarRef.current.getApi().getDate()).add(2, 'month').toDate()
											)

										setFilterStatsFrom(
											moment(filterStatsFrom)
												.add(2, 'month')
												.startOf('month')
												.startOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
										setFilterStatsTo(
											moment(filterStatsTo)
												.add(2, 'month')
												.endOf('month')
												.endOf('day')
												.format('YYYY-MM-DD HH:mm')
										)
									}}
									type="dashed"
								>
									<DoubleRightOutlined />
								</Button>
							</TapAnimationComponent>
						</div>
					</div>
					<div>
						<CalendarWrapper $publicSettings={publicSettings}>
							<FullCalendar
								locale="ja"
								ref={calendarRef}
								//@ts-expect-error
								plugins={[dayGridPlugin, interactionPlugin, momentPlugin]}
								initialView="dayGridMonth"
								height="auto"
								headerToolbar={{
									left: '',
									center: 'title',
									right: ''
								}}
								titleFormat={(date: { date: moment.MomentInput }) => {
									return moment(date.date).format('YYYY年M月')
								}}
								firstDay={0}
								businessHours={false}
								allDaySlot={false}
								unselectAuto={false}
								showNonCurrentDates={false}
								fixedWeekCount={false}
								slotLabelFormat={{
									hour: '2-digit',
									minute: '2-digit',
									omitZeroMinute: false
								}}
								dayHeaderFormat={(date: { date: moment.MomentInput }) => {
									return moment(date.date).format('ddd')
								}}
								slotEventOverlap={false}
								displayEventTime={true}
								displayEventEnd={false}
								nowIndicator={true}
								events={registrations.map((r: any) => {
									return {
										title: `${r?.registrations?.length}件`,
										start: moment(r?.date).format('YYYY-MM-DD'),
										backgroundColor: '#fff',
										borderColor: '#fff'
									}
								})}
								eventContent={(content: { event: { title: any } }) => {
									return (
										<div className="flex justify-center items-center w-full h-full">
											<div
												className="flex flex-col justify-center items-center border rounded w-full"
												style={{
													backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
													borderColor: publicSettings?.PRIMARY_COLOR?.valueString
												}}
											>
												<UserAddOutlined
													className="text-lg"
													style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
												/>
												<p
													className="text-sm font-bold"
													style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
												>
													{content?.event?.title || ''}
												</p>
											</div>
										</div>
									)
								}}
								eventClick={(eventInfo: { event: { start: any } }) => {
									showStatDetailModal(eventInfo.event.start)
								}}
							/>
						</CalendarWrapper>
					</div>
				</div>
			</BaseAnimationComponent>
			<RegistrationStatDetailModalComponent
				{...props}
				isStatDetailModalVisible={isStatDetailModalVisible}
				hideStatDetailModal={hideStatDetailModal}
				currentDate={currentDate}
				currentRegistrations={currentRegistrations}
			/>
		</>
	)
}

export default HomeV2
