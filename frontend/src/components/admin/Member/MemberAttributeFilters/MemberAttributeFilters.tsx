import { Col, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import { motion } from 'framer-motion'
import { COMMONS } from '@/utils'
import styled from 'styled-components'
import React from 'react'

const { Option } = Select
const MotionColComponent = motion(Col)

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

const SimpleFilterInput = ({
	memberAttribute: { memberAttributeId, label, type, attributeChoices },
}: {
	memberAttribute: MemberAttribute
}) => (
	<MotionColComponent
		key={`${label}${memberAttributeId}`}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
		xs={{ span: 24 }}
		md={{ span: 12 }}
		lg={{ span: 6 }}
		xl={{ span: 6 }}
	>
		<Form.Item
			help={label}
			name={`memberAttributeFilter${memberAttributeId}`}
			className='mb-4 w-full'
		>
			{type === 'address_prefecture' ? (
				<Select placeholder={`選択してください`} allowClear>
					{COMMONS.PREFECTURES.map((prefecture) => (
						<Option key={prefecture.value} value={prefecture.label}>
							{prefecture.label}
						</Option>
					))}
				</Select>
			) : (
				<Input placeholder={`${label}を入力してください`} allowClear />
			)}
		</Form.Item>
	</MotionColComponent>
)

const RangedNumberFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => {
	const range = [
		{ value: 'Min', label: '最低', placeholder: '例：0' },
		{ value: 'Max', label: '最高', placeholder: '例：500' },
	]
	return range.map((bound, index) => (
		<MotionColComponent
			key={`${memberAttribute.label}${memberAttribute.memberAttributeId}_${index}`}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
			xs={{ span: 24 }}
			md={{ span: 12 }}
			lg={{ span: 6 }}
			xl={{ span: 6 }}
		>
			<Form.Item
				help={`${bound.label}${memberAttribute.label}`}
				name={`memberAttributeFilter${memberAttribute.memberAttributeId}${bound.value}`}
				className='mb-4 w-full'
			>
				<InputNumber placeholder={`${bound.placeholder}`} className='w-full' />
			</Form.Item>
		</MotionColComponent>
	))
}

const RangedDateFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => {
	const range = [
		{ value: 'Min', label: 'から' },
		{ value: 'Max', label: 'まで' },
	]
	return range.map((bound, index) => (
		<MotionColComponent
			key={`${memberAttribute.label}${memberAttribute.memberAttributeId}_${index}`}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
			xs={{ span: 24 }}
			md={{ span: 12 }}
			lg={{ span: 6 }}
			xl={{ span: 6 }}
		>
			<Form.Item
				help={`${memberAttribute.label}${bound.label}`}
				name={`memberAttributeFilter${memberAttribute.memberAttributeId}${bound.value}`}
				className='mb-4 w-full'
			>
				<CustomDatePicker className='w-full' inputReadOnly />
			</Form.Item>
		</MotionColComponent>
	))
}

const SingleExistenceSelectFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => (
	<MotionColComponent
		key={`${memberAttribute.label}${memberAttribute.memberAttributeId}`}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
		xs={{ span: 24 }}
		md={{ span: 12 }}
		lg={{ span: 6 }}
		xl={{ span: 6 }}
	>
		<Form.Item
			help={memberAttribute.label}
			name={`memberAttributeFilter${memberAttribute.memberAttributeId}`}
			className='mb-4 w-full'
		>
			<Select placeholder={`選択してください`} allowClear>
				<Option
					key={`memberAttributeFilter${memberAttribute.memberAttributeId}_0`}
					value={`hasImage`}
				>
					有り
				</Option>
				<Option
					key={`memberAttributeFilter${memberAttribute.memberAttributeId}_1`}
					value={`noImage`}
				>
					無し
				</Option>
			</Select>
		</Form.Item>
	</MotionColComponent>
)

const MultiSelectFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => {
	const { attributeChoices } = memberAttribute
	if (!attributeChoices || attributeChoices?.length == 0) return <></>
	return (
		<MotionColComponent
			key={`${memberAttribute.label}${memberAttribute.memberAttributeId}`}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
			xs={{ span: 24 }}
			md={{ span: 12 }}
			lg={{ span: 6 }}
			xl={{ span: 6 }}
		>
			<Form.Item
				help={memberAttribute.label}
				name={`memberAttributeFilter${memberAttribute.memberAttributeId}`}
				className='mb-4 w-full'
			>
				<Select
					showSearch={false}
					mode='multiple'
					placeholder={`選択してください`}
					allowClear
				>
					{attributeChoices.map((choice, index) => (
						<Option
							key={`${choice.attributeChoiceId}_${index}`}
							value={choice.contents}
						>
							{choice.contents}
						</Option>
					))}
				</Select>
			</Form.Item>
		</MotionColComponent>
	)
}

const MemberAttributeFilters = ({ memberAttributes }: { memberAttributes: MemberAttribute[] }) =>
	memberAttributes.map((memberAttribute: MemberAttribute) => (
		<React.Fragment key={`MemberAttributeFilters-${memberAttribute.memberAttributeId}`}>
			{/* Create 1 filter single select input: 有り／無し */}
			{memberAttribute.type === 'image' ? (
				<SingleExistenceSelectFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
			{/* Create 1 filter input */}
			{[
				'text',
				'textarea',
				'color',
				'url',
				'email',
				'telephone',
				'firstName',
				'lastName',
				'firstNameKana',
				'lastNameKana',
				'address_postal',
			].includes(memberAttribute.type) ? (
				<SimpleFilterInput memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
			{/* Create 2 filter input: 最低：最高 */}
			{['number_integer', 'number_float'].includes(memberAttribute.type) ? (
				<RangedNumberFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
			{/* Create 2 filter date select input: から、まで */}
			{['date', 'time', 'datetime'].includes(memberAttribute.type) ? (
				<RangedDateFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}

			{/* Create 1 dropdown multiselect filter input */}
			{['checkbox', 'radio', 'select'].includes(memberAttribute.type) ? (
				<MultiSelectFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
		</React.Fragment>
	))

export default MemberAttributeFilters
