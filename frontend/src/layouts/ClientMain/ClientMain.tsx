import liff from '@line/liff'
import { ConfigProvider, Layout, message, Spin } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { io } from 'socket.io-client'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ClientBottomMenuBarComponent } from '@/components'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { queries } from '@/queries'

const { Content } = Layout

const ClientMain = (props) => {
	const { children } = props
	const { liffId } = useParams()
	const [searchParams] = useSearchParams()

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()

	const personalInfoRef = useRef()

	const [accessToken, setAccessToken] = useState(undefined)
	const [personalInfo, setPersonalInfo] = useState({})

	const layoutContext = useLayoutConfigContext()
	const { logo, favicon, storePic, publicSettings } = layoutContext

	useQuery([API.QUERY_KEY_CLIENT_PERSONAL_INFO, accessToken], () => API.CLIENT_GET_PERSONAL_INFO(accessToken), {
		enabled: !!accessToken,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setPersonalInfo(response?.data || {})
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
		try {
			setAccessToken(liff.getAccessToken())
		} catch (err) {
			navigate(COMMONS.CLIENT_LOGIN_ROUTE + '/' + liffId)
		}

		// eslint-disable-next-line
	}, [liffId])

	useEffect(() => {
		let link = document.querySelector("link[rel~='icon']")

		if (!link) {
			link = document.createElement('link')
			link.rel = 'icon'
			document.getElementsByTagName('head')[0].appendChild(link)
		}

		if (favicon) {
			link.href = API.SETTINGS_UPLOADS_URL + favicon
		}
	}, [favicon])

	useEffect(() => {
		personalInfoRef.current = personalInfo
	}, [personalInfo])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_SYSTEM_SETTING, (response) => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_PUBLIC_SETTINGS]
			})

			if (response !== undefined && Object.keys(response).length !== 0) {
				if (
					response?.keys &&
					Array.isArray(response.keys) &&
					(response.keys.includes(API.SETTINGS_KEY_BOOK_LIMIT_ENABLED) ||
						response.keys.includes(API.SETTINGS_KEY_BOOK_LIMIT_DAY) ||
						response.keys.includes(API.SETTINGS_KEY_BOOK_LIMIT_HOUR) ||
						response.keys.includes(API.SETTINGS_KEY_BOOK_LIMIT_MINUTE))
				) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_CLIENT_CATEGORY_DETAIL]
					})
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_CLIENT_OCCASION_DETAIL]
					})
				}
			}
		})

		socket.on(API.SOCKET_FAVICON, () => {
			queryClient.invalidateQueries({ queryKey: queries.settings.favicon.queryKey })
		})

		socket.on(API.SOCKET_LOGO, () => {
			queryClient.invalidateQueries({ queryKey: queries.settings.logo.queryKey })
		})

		socket.on(API.SOCKET_STORE_PIC, () => {
			queryClient.invalidateQueries({ queryKey: queries.settings.storePic.queryKey })
		})

		socket.on(API.SOCKET_MEMBER, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.memberId === personalInfoRef.current?.memberId) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_CLIENT_PERSONAL_INFO]
					})
				}
			}
		})

		if (searchParams.get('registrations')) {
			localStorage.setItem('registrations', searchParams.get('registrations'))
		}

		return () => {
			socket.off(API.SOCKET_SYSTEM_SETTING)
			socket.off(API.SOCKET_FAVICON)
			socket.off(API.SOCKET_LOGO)
			socket.off(API.SOCKET_MEMBER)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}, [])

	const childrenWithProps = React.Children.map(children, (element) =>
		React.cloneElement(element, {
			logo: logo,
			storePic: storePic,
			publicSettings: publicSettings,
			accessToken: accessToken,
			setAccessToken: setAccessToken,
			personalInfo: personalInfo,
			isMountedRef: isMountedRef
		})
	)

	return (
		<>
			<Helmet>
				{publicSettings?.TITLE?.valueString ? <title>{publicSettings?.TITLE?.valueString}</title> : ''}
			</Helmet>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: publicSettings?.PRIMARY_COLOR?.valueString,
						colorLink: publicSettings?.PRIMARY_COLOR?.valueString,
						colorLinkActive: publicSettings?.PRIMARY_COLOR?.valueString,
						colorLinkHover: publicSettings?.PRIMARY_COLOR?.valueString
					}
				}}
			>
				<div className="flex flex-col w-full min-h-full">
					<Spin
						spinning={
							useIsFetching({
								fetchStatus: 'fetching'
							}) > 0
								? true
								: false
						}
						style={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							zIndex: 1001
						}}
					>
						<Layout className="min-h-screen bg-white">
							<Content>
								<div className="w-full m-auto">{childrenWithProps}</div>
							</Content>
							{/* <ClientBottomMenuBarComponent
								publicSettings={publicSettings}
								personalInfo={personalInfo}
								accessToken={accessToken}
							/> */}
						</Layout>
					</Spin>
				</div>
			</ConfigProvider>
		</>
	)
}

export default ClientMain
