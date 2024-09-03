import React from 'react'
import { Button, Form, Divider } from 'antd'
import {
	// NumericInputComponent,
	TapAnimationComponent,
} from '@/components'

// const { TextArea } = Input

import { handleMemberAttributeInput } from './MemberAttribute'

const MemberAttributesForm = (props) => {
	const { personalInfo, memberAttributes, formHandler, formMutation, submitBtnOptions } = props
	const { submitBtnText, submitBtnClassName } = submitBtnOptions ?? {}
	const [updateProfileForm] = Form.useForm()

	return (
		<Form
			form={updateProfileForm}
			onFinish={formHandler}
			size='large'
			layout='vertical'
			// layout="horizontal"
			// labelCol={{ span: 6 }}
			// wrapperCol={{ span: 18 }}
			labelAlign='left'
			requiredMark={false}
			colon={false}
			scrollToFirstError
		>
			{memberAttributes?.map((item: MemberAttribute, index: number) => (
				<React.Fragment key={`memberAttributeInput_${index}`}>
					{handleMemberAttributeInput({
						member: personalInfo,
						memberAttribute: item,
						memberAttributes: memberAttributes,
					})}
				</React.Fragment>
			))}
			<Divider />
			<Form.Item className='px-4 text-center mb-0'>
				<TapAnimationComponent>
					<Button
						type='primary'
						className={submitBtnClassName ? submitBtnClassName : 'w-32 h-12 m-1'}
						htmlType='submit'
						size='large'
						loading={formMutation.isLoading}
					>
						{submitBtnText ? submitBtnText : '保存'}
					</Button>
				</TapAnimationComponent>
			</Form.Item>
		</Form>
	)
}

export default MemberAttributesForm
