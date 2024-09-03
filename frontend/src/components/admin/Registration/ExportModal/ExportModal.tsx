import React, { useEffect } from 'react'
import { Button, Col, Form, message, Row, Modal, DatePicker, Input } from 'antd'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { AxiosError } from 'axios'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const ExportModal = (props) => {
	const {
		isRegistrationExportModalVisible,
		hideRegistrationExportModal,
		categoryId,
		categoryTitle,
		occasionId,
		occasionTitle
	} = props

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const navigate = useNavigate()

	const [exportForm] = Form.useForm()

	const registrationExportMutation = useMutation(API.ADMIN_EXPORT_REGISTRATIONS, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				if (response?.data) {
					fileDownload(
						'\uFEFF' + response.data,
						`${moment().format('YYYYMMDDHHmm')}_${categoryTitle ? categoryTitle : ''}_${
							occasionTitle ? occasionTitle : ''
						}予約リスト.csv`,
						'text/csv'
					)
				}
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				message.warning(COMMONS.WARN_PASSWORD_NOT_MATCH_MSG)
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
		if (!isRegistrationExportModalVisible) {
			exportForm.resetFields()
		}
	}, [isRegistrationExportModalVisible, exportForm])

	const handleExport = (data) => {
		const paramData = {
			categoryId: categoryId,
			occasionId: occasionId,
			from: data.filterFrom ? moment(data.filterFrom).startOf('day').toISOString() : undefined,
			to: data.filterTo ? moment(data.filterTo).endOf('day').toISOString() : undefined,
			password: data.password
		}

		registrationExportMutation.mutate(paramData, {
			onSuccess: (data, variables, context) => {
				hideRegistrationExportModal()
			}
		})
	}

	return (
		<>
			<Modal
				title="予約リストCSV"
				open={isRegistrationExportModalVisible}
				onCancel={hideRegistrationExportModal}
				footer={null}
				destroyOnClose
				centered
				width={720}
				styles={{ body: { maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' } }}
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
							form={exportForm}
							layout="vertical"
							size="large"
							requiredMark={false}
							onFinish={handleExport}
							initialValues={{
								filterFrom: undefined,
								filterTo: undefined,
								password: undefined
							}}
						>
							<Row gutter={[16, 16]} justify="start">
								<Col xs={{ span: 24 }}>
									<Form.Item className="mb-0" label="期間" required>
										<Form.Item
											extra="この日付から"
											name="filterFrom"
											className="inline-block mr-2 mb-4"
											style={{ width: 'calc(50% - 0.25rem)' }}
											rules={[
												{
													required: true,
													message: '必須です'
												}
											]}
										>
											<CustomDatePicker
												placeholder="日付で検索"
												className="w-full"
												inputReadOnly
											/>
										</Form.Item>
										<Form.Item
											extra="この日付まで"
											name="filterTo"
											className="inline-block mb-4"
											style={{ width: 'calc(50% - 0.25rem)' }}
											rules={[
												{
													required: true,
													message: '必須です'
												}
											]}
										>
											<CustomDatePicker
												placeholder="日付で検索"
												className="w-full"
												inputReadOnly
											/>
										</Form.Item>
									</Form.Item>
									<Form.Item
										name="password"
										label="ログインパスワード"
										rules={[
											{
												required: true,
												message: 'パスワードを入力してください'
											}
										]}
									>
										<Input.Password placeholder="パスワードを入力してください" />
									</Form.Item>
									<div className="p-4 bg-amber-100 rounded">
										<p className="text-center whitespace-pre-wrap">{`確認のためにログインパスワードを\n入力してください`}</p>
									</div>
								</Col>
							</Row>
							<Row gutter={[8, 8]} justify="center mt-8">
								<Col>
									<Button
										type="primary"
										className="w-80 h-12"
										htmlType="submit"
										loading={registrationExportMutation.isLoading}
									>
										CSVダウンロード
									</Button>
								</Col>
							</Row>
						</Form>
					</MotionColComponent>
				</MotionRowComponent>
			</Modal>
		</>
	)
}

export default ExportModal
