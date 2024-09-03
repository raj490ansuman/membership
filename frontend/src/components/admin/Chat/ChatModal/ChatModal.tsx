import { SendOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, message, Modal, Row, Tooltip } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, TapAnimationComponent } from '@/components'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { motion } from 'framer-motion'
import { AxiosError } from 'axios'
import UserChatMessage from '@/components/common/ChatMessage/UserChatMessage'
import ManagerChatMessage from '@/components/common/ChatMessage/ManagerChatMessage'

const { TextArea } = Input

const ChatModal = (props) => {
	const { publicSettings, currentMember, isChatModalVisible, hideChatModal } = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const currentMemberRef = useRef()
	const messageContainerRef = useRef(null)
	const [chatForm] = Form.useForm()

	const [chats, setChats] = useState<ChatMessage[]>([])

	const scrollToMessageContainer = () => {
		if (messageContainerRef.current) {
			setTimeout(() => {
				messageContainerRef?.current?.scrollIntoView({ behavior: 'smooth' })
			}, 100)
		}
	}

	useQuery(
		[API.QUERY_KEY_ADMIN_CHATS, currentMember?.memberId],
		() => API.ADMIN_GET_CHATS(currentMember),
		{
			enabled: !!(currentMember?.memberId && isChatModalVisible),
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setChats(response?.data || [])
					scrollToMessageContainer()
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
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
		},
	)

	const sendChatMutation = useMutation(API.ADMIN_SEND_CHAT, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_MESSAGE_SENT_MSG)
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_CHATS] })
			chatForm.resetFields()
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
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

	useEffect(() => {
		currentMemberRef.current = currentMember
	}, [currentMember])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_CHAT, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.memberId === currentMemberRef.current?.memberId) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_ADMIN_CHATS],
					})
				}
			}
		})

		return () => {
			socket.off(API.SOCKET_CHAT)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const handleChat = (data) => {
		const paramData = {
			contents: data?.contents,
			memberId: currentMember?.memberId,
		}

		sendChatMutation.mutate(paramData)
	}

	return (
		<Modal
			title={`${
				currentMember?.lastName && currentMember?.firstName
					? `${currentMember?.lastName || 'ー'} ${currentMember?.firstName || 'ー'}`
					: currentMember?.displayName || 'ー'
			}様`}
			open={isChatModalVisible}
			onCancel={hideChatModal}
			footer={null}
			centered
			destroyOnClose
		>
			<BaseAnimationComponent>
				<motion.div
					className='pb-4 overflow-auto'
					style={{
						minHeight: '60vh',
						maxHeight: '60vh',
					}}
				>
					{chats.map((chat) => (
						<Row key={chat?.chatId}>
							<Col span={22} offset={chat?.source === 'user' ? 0 : 2}>
								<div className='m-1'>
									{chat?.source === 'user' ? (
										<UserChatMessage
											chat={chat}
											currentMember={currentMember}
										/>
									) : (
										<ManagerChatMessage
											chat={chat}
											publicSettings={publicSettings}
										/>
									)}
								</div>
							</Col>
						</Row>
					))}
					<div ref={messageContainerRef}></div>
				</motion.div>
				<div
					className='py-4 border-t-2 border-solid'
					style={{
						borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
					}}
				>
					<Row>
						<Col span={24}>
							<Form
								form={chatForm}
								onFinish={handleChat}
								size='large'
								colon={false}
								requiredMark={false}
								initialValues={{
									contents: undefined,
								}}
							>
								<Row align='top' gutter={[8, 8]}>
									<Col span={24}>
										<div className='flex justify-end'>
											<Tooltip title='送信' placement='top'>
												<TapAnimationComponent>
													<Button
														type='primary'
														size='large'
														style={{
															borderColor: COMMONS.WHITE_COLOR,
														}}
														icon={
															<SendOutlined
																style={{
																	color: COMMONS.WHITE_COLOR,
																}}
															/>
														}
														htmlType='submit'
														loading={sendChatMutation.isLoading}
													/>
												</TapAnimationComponent>
											</Tooltip>
										</div>
									</Col>
									<Col span={24}>
										<Form.Item
											className='block'
											name='contents'
											rules={[
												{
													required: true,
													whitespace: true,
													message: 'メッセージを入力してください',
												},
											]}
										>
											<TextArea
												allowClear
												bordered
												showCount
												autoSize={{ minRows: 5, maxRows: 10 }}
												maxLength={5000}
												placeholder='メッセージを入力してください'
												autoFocus={true}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>
				</div>
			</BaseAnimationComponent>
		</Modal>
	)
}

export default ChatModal
