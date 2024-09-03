import { SearchOutlined, UndoOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, DatePicker, Divider, Form, Input, Row, Select } from 'antd'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'
import MemberAttributeFilters from '../../../../components/admin/Member/MemberAttributeFilters'
import { useListMemberAttributes } from '@/queries'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`

// TODO: Collapse close animation sets inline style height to 0px before class min-height is applied causing flicker on collapse. Min-height pseudo elements also didn't work
const CollapsibleDynamicFilters = styled(Collapse)`
	.ant-collapse-item {
		display: flex;
		flex-direction: column;
	}
	.ant-collapse-header {
		order: 2;
		margin-left: auto;

		&[aria-expanded] {
			padding: 0 16px;
		}

		> .ant-collapse-expand-icon > .ant-collapse-arrow {
			font-size: 18px;
		}
	}
	.ant-collapse-content {
		&.ant-collapse-content-active,
		&.ant-collapse-content-inactive {
			min-height: 4em !important;
			> .ant-collapse-content-box {
				padding: 0 8px;
			}
		}
		&.ant-collapse-content-hidden,
		&.ant-collapse-content-inactive[style*='display: none'] {
			display: block !important;
			min-height: 4em !important;
			max-height: 4em;
			overflow: hidden;
		}
	}
`

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const { Option } = Select

const MembersFilters = ({ filters, setFilters }) => {
	const [memberFilterForm] = Form.useForm()
	const [customFiltersIsCollapsed, setCustomFiltersIsCollapsed] = useState(true)

	const { data } = useListMemberAttributes()
	const memberAttributes: MemberAttribute[] =
		data?.body?.data?.filter((item) => item?.isAdminDisplayed) || []

	const handleFilter = (data) => {
		const newFilters: { [key: string]: string | undefined } = {}

		Object.keys(data).forEach((key) => {
			if (key.includes('Min') && data[key]?.$isDayjsObject) {
				newFilters[key] = data[key] ? new Date(data[key].startOf('day')) : data[key]
			} else if (key.includes('Max') && data[key]?.$isDayjsObject) {
				newFilters[key] = data[key] ? new Date(data[key].endOf('day')) : data[key]
			} else {
				newFilters[key] = data[key]
			}
		})

		setFilters(newFilters)
	}

	const clearFilter = () => {
		const newFilters: { [key: string]: string | undefined } = {}

		Object.keys(filters).forEach((key) => {
			newFilters[key] = undefined
		})
		setFilters(newFilters)
		memberFilterForm.resetFields()
	}

	// Display as a collapsible if the first row of total colspan of 4 is exceeded
	const displayCollapsible =
		memberAttributes.reduce(
			(acc, cur) => acc + (cur.type == 'address' || cur.type == 'datepicker' ? 2 : 1),
			0,
		) > 4

	return (
		<Form
			form={memberFilterForm}
			name='memberFilterForm'
			onFinish={handleFilter}
			size='large'
			initialValues={COMMONS.DEFAULT_MEMBERS_FILTERS_STATE}
		>
			<Row gutter={[8, 8]} justify='end' className='mb-4'>
				<Col>
					<TapAnimationComponent>
						<Button type='dashed' icon={<UndoOutlined />} onClick={clearFilter}>
							フィルタークリア
						</Button>
					</TapAnimationComponent>
				</Col>
			</Row>
			<MotionRowComponent
				gutter={[16, 16]}
				justify='start'
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial='hidden'
				animate='show'
				exit='hidden'
			>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='LINE名' name='lineNameFilter' className='mb-4'>
						<Input placeholder='例：山田' allowClear />
					</Form.Item>
				</MotionColComponent>
				{/* <MotionColComponent
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										xs={{ span: 24 }}
										md={{ span: 12 }}
										lg={{ span: 6 }}
										xl={{ span: 6 }}
									>
										<Form.Item help="郵便番号・住所" name="addressFilter" className="mb-4">
											<Input placeholder="例：愛知県" allowClear />
										</Form.Item>
									</MotionColComponent> */}
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='会員登録' name='isRegisteredFilter' className='mb-4 w-full'>
						<Select placeholder='会員登録あり／会員登録なし' allowClear>
							<Option value={true}>会員登録あり</Option>
							<Option value={false}>会員登録なし</Option>
						</Select>
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='ブロック' name='isFriendsFilter' className='mb-4 w-full'>
						<Select
							placeholder='ブロックユーザーのみ／ブロックユーザーを含まない'
							allowClear
						>
							<Option value={0}>ブロックユーザーのみ</Option>
							<Option value={1}>ブロックユーザーを含まない</Option>
						</Select>
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='LINEチャット' name='messagesFilter' className='mb-4 w-full'>
						<Select placeholder='未読／既読' allowClear>
							<Option value='unread'>未読</Option>
							<Option value='read'>既読</Option>
						</Select>
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='友だち追加日から' name='createdAtMinFilter' className='mb-4'>
						<CustomDatePicker className='w-full' inputReadOnly />
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item
						help='友だち追加日まで'
						name='createdAtMaxFilter'
						className='mb-4 w-full'
					>
						<CustomDatePicker className='w-full' inputReadOnly />
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='会員登録日から' name='memberSinceMinFilter' className='mb-4'>
						<CustomDatePicker className='w-full' inputReadOnly />
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item
						help='会員登録日まで'
						name='memberSinceMaxFilter'
						className='mb-4 w-full'
					>
						<CustomDatePicker className='w-full' inputReadOnly />
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item help='最終来店日から' name='lastVisitMinFilter' className='mb-4'>
						<CustomDatePicker className='w-full' inputReadOnly />
					</Form.Item>
				</MotionColComponent>
				<MotionColComponent
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					xs={{ span: 24 }}
					md={{ span: 12 }}
					lg={{ span: 6 }}
					xl={{ span: 6 }}
				>
					<Form.Item
						help='最終来店日まで'
						name='lastVisitMaxFilter'
						className='mb-4 w-full'
					>
						<CustomDatePicker className='w-full' inputReadOnly />
					</Form.Item>
				</MotionColComponent>
				<Divider className='mt-0' />
			</MotionRowComponent>
			<MotionRowComponent
				gutter={[16, 16]}
				justify='start'
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial='hidden'
				animate='show'
				exit='hidden'
			>
				{/***************************************/}
				{/* DYNAMIC CUSTOMER REGISTERED FILTERS */}
				{/***************************************/}
				{/* TODO: Abstracting this out did not allow rendering properly */}
				{memberAttributes.length != 0 && (
					<CollapsibleDynamicFilters
						ghost
						items={[
							{
								key: 'dynamicFiltersCollapse1',
								label: displayCollapsible
									? customFiltersIsCollapsed
										? 'もっと見る'
										: '閉じる'
									: '',
								showArrow: displayCollapsible,
								forceRender: true,
								children: (
									<MotionRowComponent
										gutter={[16, 16]}
										justify='start'
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial='hidden'
										animate='show'
										exit='hidden'
										className='order-1'
									>
										<MemberAttributeFilters
											memberAttributes={memberAttributes}
										/>
									</MotionRowComponent>
								),
							},
						]}
						className='w-full'
						expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
						onChange={() => setCustomFiltersIsCollapsed(!customFiltersIsCollapsed)}
					/>
				)}

				{/***************************************/}
				{/***************************************/}
				{/***************************************/}
			</MotionRowComponent>
			<Row gutter={[8, 8]} justify='center' className='mt-4'>
				<Col>
					<TapAnimationComponent>
						<Button
							icon={<SearchOutlined />}
							type='primary'
							htmlType='submit'
							className='w-32'
						>
							検索
						</Button>
					</TapAnimationComponent>
				</Col>
			</Row>
		</Form>
	)
}

export default MembersFilters
