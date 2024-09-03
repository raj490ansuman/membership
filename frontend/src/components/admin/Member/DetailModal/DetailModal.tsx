import {
	Button,
	Divider,
	Image,
	Modal,
	Descriptions,
	message,
	List,
	Avatar,
	Dropdown,
	MenuProps,
} from 'antd'
import {
	EyeOutlined,
	CheckCircleFilled,
	CheckCircleOutlined,
	MinusCircleOutlined,
	DeleteOutlined,
	EllipsisOutlined,
	MoreOutlined,
	EditOutlined,
} from '@ant-design/icons'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import styled from 'styled-components'
import dayjs from 'dayjs'

const MemberActionsDiv = styled.div`
	.ant-dropdown-trigger {
		font-size: 18px;
		margin-right: 1.5em;
		position: relative;
		top: -4px;
	}
`

const DetailModal = (props) => {
	const {
		publicSettings,
		isMemberDetailModalVisible,
		hideMemberDetailModal,
		currentMember,
		memberAttributes,
		handleMemberDelete,
		showMemberEditDetailModal,
	} = props

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const [campaignQuestions, setCampaignQuestions] = useState([])
	const [dataMember, setDataMember] = useState([])

	// useQuery([API.QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS], () => API.ADMIN_GET_CAMPAIGN_QUESTIONS(), {
	// 	onSuccess: (response) => {
	// 		if (isMountedRef.current) {
	// 			setCampaignQuestions(response?.data || [])
	// 		}
	// 	}
	// })

	useEffect(() => {
		const dataMemberAttributes = memberAttributes?.map((item) => {
			const column = `memberAttributeId${item?.memberAttributeId}`
			return {
				...item,
				value: currentMember?.[column] || '',
			}
		})

		setDataMember(dataMemberAttributes)
	}, [memberAttributes, currentMember])

	const handleMemberAttributes = (item: MemberAttribute & { value: string }, index: number) => {
		if (
			item?.type === 'text' ||
			item?.type === 'textarea' ||
			item?.type === 'url' ||
			item?.type === 'number_integer' ||
			item?.type === 'number_float' ||
			item?.type === 'radio' ||
			item?.type === 'time' ||
			item?.type === 'checkbox' ||
			item?.type === 'email' ||
			item?.type === 'telephone' ||
			item?.type === 'firstName' ||
			item?.type === 'lastName' ||
			item?.type === 'firstNameKana' ||
			item?.type === 'lastNameKana'
		) {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					<p className='text-sm'>{item.value || 'ー'}</p>
				</Descriptions.Item>
			)
		}
		if (
			item?.type === 'address_postal'
			// item?.type === 'address_prefecture' ||
			// item?.type === 'address_city' ||
			// item?.type === 'address_address' ||
			// item?.type === 'address_building'
		) {
			const addressStr = COMMONS.generateMemberAttributeAddressStr({
				member: currentMember,
				memberAttributes,
				addrGroupSection: item.section,
			})
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					<p className='text-sm'>{addressStr}</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'date') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					<p className='text-sm'>
						{item.value ? dayjs(item.value).format('YYYY年M月D日') : 'ー'}
					</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'select') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					<p className='text-sm'>{item.value || 'ー'}</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'datetime') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					<p className='text-sm'>
						{item.value ? dayjs(item.value).format('YYYY年M月D日 HH:mm') : 'ー'}
					</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'color') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					<div
						style={{
							backgroundColor: item.value,
							width: '50px',
							height: '50px',
							border: '1px solid #000',
						}}
					></div>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'image') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					{item.value ? (
						<Image
							preview={true}
							className='w-20 h-20'
							src={
								API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(item.memberAttributeId) +
								`/${item.value}`
							}
						/>
					) : (
						<Image preview={true} className='w-20 h-20' src='/no-image.png' />
					)}
				</Descriptions.Item>
			)
		}
		if (item?.type === 'video') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					{item.value ? (
						<video width='320' height='240' controls>
							<source
								src={
									API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(
										item.memberAttributeId,
									) + `/${item.value}`
								}
							/>
							Your browser does not support the video tag.
						</video>
					) : (
						<p>動画がありません</p>
					)}
				</Descriptions.Item>
			)
		}
		if (item?.type === 'file') {
			return (
				<Descriptions.Item
					className='text-sm text-left'
					label={<p className='text-center'>{item?.label}</p>}
					key={`membershipItem${index}`}
				>
					{item.value ? (
						<a
							href={
								API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(item.memberAttributeId) +
								`/${item.value}`
							}
							download
						>
							{item.value}
						</a>
					) : (
						<p>ファイルがありません</p>
					)}
				</Descriptions.Item>
			)
		}
	}

	const memberDetailActions = [
		{
			key: '0',
			label: (
				<>
					<EditOutlined className='text-base' />
					<span className='text-base ml-2'>編集</span>
				</>
			),
			onClick: () => showMemberEditDetailModal(),
		},
		{
			key: '1',
			label: (
				<>
					<DeleteOutlined className='text-base' />
					<span className='text-base ml-2'>削除</span>
				</>
			),
			onClick: () => handleMemberDelete(currentMember),
		},
	]

	return (
		<>
			<Modal
				title={
					<MemberActionsDiv className='flex justify-between'>
						<span>お客様詳細</span>
						<Dropdown
							menu={{ items: memberDetailActions }}
							trigger={['click']}
							placement='bottomRight'
						>
							<EllipsisOutlined />
						</Dropdown>
					</MemberActionsDiv>
				}
				open={isMemberDetailModalVisible}
				onCancel={hideMemberDetailModal}
				styles={{
					body: {
						maxHeight: '90vh',
						overflowY: 'auto',
						overflowX: 'hidden',
					},
				}}
				footer={null}
				destroyOnClose
				centered
			>
				<motion.div
					className='flex flex-col justify-center'
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<div className='flex justify-center'>
							{currentMember?.picUrl ? (
								<Image
									preview={{
										mask: <EyeOutlined />,
										src: currentMember.picUrl,
										maskClassName: 'rounded-full',
									}}
									width={100}
									height={100}
									style={{
										border: `4px solid ${COMMONS.WHITE_COLOR}`,
									}}
									className='rounded-full'
									src={`${currentMember.picUrl}/large`}
									fallback='/no-image.png'
								/>
							) : (
								<Image
									preview={false}
									width={100}
									height={100}
									style={{
										border: `4px solid ${COMMONS.WHITE_COLOR}`,
									}}
									className='rounded-full'
									src='/no-image.png'
								/>
							)}
						</div>
						{/* <div className="mb-8">
				<p className="text-center font-bold text-xl">
					{currentMember?.lastName || "ー"}{" "}
					{currentMember?.firstName || "ー"}様
				</p>
				<p className="text-center text-sm">
					（{currentMember?.lastNameKana || "ー"}{" "}
					{currentMember?.firstNameKana || "ー"}）
				</p>
				</div> */}
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<Descriptions column={1} layout='horizontal' bordered>
							<Descriptions.Item
								className='text-left'
								label={<p className='text-center'>ID</p>}
							>
								{currentMember?.memberId || 'ー'}
							</Descriptions.Item>
							<Descriptions.Item
								className='text-left'
								label={<p className='text-center'>会員コード</p>}
							>
								{currentMember?.memberCode || 'ー'}
							</Descriptions.Item>
							<Descriptions.Item
								className='text-left'
								label={<p className='text-center'>LINE名</p>}
							>
								{currentMember?.displayName || 'ー'}
							</Descriptions.Item>
							{dataMember?.map((item, index) => handleMemberAttributes(item, index))}
							{/* <Descriptions.Item label="電話番号" className="text-center">
					{currentMember?.telephone || "ー"}
				</Descriptions.Item>
				<Descriptions.Item label="メールアドレス" className="text-center">
					{currentMember?.email || "ー"}
				</Descriptions.Item>
				<Descriptions.Item label="住所" className="text-center">
					〒
					{`${
					currentMember?.postalCode
						? COMMONS.POSTAL_CODE_INSERT_CHARACTER(
							currentMember.postalCode,
							3,
							"-"
						)
						: "ー"
					} ${currentMember?.address || ""}${
					currentMember?.building || ""
					}`}
				</Descriptions.Item> */}
							{/* <Descriptions.Item label="キャンペーン" className="text-center">
									{currentMember?.isCampaign ? (
										currentMember?.candidateAt ? (
											<p>
												<CheckCircleFilled className="text-custom-green mr-1" />
												<span>当選済み</span>
											</p>
										) : (
											<p>
												<CheckCircleOutlined className="text-custom-green mr-1" />
												<span>当選待ち</span>
											</p>
										)
									) : (
										<p>
											<MinusCircleOutlined className="text-yellow-600" />
										</p>
									)}
								</Descriptions.Item>
								<Descriptions.Item label="当選⽇" className="text-center">
									{currentMember?.candidateAt
										? moment(currentMember.candidateAt).format('YYYY年M月D日')
										: 'ー'}
								</Descriptions.Item> */}
							<Descriptions.Item
								className='text-left'
								label={<p className='text-center'>会員登録日</p>}
							>
								{currentMember?.memberSince
									? moment(currentMember.memberSince).format('YYYY年M月D日')
									: 'ー'}
							</Descriptions.Item>
						</Descriptions>
					</motion.div>
					{currentMember?.campaignAnswers &&
					currentMember?.campaignAnswers?.length > 0 ? (
						<>
							<Divider>キャンペーン応募詳細</Divider>
							<List
								dataSource={campaignQuestions}
								itemLayout='horizontal'
								size='small'
								renderItem={(question, i) => (
									<List.Item>
										<List.Item.Meta
											avatar={
												<Avatar
													style={{
														color: COMMONS.WHITE_COLOR,
														backgroundColor:
															publicSettings?.PRIMARY_COLOR
																.valueString,
													}}
												>
													{i + 1}
												</Avatar>
											}
											title={
												<p className='whitespace-pre-wrap font-bold'>
													{question.contents}
												</p>
											}
											description={
												<p>
													{currentMember.campaignAnswers.find(
														(a) =>
															a?.campaignQuestionId ===
															question?.campaignQuestionId,
													)?.contents || 'ー'}
												</p>
											}
										/>
									</List.Item>
								)}
							/>
						</>
					) : (
						''
					)}
					<Divider />
					<motion.div
						className='flex justify-center'
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					>
						<TapAnimationComponent>
							<Button size='large' className='px-12' onClick={hideMemberDetailModal}>
								閉じる
							</Button>
						</TapAnimationComponent>
					</motion.div>
				</motion.div>
			</Modal>
		</>
	)
}

export default DetailModal
