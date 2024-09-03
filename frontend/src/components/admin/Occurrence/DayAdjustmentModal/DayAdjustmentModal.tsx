import { Button, Checkbox, Divider, Form, Modal, TimePicker } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const DayAdjustmentModal = (props) => {
	const { publicSettings, currentDay, days, setDays, isDayAdjustmentModalVisible, hideDayAdjustmentModal } = props

	const [dayAdjustmentForm] = Form.useForm()

	const [selectedDays, setSelectedDays] = useState([])

	useEffect(() => {
		if (!isDayAdjustmentModalVisible) {
			dayAdjustmentForm.resetFields()

			setSelectedDays([])
		}

		// eslint-disable-next-line
	}, [isDayAdjustmentModalVisible])

	useEffect(() => {
		if (days && isDayAdjustmentModalVisible) {
			dayAdjustmentForm.setFieldsValue({
				isEnabled: days.find((d) => d?.value === currentDay?.value)?.enabled || false,
				times: days.find((d) => d?.value === currentDay?.value)?.times || [{}]
			})
		}

		// eslint-disable-next-line
	}, [days, isDayAdjustmentModalVisible])

	const handleSelectedDay = (day) => {
		if (selectedDays.includes(day)) {
			setSelectedDays(selectedDays.filter((sd) => sd !== day))
		} else {
			setSelectedDays([...selectedDays, day])
		}
	}

	const handleDayAdjustment = (data) => {
		setDays(
			days.map((td) =>
				td?.value === currentDay?.value
					? {
							...td,
							enabled: data?.isEnabled,
							times: data?.times
					  }
					: selectedDays.includes(td?.value)
					? {
							...td,
							times: data?.times
					  }
					: td
			)
		)
		hideDayAdjustmentModal()
	}

	return (
		<>
			<Modal
				open={isDayAdjustmentModalVisible}
				onCancel={hideDayAdjustmentModal}
				title={`${currentDay?.longLabel}のスケジュール`}
				footer={null}
				destroyOnClose
				centered
				zIndex={1005}
			>
				<div className="p-2">
					<Form
						form={dayAdjustmentForm}
						layout="vertical"
						initialValues={{
							isEnabled: false,
							times: [{}]
						}}
						onFinish={handleDayAdjustment}
						requiredMark={false}
						size="large"
						scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
					>
						<motion.div
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
							initial="hidden"
							animate="show"
							exit="hidden"
						>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								<Form.Item name="isEnabled" valuePropName="checked">
									<Checkbox>{`${currentDay?.longLabel}に予定を受け付けます`}</Checkbox>
								</Form.Item>
								<Form.List name="times">
									{(fields, { add, remove }) => (
										<>
											{fields.map((field, i) => (
												<div key={field.name} className="flex">
													<Form.Item
														name={[field.name, 'startTime']}
														className="mr-2"
														style={{ width: 'calc(50% - 1.25rem)' }}
														extra="※開始時間"
														rules={[
															{
																required: true,
																message: '必須です'
															}
														]}
													>
														<TimePicker
															inputReadOnly
															format="HH:mm"
															popupClassName="hide-timepicker-footer"
															className="w-full"
															showNow={false}
															allowClear={false}
															minuteStep={15}
															hideDisabledOptions
															disabledTime={() => ({
																disabledHours: () =>
																	[...Array(24).keys()].filter(
																		(hour) =>
																			hour < COMMONS.BUSINESS_OPEN_TIME_VALUE ||
																			hour > COMMONS.BUSINESS_CLOSE_TIME_VALUE
																	),
																disabledMinutes: (selectedHour) =>
																	[...Array(60).keys()].filter((min) =>
																		selectedHour ===
																		COMMONS.BUSINESS_CLOSE_TIME_VALUE
																			? min === 0
																				? false
																				: true
																			: false
																	)
															})}
															onSelect={(value) => {
																dayAdjustmentForm.setFieldValue(
																	'times',
																	dayAdjustmentForm
																		.getFieldValue('times')
																		.map((t, i) =>
																			i === field.name
																				? { ...t, startTime: value }
																				: t
																		)
																)
															}}
														/>
													</Form.Item>
													<Form.Item
														name={[field.name, 'endTime']}
														className="mr-2"
														style={{ width: 'calc(50% - 1.25rem)' }}
														extra="※終了時間"
														rules={[
															{
																required: true,
																message: '必須です'
															}
														]}
													>
														<TimePicker
															inputReadOnly
															format="HH:mm"
															popupClassName="hide-timepicker-footer"
															className="w-full"
															showNow={false}
															allowClear={false}
															minuteStep={15}
															hideDisabledOptions
															disabledTime={() => ({
																disabledHours: () =>
																	[...Array(24).keys()].filter(
																		(hour) =>
																			hour < COMMONS.BUSINESS_OPEN_TIME_VALUE ||
																			hour > COMMONS.BUSINESS_CLOSE_TIME_VALUE
																	),
																disabledMinutes: (selectedHour) =>
																	[...Array(60).keys()].filter((min) =>
																		selectedHour ===
																		COMMONS.BUSINESS_CLOSE_TIME_VALUE
																			? min === 0
																				? false
																				: true
																			: false
																	)
															})}
															onSelect={(value) => {
																dayAdjustmentForm.setFieldValue(
																	'times',
																	dayAdjustmentForm
																		.getFieldValue('times')
																		.map((t, i) =>
																			i === field.name
																				? { ...t, endTime: value }
																				: t
																		)
																)
															}}
														/>
													</Form.Item>
													{fields.length > 1 && (
														<div className="flex h-10 justify-center items-center">
															<CloseOutlined
																className="text-2xl leading-none"
																onClick={() => remove(field.name)}
															/>
														</div>
													)}
												</div>
											))}
											<Form.Item>
												<Button
													icon={<PlusOutlined />}
													type="text"
													className="p-0"
													onClick={() => add()}
												>
													時間帯を追加
												</Button>
											</Form.Item>
										</>
									)}
								</Form.List>
								<p className="font-bold">他の曜日にも適用する（上書きされます）</p>
								<div className="flex mt-4">
									{days.map((day) => (
										<div
											key={day?.value}
											className="border py-1 px-4 mr-1 rounded cursor-pointer"
											style={{
												borderColor: selectedDays.includes(day?.value)
													? publicSettings?.PRIMARY_COLOR?.valueString
													: COMMONS.CUSTOM_GRAY_COLOR,
												backgroundColor: selectedDays.includes(day?.value)
													? publicSettings?.PRIMARY_LIGHT_COLOR.valueString
													: ''
											}}
											onClick={() => {
												handleSelectedDay(day?.value)
											}}
										>
											<p>{day?.label}</p>
										</div>
									))}
								</div>
							</motion.div>
							<Divider />
							<motion.div
								variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
								className="flex justify-center"
							>
								<TapAnimationComponent className="m-1">
									<Button onClick={hideDayAdjustmentModal}>キャンセル</Button>
								</TapAnimationComponent>
								<TapAnimationComponent className="m-1">
									<Button type="primary" htmlType="submit">
										保存する
									</Button>
								</TapAnimationComponent>
							</motion.div>
						</motion.div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default DayAdjustmentModal
