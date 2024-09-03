import React, { useState, useEffect } from 'react'
import { Button, Col, Form, message, Row, Modal, DatePicker, Divider, Image, Table, InputNumber } from 'antd'
import { EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const CandidateModal = (props) => {
	const { isCandidateModalVisible, hideCandidateModal, handleCurrentCampaignWinnersExport } = props
	const { publicSettings } = useLayoutConfigContext()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [candidateForm] = Form.useForm()
	const [candidateFilterForm] = Form.useForm()

	const [candidates, setCandidates] = useState([])

	const [modal, contextHolder] = Modal.useModal()

	const memberColumns = [
		{
			title: 'ID',
			dataIndex: 'memberId',
			align: 'center',
			width: 50,
			sorter: () => {}
		},
		{
			title: '写真',
			dataIndex: 'picUrl',
			align: 'center',
			width: 70,
			render: (picUrl) =>
				picUrl ? (
					<Image
						preview={{
							mask: <EyeOutlined />,
							src: picUrl,
							maskClassName: 'rounded-full'
						}}
						width={50}
						height={50}
						className="rounded-full"
						src={`${picUrl}/small`}
						fallback="/no-image.png"
					/>
				) : (
					<Image
						src="/no-image.png"
						width={50}
						height={50}
						className="rounded-full"
						preview={{
							mask: <EyeOutlined />,
							src: '/no-image.png',
							maskClassName: 'rounded-full'
						}}
					/>
				)
		},
		{
			title: 'LINE名',
			dataIndex: 'displayName',
			align: 'center'
		},
		{
			title: '氏名',
			dataIndex: 'fullName',
			align: 'center',
			width: 200,
			render: (member) => (
				<>
					<p>
						{member?.lastName || 'ー'} {member?.firstName || 'ー'}
					</p>
					<p className="text-xs text-gray-400">
						（{member?.lastNameKana || 'ー'} {member?.firstNameKana || 'ー'}）
					</p>
				</>
			)
		},
		{
			title: '電話番号',
			dataIndex: 'telephone',
			align: 'center'
		},
		{
			title: '入会日',
			dataIndex: 'memberSince',
			align: 'center',
			width: 100,
			sorter: () => {},
			render: (memberSince) => <>{memberSince ? moment(memberSince).format('YYYY/M/D') : 'ー'}</>
		}
	]

	const showSelectedCandidates = (winners) => {
		modal.confirm({
			icon: <CheckCircleOutlined style={{ color: COMMONS.CUSTOM_GREEN }} />,
			title: <p className="text-xl font-bold">抽選完了</p>,
			content: (
				<>
					<p className="text-lg font-bold mb-4">
						全
						<span style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}>{`${
							candidates && Array.isArray(candidates) ? candidates.length : 0
						}`}</span>
						名の対象者の中から
						<span style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}>{`${
							winners && Array.isArray(winners) ? winners.length : 0
						}`}</span>
						名が当選しました。
					</p>
					<Table
						bordered
						size="small"
						columns={memberColumns}
						scroll={{ x: 'max-content' }}
						locale={{ emptyText: '当選者のデータがありません。' }}
						pagination={{
							responsive: true,
							showTotal: (total, range) => `全${total}件中${range[0]}～${range[1]}件目`,
							defaultCurrent: 1,
							defaultPageSize: 20,
							position: ['bottomCenter']
						}}
						dataSource={
							winners
								? winners.map((w) => {
										return {
											key: w?.memberId,
											memberId: w?.memberId,
											picUrl: w?.picUrl,
											displayName: w?.displayName,
											fullName: w,
											telephone: w?.telephone || 'ー',
											memberSince: w?.memberSince
										}
								  })
								: []
						}
					/>
				</>
			),
			okText: 'CSVダウンロード',
			cancelText: '閉じる',
			onOk: (close) => {
				handleCurrentCampaignWinnersExport(
					candidates.map((c) => c?.memberId),
					close
				)
			},
			onCancel: () => {
				hideCandidateModal()
			},
			width: 720,
			centered: true
		})
	}

	const candidateSearchMutation = useMutation(API.ADMIN_GET_CAMPAIGN_CANDIDATES, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_SEARCH_MSG)
				setCandidates(response?.data || [])
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

	const candidateUpdateMutation = useMutation(API.ADMIN_UPDATE_CAMPAIGN_CANDIDATE, {
		onSuccess: (response) => {
			message.success(COMMONS.SUCCESS_CANDIDATES_SELECT_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_MEMBERS]
			})
			showSelectedCandidates(response?.data)
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

	const handleUpdateCandidate = (data) => {
		if (candidates.length > 0) {
			modal.confirm({
				title: '⾃動抽選設定',
				content: (
					<>
						<Form
							form={candidateForm}
							layout="vertical"
							preserve={false}
							initialValues={{
								winnersCount: 1
							}}
							scrollToFirstError
						>
							<Row justify="center mt-4">
								<Col span={24}>
									<Form.Item
										name="winnersCount"
										label="当選人数"
										rules={[
											{
												required: true,
												message: '当選人数を入力してください'
											}
										]}
									>
										<InputNumber
											addonBefore={`${candidates.length}人から`}
											addonAfter="人の当選者"
											min={1}
											max={candidates.length}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</>
				),
				okText: '抽選する',
				okType: 'primary',
				cancelText: '閉じる',
				centered: true,
				onOk(close) {
					candidateForm
						.validateFields()
						.then((data) => {
							const paramData = {
								memberIds: candidates.map((c) => c.memberId),
								winnersCount: data.winnersCount
							}

							candidateUpdateMutation.mutate(paramData, {
								onSuccess: (data, variables, context) => {
									close()
								}
							})
						})
						.catch((error) => {})
				}
			})
		} else {
			message.warning(COMMONS.WARN_CANDIDATES_COUNT_ZERO_MSG)
		}
	}

	const handleSearchCandidate = (data) => {
		const paramData = {
			params: {
				from: data?.filterCandidateFrom
					? moment(data.filterCandidateFrom).startOf('day').toISOString()
					: undefined,
				to: data?.filterCandidateTo ? moment(data.filterCandidateTo).startOf('day').toISOString() : undefined
			}
		}

		candidateSearchMutation.mutate(paramData)
	}

	useEffect(() => {
		if (isCandidateModalVisible) {
			candidateForm.resetFields()
			candidateFilterForm.resetFields()

			setCandidates([])
		}

		//eslint-disable-next-line
	}, [isCandidateModalVisible])

	return (
		<>
			<Modal
				title="⾃動抽選"
				open={isCandidateModalVisible}
				onCancel={hideCandidateModal}
				footer={null}
				destroyOnClose
				centered
				width={720}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
			>
				<MotionRowComponent
					gutter={[0, 16]}
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
				>
					<MotionColComponent
						xs={24}
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<Form
							form={candidateFilterForm}
							layout="vertical"
							onFinish={handleSearchCandidate}
							initialValues={{
								filterCandidateFrom: undefined,
								filterCandidateTo: undefined
							}}
						>
							<Divider>入会日で検索</Divider>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }}>
									<Form.Item className="mb-0">
										<Form.Item
											help="この日付から"
											name="filterCandidateFrom"
											className="inline-block mr-2 mb-4"
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder="日付で検索"
												className="w-full"
												inputReadOnly
											/>
										</Form.Item>
										<Form.Item
											help="この日付まで"
											name="filterCandidateTo"
											className="inline-block mb-4"
											style={{ width: 'calc(50% - 0.25rem)' }}
										>
											<CustomDatePicker
												placeholder="日付で検索"
												className="w-full"
												inputReadOnly
											/>
										</Form.Item>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={[8, 8]} justify="center mt-8">
								<Col>
									<Button type="dashed" className="bg-white px-12" htmlType="submit">
										検索
									</Button>
								</Col>
							</Row>
						</Form>
					</MotionColComponent>
					<Divider />
					<MotionColComponent
						span={24}
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial="hidden"
						animate="show"
						exit="hidden"
					>
						<Table
							bordered
							size="small"
							columns={memberColumns}
							scroll={{ x: 'max-content' }}
							locale={{ emptyText: 'お客様のデータがありません。' }}
							pagination={{
								responsive: true,
								showTotal: (total, range) => `全${total}件中${range[0]}～${range[1]}件目`,
								defaultCurrent: 1,
								defaultPageSize: 20,
								position: ['bottomCenter']
							}}
							dataSource={
								candidates
									? candidates.map((c) => {
											return {
												key: c?.memberId,
												memberId: c?.memberId,
												picUrl: c?.picUrl,
												displayName: c?.displayName,
												fullName: c,
												telephone: c?.telephone || 'ー',
												memberSince: c?.memberSince
											}
									  })
									: []
							}
						/>
					</MotionColComponent>
					<Divider />
					<Col span={24} className="text-center">
						<Button
							type="primary"
							size="large"
							htmlType="submit"
							className="px-12"
							onClick={handleUpdateCandidate}
						>
							抽出する
						</Button>
					</Col>
				</MotionRowComponent>
			</Modal>
			{contextHolder}
		</>
	)
}

export default CandidateModal
