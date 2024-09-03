import React, { useState, useEffect } from 'react'
import { ConfigProvider, Layout, Spin } from 'antd'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { io } from 'socket.io-client'
import { useSearchParams } from 'react-router-dom'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { queries } from '@/queries'

const { Content } = Layout

const Minimal = (props) => {
	const { children } = props
	const [searchParams] = useSearchParams()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()

	const layoutContext = useLayoutConfigContext()
	const { logo, favicon, storePic, publicSettings } = layoutContext

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
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_SYSTEM_SETTING, () => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_PUBLIC_SETTINGS]
			})
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

		return () => {
			socket.off(API.SOCKET_SYSTEM_SETTING)
			socket.off(API.SOCKET_FAVICON)
			socket.off(API.SOCKET_LOGO)
			socket.off(API.SOCKET_STORE_PIC)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const childrenWithProps = React.Children.map(children, (element) =>
		React.cloneElement(element, {
			logo: logo,
			storePic: storePic,
			publicSettings: publicSettings
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
						<Layout className="min-h-screen">
							<Content className="bg-white">{childrenWithProps}</Content>
						</Layout>
					</Spin>
				</div>
			</ConfigProvider>
		</>
	)
}

export default Minimal
