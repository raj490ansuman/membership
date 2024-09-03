import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, message } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const Login = (props: Props) => {
	const { logo, publicSettings } = props
	const navigate = useNavigate()
	const [form] = Form.useForm()

	useQuery([API.QUERY_KEY_ADMIN_CHECK_SESSION], API.ADMIN_CHECK_SESSION, {
		onSuccess: () => {
			navigate(COMMONS.ADMIN_MEMBERS_ROUTE)
		},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
				})
			}
		},
		meta: {
			shouldBeHandledByGlobalErrorHandler: false
		}
	})

	const loginMutation = useMutation(API.ADMIN_LOGIN, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_LOGIN_MSG)
			navigate(COMMONS.ADMIN_MEMBERS_ROUTE)
		},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				message.warning(COMMONS.ERROR_ADMIN_LOGIN_MISMATCH_MSG)
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

	const loginHandler = (formData: FormData) => {
		const data = {
			username: formData['loginUsername'],
			password: formData['loginPassword']
		}

		loginMutation.mutate(data)
	}

	return (
		<>
			<BaseAnimationComponent>
				<div className="flex h-screen">
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
						className="w-11/12 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 p-5 m-auto"
					>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex mb-4">
							<img
								src={logo ? API.SETTINGS_UPLOADS_URL + logo : 'logo.svg'}
								alt="ロゴ"
								className="mx-auto rounded max-w-full"
								style={{ maxHeight: '150px' }}
							/>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-10">
							<p className="text-lg text-center">
								{publicSettings?.TITLE?.valueString || import.meta.env.VITE_APP_SYSTEM_NAME}
							</p>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Form name="loginForm" onFinish={loginHandler} size="large" form={form}>
								<Form.Item
									name="loginUsername"
									rules={[
										{
											required: true,
											message: 'ユーザー名を入力してください'
										}
									]}
								>
									<Input
										disabled={loginMutation.isLoading}
										name="loginUsername"
										autoCapitalize="none"
										prefix={<UserOutlined />}
										placeholder="ユーザー名"
										autoComplete="username"
										allowClear
									/>
								</Form.Item>
								<Form.Item
									name="loginPassword"
									rules={[
										{
											required: true,
											message: 'パスワードを入力してください'
										}
									]}
								>
									<Input.Password
										disabled={loginMutation.isLoading}
										name="loginPassword"
										prefix={<LockOutlined />}
										type="password"
										placeholder="パスワード"
										autoComplete="current-password"
									/>
								</Form.Item>
								<Form.Item className="text-center">
									<TapAnimationComponent>
										<Button
											type="primary"
											htmlType="submit"
											className="px-8"
											loading={loginMutation.isLoading}
										>
											ログイン
										</Button>
									</TapAnimationComponent>
								</Form.Item>
							</Form>
							{import.meta.env.VITE_APP_ENV !== 'PRODUCTION' &&
								import.meta.env.VITE_APP_TEST_USER &&
								import.meta.env.VITE_APP_TEST_USER_PASSWORD && (
									<>
										<Divider />
										<div className="text-center">
											<TapAnimationComponent>
												<Button
													type="primary"
													className="m-1"
													loading={loginMutation.isLoading}
													onClick={() => {
														const data = {
															username: import.meta.env.VITE_APP_TEST_USER,
															password: import.meta.env.VITE_APP_TEST_USER_PASSWORD
														}

														loginMutation.mutate(data)
													}}
												>
													テストログイン
												</Button>
											</TapAnimationComponent>
										</div>
									</>
								)}
						</motion.div>
					</motion.div>
				</div>
			</BaseAnimationComponent>
		</>
	)
}

export default Login
