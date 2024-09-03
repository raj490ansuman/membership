import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import {
	IdcardOutlined,
	IdcardFilled,
	ScheduleOutlined,
	ScheduleFilled,
	ContactsOutlined,
	ContactsFilled
} from '@ant-design/icons'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { message, Tooltip } from 'antd'
import { io } from 'socket.io-client'
import { AxiosError } from 'axios'

const ANIMATION_VARIANT_CONTAINER = {
	hidden: {
		y: 50,
		opacity: 0,
		transition: { type: 'spring', bounce: 0.4 }
	},
	show: {
		y: 0,
		opacity: 1,
		transition: { type: 'spring', bounce: 0.4 }
	}
}

const BottomMenuBar = (props) => {
	const { publicSettings, personalInfo, accessToken } = props

	const location = useLocation()
	const { liffId } = useParams()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()

	const personalInfoRef = useRef()

	const [registrations, setRegistrations] = useState([])
	const [checkDisable, setCheckDisable] = useState(false)

	useQuery([API.QUERY_KEY_CLIENT_MY_REGISTRATIONS, accessToken], () => API.CLIENT_GET_MY_REGISTRATIONS(accessToken), {
		enabled: !!accessToken,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setRegistrations(response?.data || [])
				let checkIsMultiEvent = false

				response?.data?.forEach((item) => {
					if (!item?.Category?.isMultiEvent && !item?.Occasion?.isMultiEvent && !item?.Campaign) {
						checkIsMultiEvent = true
					}
				})
				setCheckDisable(checkIsMultiEvent)
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
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
		personalInfoRef.current = personalInfo
	}, [personalInfo])

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
		<>
			<div className="sticky bottom-0 z-10">
				<motion.div
					variants={ANIMATION_VARIANT_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="flex justify-around border-t-2 bg-white px-2 pt-4"
					style={{
						borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
						paddingBottom: 'calc(.5rem + env(safe-area-inset-bottom))'
					}}
				>
					<TapAnimationComponent className="flex basis-full justify-center">
						<Link to={`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`} className="w-full text-black">
							<div
								className="flex flex-col w-full justify-center items-center"
								style={
									location.pathname.includes(COMMONS.CLIENT_MEMBERSHIP_ROUTE)
										? {
												color: publicSettings?.PRIMARY_COLOR?.valueString
										  }
										: {}
								}
							>
								{location.pathname.includes(COMMONS.CLIENT_MEMBERSHIP_ROUTE) ? (
									<IdcardFilled className="text-3xl" />
								) : (
									<IdcardOutlined className="text-3xl" />
								)}
								<span className="text-sm font-bold pt-1">お客様情報</span>
							</div>
						</Link>
					</TapAnimationComponent>
					{checkDisable ? (
						<div className="flex basis-full justify-center">
							<Tooltip
								title={`同時に複数の${COMMONS.DEFAULT_SYSTEM_TYPE}予約は\nできません。`}
								trigger={['click']}
								overlayInnerStyle={{
									whiteSpace: 'pre-wrap'
								}}
							>
								<div
									className="flex flex-col w-full justify-center items-center"
									style={{
										color: COMMONS.GRAY_COLOR
									}}
								>
									<ContactsOutlined className="text-3xl" />
									<span className="text-sm font-bold pt-1">{COMMONS.DEFAULT_SYSTEM_TYPE}予約</span>
								</div>
							</Tooltip>
						</div>
					) : (
						<TapAnimationComponent className="flex basis-full justify-center">
							<Link to={`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`} className="w-full text-black">
								<div
									className="flex flex-col w-full justify-center items-center"
									style={
										location.pathname.includes(COMMONS.CLIENT_CATEGORIES_ROUTE)
											? {
													color: publicSettings?.PRIMARY_COLOR?.valueString
											  }
											: {}
									}
								>
									{location.pathname.includes(COMMONS.CLIENT_CATEGORIES_ROUTE) ? (
										<ContactsFilled className="text-3xl" />
									) : (
										<ContactsOutlined className="text-3xl" />
									)}
									<span className="text-sm font-bold pt-1">{`${COMMONS.DEFAULT_SYSTEM_TYPE}予約`}</span>
								</div>
							</Link>
						</TapAnimationComponent>
					)}
					<TapAnimationComponent className="flex basis-full justify-center">
						<Link to={`${COMMONS.CLIENT_CAMPAIGNS_ROUTE}/${liffId}`} className="w-full text-black">
							<div
								className="flex flex-col w-full justify-center items-center"
								style={
									location.pathname.includes(COMMONS.CLIENT_CAMPAIGNS_ROUTE)
										? {
												color: publicSettings?.PRIMARY_COLOR?.valueString
										  }
										: {}
								}
							>
								{location.pathname.includes(COMMONS.CLIENT_CAMPAIGNS_ROUTE) ? (
									<ScheduleFilled className="text-3xl" />
								) : (
									<ScheduleOutlined className="text-3xl" />
								)}
								<span className="text-sm font-bold pt-1">キャンペーン</span>
							</div>
						</Link>
					</TapAnimationComponent>
					<TapAnimationComponent className="flex basis-full justify-center">
						<Link to={`${COMMONS.CLIENT_REGISTRATIONS_ROUTE}/${liffId}`} className="w-full text-black">
							<div
								className="flex flex-col w-full justify-center items-center"
								style={
									location.pathname.includes(COMMONS.CLIENT_REGISTRATIONS_ROUTE)
										? {
												color: publicSettings?.PRIMARY_COLOR?.valueString
										  }
										: {}
								}
							>
								{location.pathname.includes(COMMONS.CLIENT_REGISTRATIONS_ROUTE) ? (
									<ScheduleFilled className="text-3xl" />
								) : (
									<ScheduleOutlined className="text-3xl" />
								)}
								<span className="text-sm font-bold pt-1">予約情報</span>
							</div>
						</Link>
					</TapAnimationComponent>
				</motion.div>
			</div>
		</>
	)
}

export default BottomMenuBar
