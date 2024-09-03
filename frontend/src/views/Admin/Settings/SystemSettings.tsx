import { SaveOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Form, Input, Row, Upload, message } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, PageHeaderComponent, TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { useQueryClient } from '@tanstack/react-query'
import { queries, useSetFaviconMutation, useSetLogoMutation, useSetPublicSettingsMutation } from '@/queries'
import { UploadChangeParam } from 'antd/es/upload'
import { UploadFile } from 'antd/lib'
import { useEffect, useMemo } from 'react'

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

export const SystemSettings = (props: Props) => {
	const { auth } = props
	const queryClient = useQueryClient()

	const [systemColorForm] = Form.useForm()
	const [systemTitleForm] = Form.useForm()

	const layoutContext = useLayoutConfigContext()
	const { logo, favicon, publicSettings } = layoutContext

	const setLogoMutation = useSetLogoMutation()
	const setFaviconMutation = useSetFaviconMutation()
	const setPublicSettingsMutation = useSetPublicSettingsMutation()

	const formDefaultValues = useMemo(
		() => ({
			systemTitleFormItem: publicSettings?.TITLE?.valueString || '',
			systemColorFormItem: COMMONS.THEME_COLORS.find((c) => c === publicSettings?.PRIMARY_COLOR?.valueString)
				? ''
				: publicSettings?.PRIMARY_COLOR?.valueString
		}),
		[publicSettings?.TITLE?.valueString, publicSettings?.PRIMARY_COLOR?.valueString]
	)

	// Set form to latest defaults when they come in
	useEffect(() => {
		systemColorForm.resetFields()
	}, [systemColorForm, formDefaultValues])
	useEffect(() => {
		systemTitleForm.resetFields()
	}, [systemTitleForm, formDefaultValues])

	const setLogo = (upload: UploadFile) => {
		setLogoMutation.mutate(
			{
				body: {
					logo: upload as unknown as File
				}
			},
			{
				onSuccess: () => {
					message.success(COMMONS.SUCCESS_UPLOAD_MSG)
					queryClient.invalidateQueries({ queryKey: queries.settings.logo.queryKey })
				}
			}
		)
	}
	const setFavicon = async (upload: UploadFile) => {
		setFaviconMutation.mutate(
			{
				body: {
					favicon: upload as unknown as File
				}
			},
			{
				onSuccess: () => {
					message.success(COMMONS.SUCCESS_UPLOAD_MSG)
					queryClient.invalidateQueries({ queryKey: queries.settings.favicon.queryKey })
				}
			}
		)
	}
	const setPublicSettings = (param: { key: string; label: string; isPublic: boolean; valueString: any }) => {
		setPublicSettingsMutation.mutate(
			{ params: { key: param.key }, body: param },
			{
				onSuccess: () => {
					message.success(COMMONS.SUCCESS_UPDATE_MSG)
					// As admin, we need to invalidate system settings instead of public settings because system settings takes precendence and contains more than public settings
					queryClient.invalidateQueries({
						queryKey: queries.settings.settings.queryKey
					})
				}
			}
		)
	}

	const handleSystemColor = (data: any) => {
		const paramData = {
			key: API.SETTINGS_KEY_SYSTEM_COLOR,
			label: API.SETTINGS_LABEL_SYSTEM_COLOR,
			isPublic: true,
			valueString: data.systemColorFormItem
		}

		if (publicSettings?.PRIMARY_COLOR?.valueString !== data.systemColorFormItem) {
			setPublicSettings(paramData)
		}
	}
	const handleSystemTitle = (data: FormData) => {
		const paramData = {
			key: API.SETTINGS_KEY_SYSTEM_TITLE,
			label: API.SETTINGS_LABEL_SYSTEM_TITLE,
			isPublic: true,
			valueString: data.systemTitleFormItem
		}

		if (publicSettings?.TITLE?.valueString !== data.systemTitleFormItem) {
			setPublicSettings(paramData)
		}
	}

	const LogoSettings = () => (
		<Card title="ロゴ設定" className="h-full">
			<TapAnimationComponent>
				<Upload
					accept=".jpg, .jpeg, .png, .svg"
					listType="picture-card"
					showUploadList={false}
					beforeUpload={() => {
						return false
					}}
					onChange={async (param: UploadChangeParam<UploadFile>) => {
						setLogo(param.file)
					}}
				>
					{logo ? (
						<img
							src={`${API.SETTINGS_UPLOADS_URL}${logo}`}
							alt="ロゴ"
							style={{
								maxWidth: '100px',
								maxHeight: '100px'
							}}
						/>
					) : (
						'アップロード'
					)}
				</Upload>
			</TapAnimationComponent>
		</Card>
	)

	const FaviconSettings = () => (
		<Card title="ファビコン設定" className="h-full">
			<TapAnimationComponent>
				<Upload
					accept=".ico"
					listType="picture-card"
					showUploadList={false}
					beforeUpload={() => {
						return false
					}}
					onChange={async (param: UploadChangeParam<UploadFile>) => {
						setFavicon(param.file)
					}}
				>
					{favicon ? (
						<img
							src={`${API.SETTINGS_UPLOADS_URL}${favicon}`}
							alt="ファビコン "
							className="object-contain max-w-full max-h-full m-auto"
						/>
					) : (
						'アップロード'
					)}
				</Upload>
			</TapAnimationComponent>
		</Card>
	)

	const TitleSettings = () => (
		<Card title="タイトル設定" className="h-full">
			<Form
				form={systemTitleForm}
				onFinish={handleSystemTitle}
				layout="vertical"
				preserve={false}
				initialValues={formDefaultValues}
				size="large"
			>
				<Row justify="center">
					<Col span={24}>
						<Form.Item
							name="systemTitleFormItem"
							rules={[
								{
									required: true,
									message: '必須です'
								},
								{
									whitespace: true,
									message: '必須です'
								}
							]}
						>
							<Input
								placeholder="例：○○システム"
								onPressEnter={(e: any) => e.preventDefault()}
								allowClear
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row justify="center">
					<Col>
						<TapAnimationComponent>
							<Button
								icon={<SaveOutlined />}
								type="primary"
								htmlType="submit"
								loading={setPublicSettingsMutation.isLoading}
							>
								設定する
							</Button>
						</TapAnimationComponent>
					</Col>
				</Row>
			</Form>
		</Card>
	)

	const ThemeColorSettings = () => (
		<Card title="色設定">
			<Row gutter={[4, 4]} justify="center">
				{COMMONS.THEME_COLORS.map((color) => (
					<Col key={color}>
						<div
							className="w-6 h-6 rounded-full cursor-pointer"
							style={{
								backgroundColor: color,
								border:
									publicSettings?.PRIMARY_COLOR?.valueString === color ? '2px solid white' : 'none',
								boxShadow:
									publicSettings?.PRIMARY_COLOR?.valueString === color
										? 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
										: 'none'
							}}
							onClick={() =>
								publicSettings?.PRIMARY_COLOR?.valueString === color
									? ''
									: handleSystemColor({
											systemColorFormItem: color
									  })
							}
						></div>
					</Col>
				))}
			</Row>
			<Divider />
			<Row justify="center">
				<Form
					form={systemColorForm}
					name="systemColorForm"
					onFinish={handleSystemColor}
					layout="vertical"
					preserve={false}
					initialValues={formDefaultValues}
					size="large"
				>
					<Row justify="center">
						<Col>
							<Form.Item
								name="systemColorFormItem"
								rules={[
									{
										required: true,
										message: '必須です'
									},
									{
										whitespace: true,
										message: '必須です'
									}
								]}
							>
								<Input
									addonBefore="カスタム色"
									placeholder="例：#060606"
									onPressEnter={(e: any) => e.preventDefault()}
									allowClear
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row justify="center">
						<Col>
							<TapAnimationComponent>
								<Button
									icon={<SaveOutlined />}
									type="primary"
									htmlType="submit"
									loading={setPublicSettingsMutation.isLoading}
								>
									設定する
								</Button>
							</TapAnimationComponent>
						</Col>
					</Row>
				</Form>
			</Row>
		</Card>
	)
	return (
		auth &&
		auth.auth &&
		auth.auth === COMMONS.AUTH_MASTER && (
			<BaseAnimationComponent>
				<PageHeaderComponent publicSettings={publicSettings} title="設定" />
				<Card bordered={false}>
					<Row gutter={[16, 16]}>
						<Col xs={24}>
							<Card
								title="システム設定"
								bordered={true}
								type="inner"
								styles={{
									header: {
										color: publicSettings?.PRIMARY_COLOR?.valueString,
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
									}
								}}
								style={{
									borderColor: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								<MotionRowComponent
									gutter={[8, 8]}
									variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
									initial="hidden"
									animate="show"
									exit="hidden"
								>
									<MotionColComponent
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										xs={24}
										md={12}
										xl={8}
										className="text-center"
									>
										<LogoSettings />
									</MotionColComponent>
									<MotionColComponent
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										xs={24}
										md={12}
										xl={8}
										className="text-center"
									>
										<FaviconSettings />
									</MotionColComponent>
									<MotionColComponent
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										xs={24}
										md={12}
										xl={8}
										className="text-center"
									>
										<TitleSettings />
									</MotionColComponent>
									<MotionColComponent
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										xs={24}
										md={12}
										xl={24}
										className="text-center h-full"
									>
										<ThemeColorSettings />
									</MotionColComponent>
								</MotionRowComponent>
							</Card>
						</Col>
					</Row>
				</Card>
			</BaseAnimationComponent>
		)
	)
}

export default SystemSettings
