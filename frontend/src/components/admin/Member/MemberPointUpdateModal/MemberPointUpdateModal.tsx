import { EyeOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {
	Button,
	Col,
	Image,
	Tag,
	Modal,
	Row,
	Descriptions,
	Divider,
	Form,
	Input,
	InputNumber,
	Switch,
	message,
	DatePicker,
	Alert
} from 'antd'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { API, COMMONS } from '@/utils'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`
const MemberPointUpdateModal = (props: {
	publicSettings?: any
	confirmMember?: any
	isMemberVisit?: any
	isMemberRenewConfirmModalVisible?: any
	hideMemberRenewConfirmModal?: any
	memberEditMutation?: any
	currentMember?: any
	renewConfirmPickerValue?: any
	setRenewConfirmPickerValue?: any
}) => {
	const {
		isMemberVisit,
		isMemberRenewConfirmModalVisible,
		hideMemberRenewConfirmModal,
		confirmMember,
		publicSettings,
		memberEditMutation,
		setRenewConfirmPickerValue
	} = props

	const [memberPointForm] = Form.useForm()
	const [memberRenewConfirmForm] = Form.useForm()
	const queryClient: any = useQueryClient()
	const [isRenewConfirmPickerOpen, setIsRenewConfirmPickerOpen] = useState(false)
	const navigate = useNavigate()

	const memberRenewMutation = useMutation(API.ADMIN_RENEW_MEMBER, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			hideMemberRenewConfirmModal()
			queryClient.invalidateQueries(API.QUERY_KEY_ADMIN_MEMBERS)
		},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning(COMMONS.ERROR_SESSION_MSG)
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error(COMMONS.ERROR_SYSTEM_MSG)
			} else {
				message.error(COMMONS.ERROR_SYSTEM_MSG)
			}
		}
	})
	const handleMemberPointUpdate = (data: { kakeruPointIsAdd: boolean; kakeruPoint: string }) => {
		const paramData = {
			memberSince: dayjs(confirmMember?.memberSince).format('YYYY-MM-DD'),
			kakeruPointIsAdd: data.kakeruPointIsAdd,
			kakeruPoint: data.kakeruPoint,
			memberId: confirmMember?.memberId,
			memberVisitId: confirmMember?.memberVisitId,
			visitDate: dayjs().toISOString()
		}

		memberEditMutation.mutate(paramData)
	}

	const handleMemberRenew = (data: any) => {
		const paramData = {
			memberId: confirmMember?.memberId,
			activeUntil: dayjs(data.activeUntil).format('YYYY-MM-DD')
		}

		memberRenewMutation.mutate(paramData)
	}
	useEffect(() => {
		if (isMemberRenewConfirmModalVisible && confirmMember?.memberId) {
			memberPointForm.setFieldsValue({
				kakeruPoint: 0 // confirmMember?.kakeruPoint
			})
			memberRenewConfirmForm.setFieldsValue({
				activeUntil: confirmMember?.activeUntil
					? dayjs(confirmMember?.activeUntil).add(1, 'year').subtract(1, 'day')
					: dayjs(confirmMember?.memberSince).add(1, 'year').subtract(1, 'day')
			})
		}
	}, [confirmMember, memberPointForm, isMemberRenewConfirmModalVisible, memberRenewConfirmForm])
	return (
		<>
			<Modal
				title={`${isMemberVisit ? '来店記録' : '会員更新'}`}
				open={isMemberRenewConfirmModalVisible}
				onCancel={hideMemberRenewConfirmModal}
				footer={null}
				destroyOnClose
				centered
				styles={{
					body: {
					  maxHeight: '80vh',
					  overflowY: 'auto',
					  overflowX: 'hidden'
					}
				  }}
			>
				<Row>
					<Col span={24}>
						<div className="text-center mb-4">
							{confirmMember?.picUrl !== '' && confirmMember?.picUrl !== null ? (
								<Image
									preview={{
										mask: <EyeOutlined rev={undefined} />,
										src: confirmMember.picUrl,
										maskClassName: 'rounded-full'
									}}
									width={100}
									height={100}
									className="rounded-full"
									src={`${confirmMember.picUrl}/large`}
									fallback="/no-image.png"
								/>
							) : (
								<Image
									src="/no-image.png"
									width={100}
									height={100}
									className="rounded-full"
									preview={{
										mask: <EyeOutlined rev={undefined} />,
										src: '/no-image.png',
										maskClassName: 'rounded-full'
									}}
								/>
							)}
						</div>
						<p className="text-center font-bold text-xl">
							{/* {confirmMember?.lastName || 'ー'} {confirmMember?.firstName || 'ー'}様 */}
							{confirmMember?.displayName || 'ー'}
						</p>
						{/* <p className="text-center text-sm">
							（{confirmMember?.lastNameKana || 'ー'} {confirmMember?.firstNameKana || 'ー'}）
						</p> */}
						<Divider>会員情報</Divider>
						<Descriptions column={1} layout="horizontal" bordered>
							<Descriptions.Item label="ID" className="text-center">
								{confirmMember?.memberId || 'ー'}
							</Descriptions.Item>
							<Descriptions.Item label="会員コード" className="text-center">
								{confirmMember?.memberCode || 'ー'}
							</Descriptions.Item>
							<Descriptions.Item label="会員登録日" className="text-center">
								{confirmMember?.memberSince
									? dayjs(confirmMember.memberSince).format('YYYY年M月D日')
									: 'ー'}
							</Descriptions.Item>
							<Descriptions.Item label="来店回数" className="text-center">
								{confirmMember?.countVisit || 'ー'}回
							</Descriptions.Item>
							<Descriptions.Item label="最終来店日" className="text-center">
								{confirmMember?.visits && confirmMember?.visits.length > 0
									? dayjs(confirmMember.lastVisit).format('YYYY年M月D日')
									: 'ー'}
							</Descriptions.Item>

							<Descriptions.Item label="有効期限" className="text-center">
								{confirmMember?.activeUntil ? (
									<Tag
										color={
											dayjs(confirmMember.activeUntil).isAfter(dayjs(), 'day') ? 'green' : 'red'
										}
										className="mr-0"
									>
										{dayjs(confirmMember.activeUntil).format('YYYY年M月D日')}
									</Tag>
								) : (
									'ー'
								)}
							</Descriptions.Item>
							<Descriptions.Item label="ポイント" className="text-center">
								<span className="font-bold" style={{ color: publicSettings?.PRIMARY_COLOR }}>
									{confirmMember?.kakeruPoint ?? 'ー'}pt
								</span>
							</Descriptions.Item>
						</Descriptions>
					</Col>

					{isMemberVisit ? (
						<>
							<Form
								form={memberPointForm}
								onFinish={handleMemberPointUpdate}
								className="w-full"
								initialValues={{
									kakeruPointIsAdd: true,
									memberId: confirmMember?.memberId,
									memberVisitId: confirmMember?.memberVisitId
								}}
								layout="vertical"
								preserve={false}
								size="large"
							>
								<Divider>ポイント変更</Divider>
								<Col>
									<Form.Item name="memberId" hidden>
										<Input />
									</Form.Item>
									<Form.Item hidden name="memberVisitId">
										<Input />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item label="販売会・イベントP" name="kakeruPoint">
										<InputNumber className="w-full" inputMode="numeric" min={0} />
									</Form.Item>
									<Form.Item
										name="kakeruPointIsAdd"
										className="flex justify-center"
										valuePropName="checked"
									>
										<Switch
											className="w-full "
											checkedChildren="ポイント付与"
											unCheckedChildren="ポイント消費"
											defaultChecked
										/>
									</Form.Item>
								</Col>
								<Divider />
								<Col span={24} className="text-center">
									<Button
										type="primary"
										htmlType="submit"
										size="large"
										className="px-12"
										loading={memberEditMutation.isLoading}
									>
										変更
									</Button>
								</Col>
							</Form>
						</>
					) : (
						<>
							<Divider>有効期間更新</Divider>
							<Col span={24}>
								<Form
									name="memberRenewConfirmForm"
									form={memberRenewConfirmForm}
									onFinish={handleMemberRenew}
									layout="vertical"
									preserve={false}
									size="large"
								>
									<Row justify="center">
										<Col>
											<Form.Item name="memberId" hidden>
												<Input />
											</Form.Item>
										</Col>
										<Col>
											<Form.Item
												name="activeUntil"
												label="有効期限更新"
												rules={[
													{
														required: true,
														message: '必須です'
													}
												]}
											>
												{/* {isMobile ? (
													<Input
														placeholder="例：有効期限を選択してください"
														readOnly
														className="cursor-pointer"
														onPressEnter={(e) => e.preventDefault()}
														onClick={() => {
															setIsRenewConfirmPickerOpen(true)
														}}
													/>
												) : ( */}
												<CustomDatePicker style={{ width: '280px' }} inputReadOnly />
												{/* )} */}
											</Form.Item>
										</Col>
										<Col span={24} className="text-center">
											<Button
												type="primary"
												htmlType="submit"
												loading={memberRenewMutation.isLoading}
												className="px-12"
											>
												更新
											</Button>
										</Col>
									</Row>
								</Form>
								{/* {isMobile ? (
									<DatePicker
										//@ts-ignore
										isOpen={isRenewConfirmPickerOpen}
										// value={renewConfirmPickerValue}
										theme="ios"
										confirmText="確定"
										cancelText="キャンセル"
										min={dayjs().toDate()}
										onSelect={(time) => {
											setIsRenewConfirmPickerOpen(false)

											memberRenewConfirmForm.setFieldsValue({
												activeUntil: dayjs(time).format('YYYY-MM-DD')
											})

											setRenewConfirmPickerValue(time)
										}}
										onCancel={() => {
											setIsRenewConfirmPickerOpen(false)
										}}
									/>
								) : (
									''
								)} */}
							</Col>
						</>
					)}
				</Row>
			</Modal>
		</>
	)
}

export default MemberPointUpdateModal
