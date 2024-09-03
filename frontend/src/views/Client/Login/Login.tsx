import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { message } from 'antd'
import { useQuery } from '@tanstack/react-query'
import liff from '@line/liff'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { AxiosError } from 'axios'

const Login = (props) => {
	const { liffId } = useParams()
	const [searchParams] = useSearchParams()
	// const membership = searchParams.get('membership')
	// const registrations = searchParams.get('registrations')
	const campaign = searchParams.get('campaign')

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const [accessToken, setAccessToken] = useState(undefined)

	useQuery([API.QUERY_KEY_CLIENT_PERSONAL_INFO, accessToken], () => API.CLIENT_GET_PERSONAL_INFO(accessToken), {
		enabled: !!accessToken,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				if (response?.data?.isRegistered) {
					// if (membership) {
					navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
					// } else if (registrations || localStorage.getItem('registrations')) {
					// 	navigate(`${COMMONS.CLIENT_REGISTRATIONS_ROUTE}/${liffId}`)
					// }
					// else if (localStorage.getItem('campaign')) {
					// 	navigate(`${COMMONS.CLIENT_CAMPAIGNS_ROUTE}/${liffId}`)
					// } else {
					// 	navigate(`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`)
					// }
				} else {
					if (campaign) {
						// navigate(`${COMMONS.CLIENT_REGISTER_ROUTE}/${liffId}?campaign=${campaign}`)
					} else {
						navigate(`${COMMONS.CLIENT_REGISTER_ROUTE}/${liffId}`)
					}
				}
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

	const handleLineLogin = () => {
		liff.getFriendship()
			.then((data) => {
				if (data.friendFlag) {
					setAccessToken(liff.getAccessToken())
				} else {
					navigate(COMMONS.LINE_FRIEND_ROUTE)
				}
			})
			.catch((e) => {
				navigate(COMMONS.LINE_FRIEND_ROUTE)
			})
	}

	useEffect(() => {
		setTimeout(() => {
			liff.init({
				liffId: liffId
			})
				.then(() => {
					if (!liff.isLoggedIn()) {
						liff.login()
					}
					if (searchParams.get('campaign')) {
						localStorage.setItem('campaign', searchParams.get('campaign'))
					}
					if (import.meta.env.VITE_APP_ENV === 'PRODUCTION') {
						if (liff.isInClient()) {
							handleLineLogin()
						} else {
							navigate(COMMONS.LINE_ACCESS_ROUTE)
						}
					} else {
						handleLineLogin()
					}
				})
				.catch((err) => {
					// message.error({content: COMMONS.ERROR_SYSTEM_MSG, key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY})
				})
		}, 500)
		// eslint-disable-next-line
	}, [])

	return <></>
}

export default Login
