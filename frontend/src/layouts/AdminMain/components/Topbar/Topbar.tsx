import React from 'react'
import { Row, Col, Button, Dropdown, message } from 'antd'
import { MenuOutlined, UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'

const CustomMenuButton = styled(Button)`
	& {
		border: none;
		box-shadow: none;
	}

	&:hover {
		border: none;
		box-shadow: none;
	}

	&:focus {
		border: none;
		box-shadow: none;
	}

	&:active {
		border: none;
		box-shadow: none;
	}
`

const Topbar = (props) => {
	const { isHamburger, collapseToggle, auth } = props
	const { publicSettings } = useLayoutConfigContext()

	const navigate = useNavigate()

	const logoutMutation = useMutation(API.ADMIN_LOGOUT, {
		onSuccess: (response) => {
			message.success(COMMONS.SUCCESS_LOGOUT_MSG)
			navigate(COMMONS.ADMIN_LOGIN_ROUTE)
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

	const logoutHandler = () => {
		logoutMutation.mutate()
	}

	const handleMenuClick = (e) => {
		switch (e.key) {
			case 'logout':
				logoutHandler()
				break
			default:
				break
		}
	}

	const menuProps = {
		onClick: handleMenuClick,
		items: [
			{
				key: 'logout',
				label: <span className="text-sm">{'ログアウト'}</span>,
				icon: (
					<LogoutOutlined
						style={{
							color: publicSettings?.PRIMARY_COLOR?.valueString
						}}
						className="text-base leading-none"
					/>
				)
			}
		]
	}

	return (
		<>
			{isHamburger ? (
				<Row justify="space-between" align="middle" className="px-4">
					<Col className="cursor-pointer">
						<CustomMenuButton icon={<MenuOutlined style={{ fontSize: 18 }} />} onClick={collapseToggle} />
					</Col>
					<Col>
						<Row wrap={false} align="middle" justify="end">
							<Col>
								<Dropdown arrow trigger={['click']} menu={menuProps}>
									<Button
										type="text"
										size="large"
										icon={
											<UserOutlined
												className="text-xl"
												style={{
													color: publicSettings?.PRIMARY_COLOR?.valueString
												}}
											/>
										}
									>
										<span className="text-xs font-bold">
											{(auth.username && auth.username.toUpperCase()) || ''}
										</span>
										<DownOutlined />
									</Button>
								</Dropdown>
							</Col>
						</Row>
					</Col>
				</Row>
			) : (
				<Row justify="end" align="middle" className="px-4">
					<Col>
						<Dropdown arrow trigger={['click']} menu={menuProps}>
							<Button
								type="text"
								size="large"
								icon={
									<UserOutlined
										className="text-xl"
										style={{
											color: publicSettings?.PRIMARY_COLOR?.valueString
										}}
									/>
								}
							>
								<span className="text-xs font-bold">
									{(auth.username && auth.username.toUpperCase()) || ''}
								</span>
								<DownOutlined />
							</Button>
						</Dropdown>
					</Col>
				</Row>
			)}
		</>
	)
}

export default Topbar
