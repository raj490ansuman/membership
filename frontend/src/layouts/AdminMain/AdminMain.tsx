import { Button, ConfigProvider, Descriptions, Grid, Layout, message, Modal, Spin } from 'antd'
import { QrcodeOutlined } from '@ant-design/icons'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, TapAnimationComponent } from '@/components'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useIsFetching, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Sidebar, Topbar } from './components'
import QrReader from 'react-qr-reader'
import { decode } from 'base-64'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import moment from 'moment'
import { motion } from 'framer-motion'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { queries } from '@/queries'

const ButtonQRCode = styled.div`
	top: 64px;
	right: 0;
	position: fixed;
	background: white;
	border-radius: 5px;
	border: 1px solid #99ca29;
	svg {
		width: 60px;
		height: 60px;
	}
`

const AdminMain = (props) => {
	const { children } = props
	const navigate = useNavigate()
	const { Header, Sider, Content } = Layout
	const { useBreakpoint } = Grid

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()

	const [isCollapsed, setIsCollapsed] = useState(false)

	const [auth, setAuth] = useState({})
	const layoutContext = useLayoutConfigContext()
	const { logo, favicon, storePic, publicSettings } = layoutContext

	const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false)
	const [registration, setRegistration] = useState()
	const [bookingConfirmation, setBookingConfirmation] = useState(false)
	const [checkAttended, setCheckAttended] = useState(false)

	const breakpoint = useBreakpoint()
	const isHamburger = !breakpoint.xl

	const collapse = () => {
		setIsCollapsed(true)
	}

	const expand = () => {
		setIsCollapsed(false)
	}

	const collapseToggle = () => {
		if (isCollapsed) {
			expand()
		} else {
			collapse()
		}
	}

	useQuery([API.QUERY_KEY_ADMIN_AUTH], API.ADMIN_GET_AUTH, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				if (response?.data) {
					setAuth(response.data)
				} else {
					setAuth({})
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
	})

	const childrenWithProps = React.Children.map(children, (element) =>
		React.cloneElement(element, {
			publicSettings: publicSettings,
			auth: auth,
			storePic: storePic
		})
	)

	// useEffect(() => {
	// 	if (isHamburger) {
	// 		collapse()
	// 	} else {
	// 		expand()
	// 	}
	// }, [isHamburger])

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
			socket.off(API.SOCKET_FAVICON)
			socket.off(API.SOCKET_LOGO)
			socket.off(API.SOCKET_STORE_PIC)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const hideQRModal = () => {
		setQrCodeModalVisible(false)
	}

	const showQRModal = () => {
		setQrCodeModalVisible(true)
	}

	const hideBookingConfirmationModal = () => {
		setRegistration()
		setBookingConfirmation(false)
	}

	const showBookingConfirmationModal = () => {
		setBookingConfirmation(true)
	}

	const handleQRCodeError = (err) => {
		console.log(err)
	}

	const checkRegistration = useMutation(API.ADMIN_CONFIRM_REGISTRATION, {
		onSuccess: (data) => {
			setRegistration(data?.data)
			setCheckAttended(!!data?.data?.attended)
			showBookingConfirmationModal()
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
			} else if (error?.response?.status === COMMONS.RESPONSE_BAD_REQUEST_ERROR) {
				message.error({
					content: 'QR is not valid',
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
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

	const registrationUpdateAttendedMutation = useMutation(API.ADMIN_UPDATE_ATTENDED_REGISTRATION, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				setCheckAttended(true)
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

	const handleQRCodeScan = (data) => {
		if (data) {
			if (typeof data === 'string' || data instanceof String) {
				hideQRModal()

				let decodedData = ''
				try {
					decodedData = decode(data).split('-')

					if (decodedData.length === 2) {
						if (decodedData[0] === 'H' && !isNaN(decodedData[1])) {
							checkRegistration.mutate({ registrationId: decodedData[1] })
						} else {
							message.warning({
								content: COMMONS.ERROR_QR_WRONG_MSG,
								key: COMMONS.ERROR_QR_WRONG_MSG
							})
						}
					} else {
						message.warning({
							content: COMMONS.ERROR_QR_WRONG_MSG,
							key: COMMONS.ERROR_QR_WRONG_MSG
						})
					}
				} catch (e) {
					message.warning({
						content: COMMONS.ERROR_QR_WRONG_MSG,
						key: COMMONS.ERROR_QR_WRONG_MSG
					})
				}
			} else {
				message.warning({
					content: COMMONS.ERROR_QR_WRONG_MSG,
					key: COMMONS.ERROR_QR_WRONG_MSG
				})
			}
		}
	}

	const handleUpdateAttended = () => {
		registration?.registrationId &&
			registrationUpdateAttendedMutation.mutate({
				registrationId: registration?.registrationId
			})
	}

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
						<BaseAnimationComponent>
							<Layout className="min-h-full">
								{isHamburger ? (
									isCollapsed ? (
										<div></div>
									) : (
										<div
											onClick={collapse}
											className="absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full z-50"
										></div>
									)
								) : isCollapsed ? (
									<div
										style={{
											flex: '0 0 80px',
											minWidth: '80px',
											maxWidth: '80px',
											overflow: 'hidden'
										}}
									></div>
								) : (
									<div
										style={{
											flex: '0 0 200px',
											minWidth: '200px',
											maxWidth: '200px',
											overflow: 'hidden'
										}}
									></div>
								)}
								<Sider
									theme="light"
									collapsible
									collapsed={isCollapsed}
									collapsedWidth={isHamburger ? 0 : 80}
									trigger={null}
									className="fixed top-0 left-0 h-full shadow z-50"
								>
									<Sidebar
										isHamburger={isHamburger}
										isCollapsed={isCollapsed}
										collapseToggle={collapseToggle}
										auth={auth}
										logo={logo}
										publicSettings={publicSettings}
									/>
								</Sider>
								<Layout className="min-h-screen">
									<Header className="p-0 bg-white shadow">
										<Topbar
											isHamburger={isHamburger}
											collapseToggle={collapseToggle}
											auth={auth}
											publicSettings={publicSettings}
										/>
									</Header>
									<Content className="m-4 bg-white shadow rounded">{childrenWithProps}</Content>
								</Layout>
							</Layout>
						</BaseAnimationComponent>
					</Spin>
				</div>
				{isMobile ? (
					<>
						{/* <ButtonQRCode onClick={showQRModal}>
							<QrcodeOutlined className="text-4xl" />
						</ButtonQRCode>
						<Modal
							visible={qrCodeModalVisible}
							title="QR読み取り"
							onCancel={hideQRModal}
							footer={null}
							centered
							destroyOnClose
						>
							{qrCodeModalVisible ? (
								<QrReader
									delay={300}
									facingMode={'environment'}
									onError={handleQRCodeError}
									onScan={handleQRCodeScan}
									style={{ width: '100%' }}
								/>
							) : (
								''
							)}
						</Modal>
						<Modal
							visible={bookingConfirmation}
							title="予約確認"
							onCancel={hideBookingConfirmationModal}
							footer={null}
							centered
							destroyOnClose
						>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
								<motion.div
									variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
									initial="hidden"
									animate="show"
									exit="hidden"
								>
									<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
										<Descriptions
											column={1}
											labelStyle={{ width: '135px' }}
											contentStyle={{ padding: '0.5rem' }}
											bordered
										>
											{registration?.isManual ? (
												<Descriptions.Item label="氏名">
													<p className="text-sm">
														{`${registration?.Member?.lastName} ${registration?.Member?.firstName}`}
													</p>

													<p>
														{`(${registration?.Member?.lastNameKana} ${registration?.Member?.firstNameKana})`}
													</p>
												</Descriptions.Item>
											) : (
												<Descriptions.Item label="氏名">
													<p className="text-sm">
														{`${registration?.Member?.displayName}` || 'ー'}
													</p>

													<p>
														{`${registration?.Member?.['memberAttributeId1']}` || 'ー'}
													</p>
												</Descriptions.Item>
											)} */}
						{/* <Descriptions.Item label="電話番号">
                        {registration?.isManual ? (
                          <p className="text-sm">
                            {registration?.Member?.telephone}
                          </p>
                        ) : (
                          <p className="text-sm">
                            {`${registration?.Member?.["memberAttributeId2"]}` ||
                              "ー"}
                          </p>
                        )}
                      </Descriptions.Item> */}
						{/* <Descriptions.Item label={`${COMMONS.DEFAULT_SYSTEM_TYPE}`}>
												<p className="text-sm">{registration?.Category?.title || 'ー'}</p>
											</Descriptions.Item>

											<Descriptions.Item label="日時">
												<p className="text-sm">
													{registration?.Occurrence?.startDate
														? moment(registration.Occurrence.startDate).format(
																'YYYY年M月D日（ddd）'
														  )
														: 'ー'}
												</p>
												<p className="text-sm mt-2">
													<span
														className="inline-block rounded-full text-white px-2 mr-1 mb-1"
														style={{
															backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString
														}}
													>
														{registration?.Occurrence?.startAt
															? moment(registration.Occurrence.startAt).format('HH:mm')
															: 'ー'}
														～
														{registration?.Occurrence?.endAt
															? moment(registration.Occurrence.endAt).format('HH:mm')
															: 'ー'}
													</span>
												</p>
											</Descriptions.Item>
											<Descriptions.Item label="メッセージ">
												<p className="text-sm whitespace-pre-wrap">
													{registration?.message || 'ー'}
												</p>
											</Descriptions.Item>
											{registration?.note?.map((item) => (
												<Descriptions.Item label={item?.lable}>
													<p className="text-sm whitespace-pre-wrap">{item?.value || 'ー'}</p>
												</Descriptions.Item>
											))}
										</Descriptions>
										<div className="flex flex-col mb-8 px-4">
											<div className="flex justify-center mt-4">
												<TapAnimationComponent>
													<Button
														className="mr-4"
														size="large"
														onClick={hideBookingConfirmationModal}
													>
														閉じる
													</Button>

													<Button
														type="primary"
														size="large"
														disabled={checkAttended}
														onClick={handleUpdateAttended}
													>
														参加
													</Button>
												</TapAnimationComponent>
											</div>
										</div>
									</motion.div>
								</motion.div>
							</motion.div>
						</Modal> */}
					</>
				) : (
					''
				)}
			</ConfigProvider>
		</>
	)
}

export default AdminMain
