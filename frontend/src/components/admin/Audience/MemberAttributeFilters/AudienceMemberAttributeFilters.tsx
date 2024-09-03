import { Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select } from 'antd'
import styled from 'styled-components'
import React from 'react'
import { COMMONS } from '@/utils'
const { Option } = Select

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

const SimpleFilterInput = ({
	memberAttribute: { memberAttributeId, label, type },
}: {
	memberAttribute: MemberAttribute
}) => (
	<>
		<Divider>{label}で検索</Divider>
		<Row gutter={[16, 16]} justify='start'>
			<Col xs={{ span: 24 }}>
				<Form.Item
					// help={label}
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
						<Input
							placeholder={`${label}${type == 'text' ? '' : ''}を検索`}
							allowClear
						/>
					)}
				</Form.Item>
			</Col>
		</Row>
	</>
)

const RangedNumberFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => {
	const range = [
		{ value: 'Min', label: '最低', placeholder: '例：0' },
		{ value: 'Max', label: '最高', placeholder: '例：500' },
	]
	return (
		<>
			<Divider>{memberAttribute.label}で検索</Divider>
			<Row gutter={[16, 16]} justify='start'>
				<Col xs={{ span: 24 }}>
					<Form.Item className='mb-0'>
						{range.map((bound, index) => (
							<Form.Item
								help={`${bound.label}${memberAttribute.label}`}
								name={`memberAttributeFilter${memberAttribute.memberAttributeId}${bound.value}`}
								key={`memberAttributeFilter${memberAttribute.memberAttributeId}${bound.value}_${index}`}
								className={`inline-block ${
									index !== range.length - 1 ? 'mr-2' : ''
								} mb-4`}
								style={{ width: 'calc(50% - 0.25rem)' }}
							>
								<InputNumber
									placeholder={`${bound.placeholder}`}
									className='w-full'
								/>
							</Form.Item>
						))}
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

const RangedDateFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => {
	const range = [
		{ value: 'Min', label: 'から' },
		{ value: 'Max', label: 'まで' },
	]
	return (
		<>
			<Divider>{memberAttribute.label}で検索</Divider>
			<Row gutter={[16, 16]} justify='start'>
				<Col xs={{ span: 24 }}>
					<Form.Item className='mb-0'>
						{range.map((bound, index) => (
							<Form.Item
								help={`${memberAttribute.label}${bound.label}`}
								name={`memberAttributeFilter${memberAttribute.memberAttributeId}${bound.value}`}
								key={`memberAttributeFilter${memberAttribute.memberAttributeId}${bound.value}_${index}`}
								className={`inline-block ${
									index !== range.length - 1 ? 'mr-2' : ''
								} mb-4`}
								style={{ width: 'calc(50% - 0.25rem)' }}
							>
								{/* <CustomDatePicker placeholder="日付で検索" className="w-full" inputReadOnly /> */}
								<CustomDatePicker className='w-full' inputReadOnly />
							</Form.Item>
						))}
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

const SingleExistenceSelectFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => (
	<>
		<Divider>{memberAttribute.label}で検索</Divider>
		<Row gutter={[16, 16]} justify='start'>
			<Col xs={{ span: 24 }}>
				<Form.Item
					// help={memberAttribute.label}
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
			</Col>
		</Row>
	</>
)

const MultiSelectFilter = ({ memberAttribute }: { memberAttribute: MemberAttribute }) => {
	const { attributeChoices } = memberAttribute
	if (!attributeChoices || attributeChoices?.length == 0) return <></>
	return (
		<>
			<Divider>{memberAttribute.label}で検索</Divider>
			<Row gutter={[16, 16]} justify='start'>
				<Col xs={{ span: 24 }}>
					<Form.Item
						// help={memberAttribute.label}
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
				</Col>
			</Row>
		</>
	)
}

const AudienceMemberAttributeFilters = ({
	memberAttributes,
}: {
	memberAttributes: MemberAttribute[]
}) =>
	memberAttributes.map((memberAttribute: MemberAttribute) => (
		<React.Fragment key={`AudienceMemberAttributeFilters-${memberAttribute.memberAttributeId}`}>
			{/* Create 1 filter single select input: 有り／無し */}
			{memberAttribute.type === 'image' ? (
				<SingleExistenceSelectFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
			{/* Create 1 filter input */}
			{memberAttribute.type === 'text' ||
			memberAttribute.type === 'address' ||
			memberAttribute.type === 'textarea' ||
			memberAttribute.type === 'color' ||
			memberAttribute.type === 'url' ||
			memberAttribute.type === 'email' ||
			memberAttribute.type === 'telephone' ||
			memberAttribute.type === 'firstName' ||
			memberAttribute.type === 'lastName' ||
			memberAttribute.type === 'firstNameKana' ||
			memberAttribute.type === 'lastNameKana' ||
			memberAttribute.type === 'address_postal' ? (
				<SimpleFilterInput memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
			{/* Create 2 filter input: 最低：最高 */}
			{memberAttribute.type === 'number' ||
			memberAttribute.type === 'number_integer' ||
			memberAttribute.type === 'number_float' ? (
				<RangedNumberFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
			{/* Create 2 filter date select input: から、まで */}
			{memberAttribute.type === 'datepicker' ||
			memberAttribute.type === 'date' ||
			memberAttribute.type === 'time' ||
			memberAttribute.type === 'datetime' ? (
				<RangedDateFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}

			{/* Create 1 dropdown multiselect filter input */}
			{memberAttribute.type === 'checkbox' ||
			memberAttribute.type === 'radio' ||
			memberAttribute.type === 'select' ? (
				<MultiSelectFilter memberAttribute={memberAttribute} />
			) : (
				<></>
			)}
		</React.Fragment>
	))
export default AudienceMemberAttributeFilters
