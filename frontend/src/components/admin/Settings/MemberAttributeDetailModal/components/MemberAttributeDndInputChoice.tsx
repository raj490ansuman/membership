import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const MemberAttributeDndInputChoice = () => {
	const memberAttributeForm = Form.useFormInstance()

	const handleInputChoiceOnDragEnd = (result) => {
		// Dropped outside the list
		if (!result.destination) {
			return
		} else {
			const orderedChoices = COMMONS.RE_ORDER(
				memberAttributeForm.getFieldValue('choices'),
				result.source.index,
				result.destination.index,
			)
			memberAttributeForm.setFieldsValue({ choices: orderedChoices })
		}
	}

	return (
		<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
			<p>
				<span className='font-bold'>選択肢</span>
				<span className='custom-required-decoration'>必須</span>
			</p>
			<p className='text-xs text-gray-400 mb-4 mt-2'>
				※項目をドラッグして表示順を自由に調整できます
			</p>
			<Form.List
				name='choices'
				rules={[
					{
						required: true,
						message: '選択肢を入力してください',
					},
				]}
			>
				{(fields, { add, remove }) => (
					<DragDropContext onDragEnd={handleInputChoiceOnDragEnd}>
						<Droppable droppableId='droppableChoices' direction='vertical'>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className='w-full'
								>
									{fields.map((field, index) => {
										return (
											<Draggable
												key={field.key}
												draggableId={field.key + ''}
												index={index}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className='border border-dashed border-gray-300 rounded bg-white p-4 mb-4'
													>
														<Form.Item label={`選択（${index + 1}）`}>
															<Form.Item
																{...field}
																key={[field.key, 'contents']}
																name={[field.name, 'contents']}
																className='inline-block mr-2'
																style={{
																	width:
																		fields.length > 1
																			? 'calc(80% - 0.25rem)'
																			: '100%',
																}}
																rules={[
																	{
																		required: true,
																		message:
																			'選択を入力してください',
																	},
																]}
															>
																<Input
																	placeholder='例：18歳'
																	onPressEnter={(e) =>
																		e.preventDefault()
																	}
																	allowClear
																/>
															</Form.Item>
															<Form.Item
																hidden
																{...field}
																key={[
																	field.key,
																	'campaignChoiceId',
																]}
																name={[
																	field.name,
																	'campaignChoiceId',
																]}
															></Form.Item>
															{fields.length > 1 ? (
																<Form.Item
																	{...field}
																	className='inline-block'
																>
																	<Button
																		danger
																		onClick={() => {
																			remove(field.name)
																		}}
																		icon={<CloseOutlined />}
																	>
																		選択削除
																	</Button>
																</Form.Item>
															) : null}
														</Form.Item>
													</div>
												)}
											</Draggable>
										)
									})}
									{provided.placeholder}
									<Form.Item>
										<Button
											type='link'
											onClick={() => add()}
											block
											icon={<PlusOutlined />}
										>
											選択肢追加
										</Button>
									</Form.Item>
								</div>
							)}
						</Droppable>
					</DragDropContext>
				)}
			</Form.List>
		</motion.div>
	)
}

export default MemberAttributeDndInputChoice
