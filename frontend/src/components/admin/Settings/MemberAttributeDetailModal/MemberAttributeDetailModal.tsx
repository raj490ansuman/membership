import { Button, Divider, Flex, Form, Input, message, Modal, Select, Switch, Radio } from 'antd'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useCreateMemberAttribute, useUpdateMemberAttributes } from '@/queries'
import { zMemberAttributeType } from '@schemas'
import { z } from 'zod'
import MemberAttributeDndChoice from './components/MemberAttributeDndInputChoice'

const { TextArea } = Input

const StyledSwitch = styled(Switch)`
	&.ant-switch-checked {
		background-color: ${COMMONS.CUSTOM_RED};
	}

	&.ant-switch-checked:focus {
		-webkit-box-shadow: 0 0 0 2px ${COMMONS.CUSTOM_LIGHT_RED};
		box-shadow: 0 0 0 2px ${COMMONS.CUSTOM_LIGHT_RED};
	}
`

const FormItem = styled(Form.Item)`
	margin-bottom: 0px;
`

const MemberAttributeDetailModal = (props) => {
	const {
		isMemberAttributeDetailModalVisible,
		hideMemberAttributeDetailModal,
		currentMemberAttribute,
	} = props

	const [memberAttributeForm] = Form.useForm()
	const [memberAttributeType, setMemberAttributeType] =
		useState<z.infer<typeof zMemberAttributeType>>()

	useEffect(() => {
		if (isMemberAttributeDetailModalVisible && currentMemberAttribute?.memberAttributeId) {
			setMemberAttributeType(currentMemberAttribute?.type)
			memberAttributeForm.setFieldsValue({
				required: currentMemberAttribute?.required,
				label: currentMemberAttribute?.label,
				type:
					currentMemberAttribute?.archType === 'address'
						? 'address'
						: currentMemberAttribute?.type,
				isAdminDisplayed: currentMemberAttribute?.isAdminDisplayed,
				isMemberDisplayed: currentMemberAttribute?.isMemberDisplayed,
				choices: currentMemberAttribute?.attributeChoices
					? currentMemberAttribute.attributeChoices.map((choice) => ({
							contents: choice?.contents,
							isDelete: choice?.isDelete,
							attributeChoiceId: choice?.attributeChoiceId,
							showOrder: choice?.showOrder,
					  }))
					: [{}],
			})
		}

		// eslint-disable-next-line
	}, [currentMemberAttribute, isMemberAttributeDetailModalVisible])

	const createMemberAttribute = useCreateMemberAttribute()
	const updateMemberAttribute = useUpdateMemberAttributes()

	const createMemberAttributeHandler = (formValues) => {
		const choices = formValues?.choices
			? formValues.choices.map((choice, i) => ({
					contents: choice?.contents,
					showOrder: i,
					memberAttributeId: currentMemberAttribute?.memberAttributeId,
					campaignChoiceId: choice?.campaignChoiceId,
			  }))
			: []

		if (formValues.isMemberDisplayed && !formValues.isAdminDisplayed) {
			return message.error(COMMONS.WARN_MEMBER_ATTR_SET_ADMIN_DISPLAY)
		}
		if (formValues.type === zMemberAttributeType.Enum.address_prefecture) {
			currentMemberAttribute.prefecture = formValues.prefecture
		}

		if (currentMemberAttribute?.memberAttributeId) {
			updateMemberAttribute.mutate({
				params: {
					memberAttributeId: currentMemberAttribute.memberAttributeId,
				},
				body: {
					required: formValues.required,
					label: formValues.label,
					isMemberDisplayed: formValues.isMemberDisplayed,
					isAdminDisplayed: formValues.isAdminDisplayed,
					choices,
				},
			})
		} else {
			createMemberAttribute.mutate({ body: { ...formValues, choices } })
		}
		hideMemberAttributeDetailModal()
		memberAttributeForm.resetFields()
		setMemberAttributeType(zMemberAttributeType.Enum.text)
	}

	return (
		<Modal
			open={isMemberAttributeDetailModalVisible}
			onCancel={() => {
				hideMemberAttributeDetailModal()
				memberAttributeForm.resetFields()
				setMemberAttributeType(zMemberAttributeType.Enum.text)
			}}
			title={'項目追加'}
			footer={null}
			styles={{
				body: {
					maxHeight: '90vh',
					overflowY: 'auto',
					overflowX: 'hidden',
				},
			}}
			maskClosable={false}
			width={720}
			destroyOnClose
			centered
		>
			<Form
				form={memberAttributeForm}
				layout='vertical'
				onFinish={createMemberAttributeHandler}
				size='large'
				requiredMark={false}
				scrollToFirstError={COMMONS.FORM_SCROLL_CONFIG}
				initialValues={{
					required: false,
					isMemberDisplayed: undefined,
					isAdminDisplayed: undefined,
					label: '',
					type: 'text',
					choices: [{}],
				}}
			>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Flex gap={10} align='center'>
							必須設定
							<FormItem name='required' valuePropName='checked'>
								<StyledSwitch />
							</FormItem>
						</Flex>
					</motion.div>

					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Form.Item
							name='isMemberDisplayed'
							label={
								<p>
									<span>会員証登録フォーム項目表示</span>
									<span className='custom-required-decoration'>必須</span>
								</p>
							}
							rules={[
								{
									required: true,
									message: '表示状態を選択してください',
								},
							]}
						>
							<Select placeholder='表示状態を選択してください'>
								<Select.Option value={true}>表示</Select.Option>
								<Select.Option value={false}>非表示</Select.Option>
							</Select>
						</Form.Item>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Form.Item
							name='isAdminDisplayed'
							label={
								<p>
									<span>管理画面項目表示</span>
									<span className='custom-required-decoration'>必須</span>
								</p>
							}
							rules={[
								{
									required: true,
									message: '表示状態を選択してください',
								},
							]}
						>
							<Select placeholder='表示状態を選択してください'>
								<Select.Option value={true}>表示</Select.Option>
								<Select.Option value={false}>非表示</Select.Option>
							</Select>
						</Form.Item>
					</motion.div>

					<motion.div
						style={{
							marginBottom: '20px',
						}}
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					>
						<FormItem
							name='label'
							label={
								<p>
									<span>項目ラベル</span>
									<span className='custom-required-decoration'>必須</span>
								</p>
							}
							rules={[
								{
									required: true,
									message: '項目ラベルを入力してください',
								},
							]}
						>
							<TextArea
								placeholder={
									currentMemberAttribute?.memberAttributeId === 1
										? '例：氏名'
										: currentMemberAttribute?.memberAttributeId === 2
										? '例: 電話番号'
										: '例：氏名（漢字）'
								}
								autoSize={{ minRows: 3 }}
								allowClear
							/>
						</FormItem>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Form.Item name='type' label='回答形式' className='mb-0'>
							<Radio.Group
								onChange={(e) => {
									setMemberAttributeType(e?.target?.value)
								}}
							>
								<Radio
									className='mb-4'
									value='text'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.type === 'text')
									}
								>
									テキスト
								</Radio>
								<Radio
									className='mb-4'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.type === 'date')
									}
									value='date'
								>
									日付
								</Radio>
								<Radio
									className='mb-4'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.type === 'checkbox')
									}
									value='checkbox'
								>
									チェックボックス（複数選択形式）
								</Radio>
								<Radio
									className='mb-4'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.type === 'radio')
									}
									value='radio'
								>
									ラジオボタン（単一選択形式）
								</Radio>
								<Radio
									className='mb-4'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.type === 'select')
									}
									value='select'
								>
									セレクトボックス（単一選択形式）
								</Radio>
								<Radio
									className='mb-4'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.type === 'image')
									}
									value='image'
								>
									写真
								</Radio>
								<Radio
									className='mb-4'
									disabled={
										currentMemberAttribute &&
										!(currentMemberAttribute?.archType === 'address')
									}
									value='address'
								>
									郵便番号・住所
								</Radio>
							</Radio.Group>
						</Form.Item>
					</motion.div>

					{(memberAttributeType == zMemberAttributeType.Enum.checkbox ||
						memberAttributeType === zMemberAttributeType.Enum.radio ||
						memberAttributeType === zMemberAttributeType.Enum.select) && (
						<MemberAttributeDndChoice />
					)}
					<Divider />
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						className='flex justify-center'
					>
						<TapAnimationComponent>
							<Button
								type='primary'
								htmlType='submit'
								size='large'
								className='m-1 w-32'
							>
								保存
							</Button>
						</TapAnimationComponent>
					</motion.div>
				</motion.div>
			</Form>
		</Modal>
	)
}

export default MemberAttributeDetailModal
