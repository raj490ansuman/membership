import React, { useState, useEffect } from 'react'
import { Button, Card, message, Table, Modal, Tooltip, Tag } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { io } from 'socket.io-client'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { AudienceModalComponent, BaseAnimationComponent, PageHeaderComponent } from '@/components'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { filterLabels } from '@/utils/common'
import { useListMemberAttributes } from '@/queries'

const Audiences = (props: Props) => {
	const { publicSettings } = props

	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const [categories, setCategories] = useState<any>([])
	const [occasions, setOccasions] = useState<any>([])
	const [audiences, setAudiences] = useState([])

	const [isAudienceModalVisible, setIsAudienceModalVisible] = useState(false)

	const [modal, contextHolder] = Modal.useModal()

	const { data } = useListMemberAttributes()
	const memberAttributes = data?.body?.data?.filter((item) => item?.isAdminDisplayed) || []

	// useQuery([API.QUERY_KEY_ADMIN_CATEGORY_TEMPLATES], () => API.ADMIN_GET_CATEGORY_TEMPLATES(), {
	// 	onSuccess: (response) => {
	// 		if (isMountedRef.current) {
	// 			setCategories(response?.data || [])
	// 		}
	// 	}
	// })

	// useQuery([API.QUERY_KEY_ADMIN_OCCASION_TEMPLATES], () => API.ADMIN_GET_OCCASION_TEMPLATES(), {
	// 	onSuccess: (response) => {
	// 		if (isMountedRef.current) {
	// 			setOccasions(response?.data || [])
	// 		}
	// 	}
	// })

	useQuery([API.QUERY_KEY_ADMIN_AUDIENCES], () => API.ADMIN_GET_AUDIENCES(), {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setAudiences(response?.data || [])
			}
		},
	})

	const audienceDeleteMutation = useMutation(API.ADMIN_DELETE_AUDIENCE, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_AUDIENCES],
			})
		},
	})

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_AUDIENCE, (response) => {
			queryClient.invalidateQueries({
				queryKey: [API.QUERY_KEY_ADMIN_AUDIENCES],
			})
		})

		return () => {
			socket.off(API.SOCKET_AUDIENCE)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const handleAudienceDelete = (audience: { audienceGroupId: number; description: string }) => {
		const paramData = {
			audienceGroupId: audience.audienceGroupId,
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className='text-red-600' />,
			content: (
				<p>
					<span className='text-red-600'>{audience.description || 'ー'}</span>
					を削除してもよろしいでしょうか？
				</p>
			),
			okText: '削除',
			okButtonProps: {
				type: 'primary',
				danger: true,
			},
			cancelText: '閉じる',
			centered: true,
			onOk() {
				audienceDeleteMutation.mutate(paramData)
			},
		})
	}

	const showAudienceModal = () => {
		setIsAudienceModalVisible(true)
	}

	const hideAudienceModal = () => {
		setIsAudienceModalVisible(false)
	}

	const renderSearchConditionMemberAttributeTag = (
		conditionName: string,
		conditionValue: unknown,
	) => {
		let actualId: number = Number.NEGATIVE_INFINITY
		let rangeLabel: string = ''
		let childrenContent = <></>

		const memberAttributeId = conditionName.substring('memberAttributeFilter'.length)

		if (memberAttributeId.endsWith('Min')) {
			actualId = Number(memberAttributeId.substring(0, memberAttributeId.length - 3))
			rangeLabel = 'から'
		} else if (memberAttributeId.endsWith('Max')) {
			actualId = Number(memberAttributeId.substring(0, memberAttributeId.length - 3))
			rangeLabel = 'まで'
		} else {
			actualId = Number(memberAttributeId)
		}

		const memberAttribute = memberAttributes.find(
			(item: { memberAttributeId: number }) => item?.memberAttributeId === actualId,
		)

		if (isNaN(actualId) || !memberAttribute) return
		const { type, label } = memberAttribute

		switch (type) {
			case 'address':
			case 'text':
			case 'textarea':
			case 'color':
			case 'url':
			case 'email':
			case 'telephone':
			case 'firstName':
			case 'lastName':
			case 'firstNameKana':
			case 'lastNameKana':
			case 'address_postal':
			case 'address_prefecture':
			case 'address_city':
			case 'address_address':
			case 'address_building': {
				childrenContent = (
					<Tag color={COMMONS.CUSTOM_GREEN}>
						{label}：{conditionValue ? conditionValue : 'ー'}
					</Tag>
				)
				break
			}
			case 'number_integer':
			case 'number_float': {
				childrenContent = (
					<Tag color={COMMONS.CUSTOM_GREEN}>
						{label + rangeLabel}：{conditionValue ? conditionValue : 'ー'}
					</Tag>
				)
				break
			}
			case 'date':
			case 'time':
			case 'datetime': {
				childrenContent = (
					<Tag color={rangeLabel === 'から' ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}>
						{label + rangeLabel}：
						{conditionValue ? moment(conditionValue).format('YYYY年M月D日') : 'ー'}
					</Tag>
				)
				break
			}
			case 'checkbox':
			case 'radio':
			case 'select': {
				childrenContent = (
					<Tag color={COMMONS.CUSTOM_GREEN}>
						{label}：
						{conditionValue && Array.isArray(conditionValue)
							? conditionValue.join(',')
							: 'ー'}
					</Tag>
				)
				break
			}
			case 'image': {
				childrenContent = (
					<Tag color={COMMONS.CUSTOM_GREEN}>
						{label}：{conditionValue == 'hasImage' ? '有り' : '無し'}
					</Tag>
				)
				break
			}
		}
		return (
			<div>
				<p className='p-1 m-1 rounded bg-amber-50'>{childrenContent}</p>
			</div>
		)
	}

	/**
	 * Render search condition tag based on custom registration information
	 */
	const renderSearchConditionTag = ([conditionName, conditionValue]: [
		conditionName: string | number | boolean | Date,
		conditionValue: string | number | boolean | Date,
	]) => {
		if (conditionName === 'audienceName') return
		if (typeof conditionName === 'string' && conditionName.includes('memberAttributeFilter')) {
			return renderSearchConditionMemberAttributeTag(conditionName, conditionValue)
		}
		// TODO: Make determining condition type dynamic and retrieving label dynamic
		// e.g. lastVisitFilterMax => '最終来店日まで'
		switch (conditionName) {
			case 'createdAtMin':
			case 'createdAtMax':
			case 'memberSinceMin':
			case 'memberSinceMax':
			case 'lastVisitMin':
			case 'lastVisitMax': {
				return (
					<div>
						<p className='p-1 m-1 rounded bg-amber-50'>
							<Tag
								color={
									conditionName.endsWith('Min')
										? COMMONS.CUSTOM_GREEN
										: COMMONS.CUSTOM_RED
								}
							>
								{filterLabels[conditionName]}：
								{conditionValue
									? moment(conditionValue as string).format('YYYY年M月D日')
									: 'ー'}
							</Tag>
						</p>
					</div>
				)
			}
			case 'isFriends':
			case 'isRegistered':
			case 'messages': {
				const conditionLabel = filterLabels[conditionName].label
				const conditionValueMap: {
					[key: string]:
						| { label: string; value: string | number | boolean | Date }
						| string
				} = filterLabels[conditionName]
				let conditionDisplayValue =
					conditionValueMap[conditionValue as keyof typeof conditionValueMap]
				if (typeof conditionDisplayValue !== 'string') {
					conditionDisplayValue = conditionDisplayValue.label
				}
				return (
					<div>
						<p className='p-1 m-1 rounded bg-amber-50'>
							<Tag color={COMMONS.CUSTOM_GREEN}>
								{conditionLabel}：
								{conditionValue !== null || conditionValue !== undefined
									? conditionDisplayValue
									: 'ー'}
							</Tag>
						</p>
					</div>
				)
			}
		}
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'audienceGroupId',
			align: 'center',
			width: 100,
			sorter: (a: { audienceGroupId: number }, b: { audienceGroupId: number }) =>
				a.audienceGroupId - b.audienceGroupId,
			sortDirections: ['ascend', 'descend'],
			render: (audienceGroupId: number) => audienceGroupId ?? 'ー',
		},
		{
			title: 'オーディエンス名',
			dataIndex: 'description',
			align: 'center',
			width: 150,
			sorter: (a: { description: string }, b: { description: string }) =>
				(a.description || '').localeCompare(b.description || ''),
			sortDirections: ['ascend', 'descend'],
			render: (description: string) => description ?? 'ー',
		},
		{
			title: '件数',
			dataIndex: 'audienceCount',
			align: 'center',
			width: 50,
			sorter: (a: { audienceCount: number }, b: { audienceCount: number }) =>
				a.audienceCount - b.audienceCount,
			sortDirections: ['ascend', 'descend'],
			render: (audienceCount: number) => audienceCount ?? 'ー',
		},
		{
			title: '検索条件',
			dataIndex: 'audience',
			align: 'center',
			width: 350,
			render: (audience: {
				remarks: {
					questions: any
				}
				searchCondition: {
					categoryId: number
					occasionId: number
					isCampaign: boolean
					address: string
					hasWon: boolean
					candidateAtMin: Date
					candidateAtMax: Date
					isRegistered: boolean
					isFriends: boolean
					messages: 'unread' | 'read'
					createdAtMin: Date
					createdAtMax: Date
					memberSinceMin: Date
					memberSinceMax: Date
				}
			}) => (
				<div className='flex flex-row justify-center flex-wrap'>
					{audience?.searchCondition && audience?.searchCondition?.categoryId ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag>
									{`${COMMONS.DEFAULT_SYSTEM_TYPE}：
                  ${
						categories.find(
							(c: { categoryId: number }) =>
								c?.categoryId === audience.searchCondition.categoryId,
						)?.title || 'ー'
					}`}
								</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.searchCondition && audience?.searchCondition?.occasionId ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag>
									{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム：
                  ${
						occasions.find(
							(c: { occasionId: number }) =>
								c?.occasionId === audience.searchCondition.occasionId,
						)?.title || 'ー'
					}`}
								</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.searchCondition &&
					audience?.searchCondition?.isCampaign !== undefined ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag>
									{audience.searchCondition.isCampaign
										? 'キャンペーン応募済み'
										: 'キャンペーン応募してない'}
								</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.searchCondition && audience?.searchCondition?.address ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag>住所：{audience.searchCondition.address || 'ー'}</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.searchCondition &&
					audience?.searchCondition?.hasWon !== undefined ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag>
									{audience.searchCondition.isCampaign ? '当選済み' : '当選待ち'}
								</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.searchCondition && audience?.searchCondition?.candidateAtMin ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag color={COMMONS.CUSTOM_GREEN}>
									抽選日：
									{audience.searchCondition.candidateAtMin
										? moment(audience.searchCondition.candidateAtMin).format(
												'YYYY年M月D日',
										  )
										: 'ー'}
									から
								</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.searchCondition && audience?.searchCondition?.candidateAtMax ? (
						<div>
							<p className='p-1 m-1 rounded bg-amber-50'>
								<Tag color={COMMONS.CUSTOM_RED}>
									抽選日：
									{audience.searchCondition.candidateAtMax
										? moment(audience.searchCondition.candidateAtMax).format(
												'YYYY年M月D日',
										  )
										: 'ー'}
									まで
								</Tag>
							</p>
						</div>
					) : (
						''
					)}
					{audience?.remarks?.questions && audience?.remarks?.questions?.length > 0
						? audience.remarks.questions.map(
								(q: { contents: string; value: any; questionId: number }) => (
									<div key={q.questionId}>
										<Tooltip
											placement='top'
											title={q?.contents || 'ー'}
											color={publicSettings?.PRIMARY_COLOR?.valueString}
										>
											<p className='p-1 m-1 rounded bg-amber-50'>
												<Tag>
													{Array.isArray(q?.value)
														? q.value.join()
														: q?.value || 'ー'}
												</Tag>
											</p>
										</Tooltip>
									</div>
								),
						  )
						: ''}
					{Object.entries(audience.searchCondition).map(renderSearchConditionTag)}
				</div>
			),
		},
		{
			title: '状態',
			dataIndex: 'status',
			align: 'center',
			width: 100,
			render: (status: any) => (status ? COMMONS.GET_AUDIENCE_STATUS(status) : 'ー'),
		},
		{
			title: '作成日',
			dataIndex: 'created',
			align: 'center',
			width: 120,
			sorter: (a: { created: any }, b: { created: any }) => a.created - b.created,
			sortDirections: ['ascend', 'descend'],
			render: (created: any) =>
				created ? (
					<>
						{moment.unix(created).format('YYYY年M月D日')}
						<br />
						{moment.unix(created).format('HH:mm')}
					</>
				) : (
					'ー'
				),
		},
		{
			title: '有効期限',
			dataIndex: 'expireTimestamp',
			align: 'center',
			width: 120,
			sorter: (a: any, b: any) => a.expireTimestamp - b.expireTimestamp,
			sortDirections: ['ascend', 'descend'],
			render: (expireTimestamp: any) =>
				expireTimestamp ? (
					<>
						{moment.unix(expireTimestamp).format('YYYY年M月D日')}
						<br />
						{moment.unix(expireTimestamp).format('HH:mm')}
					</>
				) : (
					'ー'
				),
		},
		{
			title: '',
			dataIndex: 'action',
			align: 'center',
			width: 50,
			render: (audience: any) => (
				<>
					<Tooltip title='削除' placement='top'>
						<Button
							className='m-1'
							icon={<DeleteOutlined />}
							danger
							onClick={() => {
								handleAudienceDelete(audience)
							}}
						/>
					</Tooltip>
				</>
			),
		},
	]

	return (
		<>
			<BaseAnimationComponent>
				<PageHeaderComponent publicSettings={publicSettings} title='オーディエンス' />
				<Card bordered={false} className='shadow-none'>
					<motion.div
						className='flex flex-col'
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
						initial='hidden'
						animate='show'
						exit='hidden'
					>
						<motion.div
							className='flex justify-end mb-2'
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						>
							<Button
								type='primary'
								size='large'
								icon={<PlusOutlined />}
								onClick={showAudienceModal}
							>
								新規作成
							</Button>
						</motion.div>
						<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
							<Table
								bordered
								size='small'
								//@ts-expect-error
								columns={columns}
								dataSource={
									audiences.length > 0
										? audiences.map(
												(a: {
													audienceGroupId: number
													description: string
													audienceCount: number
													status: string
													created: any
													expireTimestamp: any
												}) => {
													return {
														key: a.audienceGroupId,
														audienceGroupId: a?.audienceGroupId,
														description: a?.description,
														audienceCount: a?.audienceCount,
														audience: a,
														status: a?.status,
														created: a?.created,
														expireTimestamp: a?.expireTimestamp,
														action: a,
													}
												},
										  )
										: []
								}
								scroll={{
									x: 640,
									y: 720,
								}}
								locale={{ emptyText: 'オーディエンスのデータがありません' }}
								pagination={{
									responsive: true,
									showTotal: (total, range) =>
										`全${total}件中${range[0]}～${range[1]}件目`,
									defaultCurrent: 1,
									defaultPageSize: 20,
									position: ['bottomCenter'],
								}}
							/>
						</motion.div>
					</motion.div>
				</Card>
			</BaseAnimationComponent>
			<AudienceModalComponent
				{...props}
				isAudienceModalVisible={isAudienceModalVisible}
				hideAudienceModal={hideAudienceModal}
				memberAttributes={memberAttributes}
			/>
			{contextHolder}
		</>
	)
}

export default Audiences
