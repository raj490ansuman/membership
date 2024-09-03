import { EyeOutlined } from '@ant-design/icons'
import { Button, Col, Form, Image, Input, Tag, Modal, Row, Divider, DatePicker, Descriptions, message } from 'antd'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { isMobile } from 'react-device-detect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { API, COMMONS } from '@/utils'
import dayjs from 'dayjs'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`
const MemberRenewModal = (props: {
	isMemberRenewModalVisible?: any
	hideMemberRenewModal?: any
	currentMember?: any
	hideMemberRenewConfirmModal?: any
	setRenewPickerValue?: any
	renewPickerValue?: any
}) => {
	const { isMemberRenewModalVisible, hideMemberRenewModal, currentMember, setRenewPickerValue, renewPickerValue } =
		props
	const [memberRenewForm] = Form.useForm()
	const queryClient: any = useQueryClient()

	const navigate = useNavigate()
	const [isRenewPickerOpen, setIsRenewPickerOpen] = useState(false)

	const memberRenewMutation = useMutation(API.ADMIN_RENEW_MEMBER, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			hideMemberRenewModal()

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
	useEffect(() => {
		if (isMemberRenewModalVisible && currentMember?.memberId) {
			const defaultDate = currentMember?.activeUntil
				? dayjs(currentMember?.activeUntil, 'YYYY-MM-DD').add(1, 'year').subtract(1, 'day').toDate()
				: dayjs(currentMember?.memberSince, 'YYYY-MM-DD').add(1, 'year').subtract(1, 'day').toDate()
			console.log('Active Until Date:', defaultDate)
			console.log('Is Valid Date:', dayjs(defaultDate).isValid())

			setRenewPickerValue(defaultDate)

			memberRenewForm.setFieldsValue({
				memberId: currentMember?.memberId,
				activeUntil: isMobile ? dayjs(defaultDate).format('YYYY-MM-DD') : defaultDate
			})
		}
	}, [currentMember, memberRenewForm, isMemberRenewModalVisible, setRenewPickerValue])
	const handleMemberRenew = (data: any) => {
		const activeUntil = isMobile ? data.activeUntil : dayjs(data.activeUntil).format('YYYY-MM-DD')
		const paramData = {
			memberId: currentMember ? currentMember.memberId : data.memberId,
			activeUntil: activeUntil
		}

		memberRenewMutation.mutate(paramData)
	}
	return (
		<Modal
			title="会員更新"
			open={isMemberRenewModalVisible}
			onCancel={hideMemberRenewModal}
			footer={null}
			destroyOnClose
			centered
			styles={{
				body: {
				  maxHeight: '80vh',
				  overflowY: 'auto',
				  overflowX: 'hidden',
				}
			  }}
		>
			<Row>
				<Col span={24}>
					<div className="text-center mb-4">
						{currentMember?.picUrl !== '' && currentMember?.picUrl !== null ? (
							<Image
								preview={{
									mask: <EyeOutlined rev={undefined} />,
									src: currentMember.picUrl,
									maskClassName: 'rounded-full'
								}}
								width={100}
								height={100}
								className="rounded-full"
								src={`${currentMember.picUrl}/large`}
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
						{currentMember?.lastName || 'ー'} {currentMember?.firstName || 'ー'}様
					</p>
					<p className="text-center text-sm">
						（{currentMember?.lastNameKana || 'ー'} {currentMember?.firstNameKana || 'ー'}）
					</p>
					<Divider>会員情報</Divider>
					<Descriptions column={1} layout="horizontal" bordered>
						<Descriptions.Item label="ID" className="text-center">
							{currentMember?.memberId || 'ー'}
						</Descriptions.Item>
						<Descriptions.Item label="会員コード" className="text-center">
							{currentMember?.memberCode || 'ー'}
						</Descriptions.Item>
						<Descriptions.Item label="会員登録日" className="text-center">
							{currentMember?.memberSince
								? dayjs(currentMember.memberSince).format('YYYY年M月D日')
								: 'ー'}
						</Descriptions.Item>
						<Descriptions.Item label="来店回数" className="text-center">
							{currentMember?.visits && currentMember?.visits.length > 0
								? currentMember.visits.length
								: 'ー'}
							回
						</Descriptions.Item>
						<Descriptions.Item label="最終来店日" className="text-center">
							{currentMember?.visits && currentMember?.visits.length > 0
								? dayjs(currentMember.lastVisit).format('YYYY年M月D日')
								: 'ー'}
						</Descriptions.Item>
						<Descriptions.Item label="有効期限" className="text-center">
							{currentMember?.activeUntil ? (
								<Tag
									color={dayjs(currentMember.activeUntil).isAfter(dayjs(), 'day') ? 'green' : 'red'}
									className="mr-0"
								>
									{dayjs(currentMember.activeUntil).format('YYYY年M月D日')}
								</Tag>
							) : (
								'ー'
							)}
						</Descriptions.Item>
					</Descriptions>
				</Col>
				<Divider>有効期間更新</Divider>
				<Col span={24}>
					<Form
						name="memberRenewForm"
						form={memberRenewForm}
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
									{isMobile ? (
										<Input
											placeholder="例：有効期限を選択してください"
											readOnly
											className="cursor-pointer"
											onPressEnter={(e) => e.preventDefault()}
											onClick={() => {
												setIsRenewPickerOpen(true)
											}}
										/>
									) : (
										<CustomDatePicker className="w-full" />
									)}
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
					{isMobile && (
						<DatePicker
							//@ts-ignore
							isOpen={isRenewPickerOpen}
							value={renewPickerValue}
							theme="ios"
							confirmText="確定"
							cancelText="キャンセル"
							min={dayjs().toDate()}
							onSelect={(time: any) => {
								setIsRenewPickerOpen(false)

								memberRenewForm.setFieldsValue({
									activeUntil: dayjs(time).format('YYYY-MM-DD')
								})

								setRenewPickerValue(time)
							}}
							onCancel={() => {
								setIsRenewPickerOpen(false)
							}}
						/>
					)}
				</Col>
			</Row>
		</Modal>
	)
}

export default MemberRenewModal
