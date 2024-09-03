import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { ClientOccurrenceEventComponent } from '@/components'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { Collapse } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
	.ant-collapse-item {
		background-color: #fff !important;
		margin-bottom: 0.25rem !important;
	}

	.ant-collapse-header {
		border: 1px solid #d7d7d7 !important;
		border-radius: 0.25rem !important;
	}

	.ant-collapse-item-active .ant-collapse-header {
		border: 2px solid ${(props) => props?.$publicSettings?.PRIMARY_COLOR?.valueString} !important;
	}

	.ant-collapse-content-box {
		padding: 0 !important;
	}

	.ant-collapse-item .ant-collapse-header-text {
		color: ${(props) =>
			props?.$date
				? moment(props.$date).day() === 6
					? COMMONS.SATURDAY_COLOR
					: moment(props.$date).day() === 0
					? COMMONS.SUNDAY_COLOR
					: props?.$publicSettings?.PRIMARY_COLOR?.valueString
				: 'rgba(0,0,0, 0.6)'} !important;
		font-weight: normal;
	}

	.ant-collapse-item-active .ant-collapse-header-text {
		color: ${(props) =>
			props?.$date
				? moment(props.$date).day() === 6
					? COMMONS.SATURDAY_COLOR
					: moment(props.$date).day() === 0
					? COMMONS.SUNDAY_COLOR
					: props?.$publicSettings?.PRIMARY_COLOR?.valueString
				: props?.$publicSettings?.PRIMARY_COLOR?.valueString} !important;
		font-weight: bold;
	}

	.ant-collapse-item .ant-collapse-expand-icon {
		color: rgba(0, 0, 0, 0.6) !important;
	}

	.ant-collapse-item-active .ant-collapse-expand-icon {
		color: ${(props) => props?.$publicSettings?.PRIMARY_COLOR?.valueString} !important;
	}
`

const CustomPanel = styled(Panel)``

const OccurrencesEvent = (props) => {
	const { publicSettings, occasion, category, personalInfo } = props
	const navigate = useNavigate()
	const { liffId } = useParams()
	const { search } = useLocation()

	const searchParams = new URLSearchParams(search)

	if (searchParams.get('isProgram') == null) {
		navigate(`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`)
	}

	const queryClient = useQueryClient()

	const personalInfoRef = useRef()

	const [occurrences, setOccurrences] = useState([])

	useEffect(() => {
		personalInfoRef.current = personalInfo
	}, [personalInfo])
	useEffect(() => {
		if (category?.occurrences && category?.occurrences.length > 0) {
			if (category?.isSettingTime || category?.isCampaign) {
				if (moment().isBefore(category?.startRegistration) || moment().isAfter(category?.endRegistration)) {
					setOccurrences([])
				} else {
					const groups = category.occurrences.reduce((groups, occurrence) => {
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
					setOccurrences(groupArrays)
				}
			} else {
				const groups = category.occurrences.reduce((groups, occurrence) => {
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

				setOccurrences(groupArrays)
			}
		} else if (occasion?.occurrences && occasion?.occurrences.length > 0) {
			if (occasion?.isSettingTime) {
				if (moment().isBefore(occasion?.startRegistration) || moment().isAfter(occasion?.endRegistration)) {
					setOccurrences([])
				} else {
					const groups = occasion.occurrences.reduce((groups, occurrence) => {
						if (!groups['groups']) {
							groups['groups'] = []
						}
						groups['groups'].push(occurrence)
						return groups
					}, {})
					const groupArrays = Object.keys(groups).map((date) => {
						return {
							date,
							occurrences: groups[date]
						}
					})
					setOccurrences(groupArrays)
				}
			} else {
				const groups = occasion.occurrences.reduce((groups, occurrence) => {
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

				setOccurrences(groupArrays)
			}
		} else {
			setOccurrences([])
		}
	}, [occasion, category])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_REGISTRATION, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.memberId === personalInfoRef.current?.memberId) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_CLIENT_MY_REGISTRATIONS]
					})
				}
			}
		})

		return () => {
			socket.off(API.SOCKET_REGISTRATION)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])
	return (
		<motion.div
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="my-8"
		>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-4">
				<p
					className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
					style={{
						backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
						color: publicSettings?.PRIMARY_COLOR?.valueString
					}}
				>
					ご希望の時間帯を選びください
				</p>
			</motion.div>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8 px-4">
				{occurrences && occurrences?.length > 0 ? (
					<CustomCollapse
						$publicSettings={publicSettings}
						bordered={false}
						accordion
						expandIconPosition="end"
						ghost
					>
						{category?.isSettingTime || category?.isCampaign || occasion?.isSettingTime
							? occurrences[0]?.occurrences
									?.filter((item) => moment(item?.startDate).isAfter(moment()))
									.map((occurrence) => (
										<ClientOccurrenceEventComponent
											isProgram={searchParams.get('isProgram')}
											{...props}
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
									))
							: occurrences.map((group) => (
									<CustomPanel
										key={group?.date}
										$publicSettings={publicSettings}
										$date={group?.date}
										header={group?.date ? moment(group?.date).format('YYYY年M月D日 (ddd)') : 'ー'}
									>
										{group.occurrences.map((occurrence) => (
											<ClientOccurrenceEventComponent
												isProgram={searchParams.get('isProgram')}
												{...props}
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
										))}
									</CustomPanel>
							  ))}
					</CustomCollapse>
				) : category?.isSettingTime || occasion?.isSettingTime ? (
					<p className="text-center">
						{moment().isBefore(moment(category?.startRegistration || occasion?.startRegistration))
							? 'イベント予約開始時間になっていません。'
							: '時間がありません。'}
					</p>
				) : (
					<p className="text-center">時間がありません。</p>
				)}
			</motion.div>
		</motion.div>
	)
}

export default OccurrencesEvent
