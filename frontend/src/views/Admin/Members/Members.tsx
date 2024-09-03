import {
	ExclamationCircleOutlined,
	EyeOutlined,
	SearchOutlined,
	UndoOutlined,
	CheckCircleOutlined,
	MinusCircleOutlined,
	DownOutlined,
	EditOutlined,
	PlusOutlined,
	DownloadOutlined,
} from '@ant-design/icons'
import {
	Badge,
	Button,
	Card,
	Col,
	Collapse,
	DatePicker,
	Divider,
	Form,
	Image,
	Input,
	message,
	Modal,
	Row,
	Select,
	Table,
	Tooltip,
} from 'antd'
import { API, COMMONS } from '@/utils'
import {
	BaseAnimationComponent,
	CandidateModalComponent,
	ChatModalComponent,
	MemberNoteModalComponent,
	MemberDetailModalComponent,
	MemberEditDetailModalComponent,
	PageHeaderComponent,
	TapAnimationComponent,
} from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import fileDownload from 'js-file-download'
import styled from 'styled-components'
import MemberVisit from '@/components/admin/Member/MemberVisit'
import { useListMemberAttributes } from '@/queries'
import MembersFilters from './components/MembersFilters'

const CustomDatePicker = styled(DatePicker)`
	.ant-picker-input > input {
		text-align: center;
	}
`
const MotionColComponent = motion(Col)

const Members = (props: Props) => {
	const { publicSettings } = props

	const queryClient = useQueryClient()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const isCampaignPage = useMatch(COMMONS.ADMIN_CAMPAIGN_MEMBERS_ROUTE)

	const memberId = searchParams.get('memberId')

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const [membersCSVForm] = Form.useForm()
	const [campaignWinnersCSVForm] = Form.useForm()
	const [campaignWinnersResetForm] = Form.useForm()
	const membersRef = useRef<any>()

	const [members, setMembers] = useState<any>([])
	const [currentMemberId, setCurrentMemberId] = useState<number | null>(null)

	const [isMemberRemarksModalVisible, setIsMemberRemarksModalVisible] = useState(false)
	const [isMemberDetailModalVisible, setIsMemberDetailModalVisible] = useState(false)
	const [isMemberEditDetailModalVisible, setIsMemberEditDetailModalVisible] = useState(false)
	const [isChatModalVisible, setIsChatModalVisible] = useState(false)
	const [isCandidateModalVisible, setIsCandidateModalVisible] = useState(false)

	const [paginationPerPage, setPaginationPerPage] = useState(20)
	const [paginationPage, setPaginationPage] = useState(1)
	const [paginationTotal, setPaginationTotal] = useState(0)
	const [paginationSort, setPaginationSort] = useState('desc')
	const [paginationSortKey, setPaginationSortKey] = useState('updatedAt')

	const [filters, setFilters] = useState<any>(COMMONS.DEFAULT_MEMBERS_FILTERS_STATE)

	const [modal, contextHolder] = Modal.useModal()

	const { data } = useListMemberAttributes()
	const memberAttributes: MemberAttribute[] =
		data?.body?.data?.filter((item) => item?.isAdminDisplayed) || []

	useQuery(
		[
			API.QUERY_KEY_ADMIN_MEMBERS,
			{
				paginationPerPage: paginationPerPage,
				paginationPage: paginationPage,
				paginationSort: paginationSort,
				paginationSortKey: paginationSortKey,
				filters: filters,
			},
		],
		() =>
			API.ADMIN_GET_MEMBERS(
				paginationPerPage,
				paginationPage,
				paginationSort,
				paginationSortKey,
				isCampaignPage,
				filters,
			),
		{
			keepPreviousData: true,
			onSuccess: (response: FetchResponse) => {
				if (isMountedRef.current) {
					if (response?.data?.rows && response.data.rows.length > 0) {
						setMembers(response.data.rows)
					} else {
						setMembers([])
					}

					setPaginationPerPage(response.data?.pp || 20)
					setPaginationPage(response.data?.p || 1)
					setPaginationTotal(response.data?.count || 0)
					setPaginationSort(response.data?.sort || 'desc')
					setPaginationSortKey(response.data?.sortKey || 'updatedAt')
				}
			},
		},
	)

	// Hook for member detail
	const memberDetailQuery = useQuery({
		enabled: !!currentMemberId,
		queryFn: async () => await API.ADMIN_GET_MEMBER({ memberId: currentMemberId }),
		queryKey: [API.QUERY_KEY_ADMIN_MEMBER_DETAIL, currentMemberId],
	})
	const currentMember: memberType = memberDetailQuery.data?.data || {}

	const memberDeleteMutation = useMutation(API.ADMIN_DELETE_MEMBER, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_MEMBERS] })
		},
	})

	const membersExportMutation = useMutation(API.ADMIN_EXPORT_MEMBERS, {
		onSuccess: (response: { data: string }) => {
			if (isMountedRef.current) {
				if (response?.data) {
					fileDownload(
						'\uFEFF' + response.data,
						`${moment().format('YYYYMMDDHHmm')}_お客様リスト.csv`,
						'text/csv',
					)
				}
			}
		},
		onError: (error: FetchError) => {
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
		},
	})

	const campaignWinnersExportMutation = useMutation(API.ADMIN_EXPORT_CAMPAIGN_WINNERS, {
		onSuccess: (response: { data: string }) => {
			if (isMountedRef.current) {
				if (response?.data) {
					fileDownload(
						'\uFEFF' + response.data,
						`${moment().format('YYYYMMDDHHmm')}_当選者リスト.csv`,
						'text/csv',
					)
				}
			}
		},
		onError: (error: FetchError) => {
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
		},
	})

	const campaignWinnersResetMutation = useMutation(API.ADMIN_RESET_CAMPAIGN_WINNERS, {
		onSuccess: () => {},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning(COMMONS.ERROR_SESSION_MSG)
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error(COMMONS.ERROR_SYSTEM_MSG)
			} else {
				message.error(COMMONS.ERROR_SYSTEM_MSG)
			}
		},
	})

	useEffect(() => {
		setFilters({
			...filters,
			memberId,
		})
		queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_MEMBERS] })
	}, [memberId, queryClient])

	useEffect(() => {
		membersRef.current = members
	}, [members])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_MEMBER, () => {
			queryClient.invalidateQueries({ queryKey: [API.QUERY_KEY_ADMIN_MEMBERS] })
		})

		socket.on(API.SOCKET_CHAT, (response: FetchResponse) => {
			if (
				membersRef.current?.find(
					(m: { memberId: number }) => m?.memberId === response?.memberId,
				)
			) {
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_ADMIN_MEMBERS],
				})
			}
		})

		return () => {
			socket.off(API.SOCKET_MEMBER)
			socket.off(API.SOCKET_CHAT)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

	const handleMemberDelete = (member: any) => {
		const paramData = {
			memberId: member.memberId,
		}

		modal.confirm({
			title: '確認',
			icon: <ExclamationCircleOutlined className='text-red-600' />,
			content: (
				<p>
					<span className='text-red-600'>{`${member.displayName || 'ー'}`}</span>
					様の情報を削除してもよろしいでしょうか？
				</p>
			),
			okText: '削除',
			okButtonProps: {
				size: 'large',
				type: 'primary',
				danger: true,
			},
			cancelText: '閉じる',
			cancelButtonProps: {
				size: 'large',
			},
			centered: true,
			onOk() {
				memberDeleteMutation.mutate(paramData)
				hideMemberDetailModal()
			},
		})
	}

	const handleMembersExport = () => {
		modal.confirm({
			title: '確認',
			content: (
				<>
					<div className='p-4 bg-amber-100 mb-4 rounded'>
						<p className='text-center whitespace-pre-wrap'>{`確認のためにログインパスワードを\n入力してください`}</p>
					</div>
					<Form
						form={membersCSVForm}
						preserve={false}
						layout='vertical'
						initialValues={{
							password: '',
						}}
					>
						<Form.Item
							name='password'
							label='ログインパスワード'
							rules={[
								{
									required: true,
									message: 'パスワードを入力してください',
								},
							]}
						>
							<Input.Password placeholder='パスワードを入力してください' />
						</Form.Item>
					</Form>
					<Divider />
					<p className='font-bold whitespace-pre-wrap text-center'>{`※検索条件に関わらず、すべての顧客情報を\nCSVに出力します`}</p>
				</>
			),
			okText: '確認',
			cancelText: '閉じる',
			centered: true,
			onOk(close) {
				membersCSVForm
					.validateFields()
					.then((values) => {
						const paramData = {
							password: values.password,
							...filters,
						}

						membersExportMutation.mutate(paramData, {
							onSuccess: (data, variables, context) => {
								close()
							},
						})
					})
					.catch((error) => {})
			},
		})
	}

	const handleCurrentCampaignWinnersExport = (memberIds: string | any[], close: any) => {
		if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
			const paramData = {
				memberIds: memberIds,
				isAllWinners: false,
			}

			campaignWinnersExportMutation.mutate(paramData, {
				onSuccess: (data, variables, context) => {
					close()
					hideCandidateModal()
				},
			})
		}
	}

	const handleAllCampaignWinnersExport = () => {
		modal.confirm({
			title: '確認',
			content: (
				<>
					<div className='p-4 bg-amber-100 mb-4 rounded'>
						<p className='text-center whitespace-pre-wrap'>{`確認のためにログインパスワードを\n入力してください`}</p>
					</div>
					<Form
						form={campaignWinnersCSVForm}
						preserve={false}
						layout='vertical'
						initialValues={{
							password: '',
						}}
					>
						<Form.Item
							name='password'
							label='ログインパスワード'
							rules={[
								{
									required: true,
									message: 'パスワードを入力してください',
								},
							]}
						>
							<Input.Password placeholder='パスワードを入力してください' />
						</Form.Item>
					</Form>
					<Divider />
					<p className='font-bold whitespace-pre-wrap text-center'>{`※検索条件に関わらず、すべての顧客情報を\nCSVに出力します`}</p>
				</>
			),
			okText: '確認',
			cancelText: '閉じる',
			centered: true,
			onOk(close) {
				campaignWinnersCSVForm
					.validateFields()
					.then((values) => {
						const paramData = {
							password: values.password,
							isAllWinners: true,
							...(isCampaignPage
								? {
										isCampaign: true,
								  }
								: {}),
							lineName: filters.lineNameFilter,
							address: filters.addressFilter,
							createdAtMin: filters.createdAtMin,
							createdAtMax: filters.createdAtMax,
							memberSinceMin: filters.memberSinceMinFilter,
							memberSinceMax: filters.memberSinceMaxFilter,
							lastVisitMin: filters.lastVisiteMinFilter,
							lastVisitMax: filters.lastVisiteMaxFilter,
						}

						campaignWinnersExportMutation.mutate(paramData, {
							onSuccess: (data, variables, context) => {
								close()
							},
						})
					})
					.catch((error) => {})
			},
		})
	}

	const handleWinnersResetInfo = (data: { count: any }) => {
		modal.success({
			title: <p className='text-lg font-bold'>リセット完了</p>,
			content: (
				<>
					<p className='font-bold'>
						当選者
						<span style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}>
							{data?.count || 0}
						</span>
						名の当選フラグがリセットされました。
					</p>
				</>
			),
			okText: '閉じる',
			centered: true,
		})
	}

	const handleWinnersReset = (data: { count: any }, paramData: any) => {
		modal.confirm({
			title: <p className='text-lg font-bold'>リセット確認</p>,
			content: (
				<>
					<p className='font-bold'>
						当選者
						<span style={{ color: COMMONS.CUSTOM_RED }}>{data?.count || 0}</span>
						名の当選フラグをリセットしますか？
					</p>
				</>
			),
			okText: 'リセットする',
			cancelText: '閉じる',
			centered: true,
			onOk(close) {
				campaignWinnersResetMutation.mutate(paramData, {
					onSuccess: (response, variables, context) => {
						queryClient.invalidateQueries({
							queryKey: [API.QUERY_KEY_ADMIN_MEMBERS],
						})

						handleWinnersResetInfo(response?.data)
						close()
					},
				})
			},
		})
	}

	const handleWinnersResetConfirm = () => {
		modal.confirm({
			title: <p className='text-lg font-bold'>抽選リストのリセット</p>,
			content: (
				<>
					<div className='p-4 bg-amber-100 mb-8 rounded'>
						<p
							style={{ color: COMMONS.CUSTOM_RED }}
							className='font-bold text-center whitespace-pre-wrap'
						>{`※すべての当選フラグがリセットされます。\n⼀度リセットすると元に戻せなく\nなりますので、ご注意下さい。\n\n当選日のフィルターで期間の設定を\n設定することができます。`}</p>
					</div>
					<Form
						form={campaignWinnersResetForm}
						preserve={false}
						layout='vertical'
						initialValues={{
							from: undefined,
							to: undefined,
						}}
					>
						<Form.Item>
							<Form.Item
								label='当選⽇から'
								name='from'
								className='inline-block mr-2 mb-4'
								style={{ width: 'calc(50% - 0.25rem)' }}
							>
								<CustomDatePicker
									className='w-full'
									placeholder='日付を選択'
									inputReadOnly
								/>
							</Form.Item>
							<Form.Item
								label='当選⽇まで'
								name='to'
								className='inline-block mb-4'
								style={{ width: 'calc(50% - 0.25rem)' }}
							>
								<CustomDatePicker
									className='w-full'
									placeholder='日付を選択'
									inputReadOnly
								/>
							</Form.Item>
						</Form.Item>
					</Form>
				</>
			),
			okText: '確認する',
			cancelText: '閉じる',
			centered: true,
			onOk(close) {
				campaignWinnersResetForm
					.validateFields()
					.then((values) => {
						const paramData = {
							...(values?.from && {
								from: moment(values.from).startOf('day').toISOString(),
							}),
							...(values?.to && {
								to: moment(values.to).endOf('day').toISOString(),
							}),
						}

						campaignWinnersResetMutation.mutate(paramData, {
							onSuccess: (response, variables, context) => {
								handleWinnersReset(response?.data, {
									...paramData,
									isConfirmed: true,
								})

								close()
							},
						})
					})
					.catch((error) => {})
			},
		})
	}

	const showMemberDetailModal = (memberId: number) => {
		setCurrentMemberId(memberId)
		queryClient.invalidateQueries([API.QUERY_KEY_ADMIN_MEMBER_DETAIL, memberId])
		setIsMemberDetailModalVisible(true)
	}

	const hideMemberDetailModal = () => {
		setIsMemberDetailModalVisible(false)
	}
	const showMemberEditDetailModal = () => {
		setIsMemberDetailModalVisible(false)
		setIsMemberEditDetailModalVisible(true)
	}

	const hideMemberEditDetailModal = () => {
		setIsMemberEditDetailModalVisible(false)
		setIsMemberDetailModalVisible(true)
	}

	const showChatModal = (member: any) => {
		setCurrentMemberId(member.memberId)
		queryClient.invalidateQueries([API.QUERY_KEY_ADMIN_MEMBER_DETAIL, member.memberId])
		setIsChatModalVisible(true)
	}

	const hideChatModal = () => {
		setIsChatModalVisible(false)
	}

	const showCandidateModal = () => {
		setIsCandidateModalVisible(true)
	}

	const hideCandidateModal = () => {
		setIsCandidateModalVisible(false)
	}

	const showMemberRemarksModal = (memberId: number) => {
		setCurrentMemberId(memberId)
		setIsMemberRemarksModalVisible(true)
	}

	const hideMemberRemarksModal = () => {
		setIsMemberRemarksModalVisible(false)
	}

	const commonStartColumns = [
		{
			title: 'ID',
			dataIndex: 'memberId',
			align: 'center',
			width: 50,
			sorter: (a: { memberId: number }, b: { memberId: number }) => a.memberId - b.memberId,
			sortDirections: ['ascend', 'descend'],
			fixed: 'left',
		},
		{
			title: (
				<>
					<span className='whitespace-nowrap'>LINE</span>
					<span className='whitespace-nowrap'>チャット</span>
				</>
			),
			dataIndex: 'member',
			align: 'center',
			width: 90,
			fixed: 'left',
			sorter: (memberA: { unreadCount: number }, memberB: { unreadCount: number }) =>
				memberB.unreadCount - memberA.unreadCount,
			sortDirections: ['ascend', 'descend'],
			render: (member: memberType) => (
				<TapAnimationComponent className='inline-block'>
					<Badge
						offset={[-1, 2]}
						style={{ backgroundColor: COMMONS.CUSTOM_GREEN }}
						count={member?.unreadCount || 0}
					>
						<Tooltip title='LINEチャット' placement='top'>
							<Image
								width={50}
								height={50}
								className='rounded-full'
								src={`${member.picUrl}/small`}
								fallback='/no-image.png'
								preview={false}
								onClick={() => showChatModal(member)}
							/>
						</Tooltip>
					</Badge>
				</TapAnimationComponent>
			),
		},
		{
			title: 'LINE名',
			dataIndex: 'displayName',
			align: 'center',
			width: 150,
		},
		// {
		//   title: "氏名",
		//   dataIndex: "fullName",
		//   align: "center",
		//   width: 150,
		//   render: (member) => (
		//     <>
		//       <p>
		//         {member?.lastName || "ー"} {member?.firstName || "ー"}
		//       </p>
		//       <p className="text-xs text-gray-400">
		//         （{member?.lastNameKana || "ー"} {member?.firstNameKana || "ー"}）
		//       </p>
		//     </>
		//   ),
		// },
		// {
		//   title: "電話番号",
		//   dataIndex: "telephone",
		//   align: "center",
		//   width: 120,
		// },
	]

	const commonEndColumns = [
		{
			title: '備考欄',
			dataIndex: 'member',
			align: 'center',
			width: 200,
			render: (member: memberType) =>
				member?.remarks ? (
					<div
						style={{
							fontSize: '14px',
							backgroundColor: '#fff7e6',
						}}
						className='m-1 p-2'
					>
						{member?.remarks || ''}
						<TapAnimationComponent className='inline-block'>
							<Button
								size='small'
								onClick={() => showMemberRemarksModal(Number(member?.memberId))}
								className='m-1'
								icon={<EditOutlined />}
							/>
						</TapAnimationComponent>
					</div>
				) : (
					<TapAnimationComponent className='inline-block'>
						<Button
							onClick={() => showMemberRemarksModal(Number(member?.memberId))}
							className='m-1'
							icon={<PlusOutlined />}
						>
							備考追加
						</Button>
					</TapAnimationComponent>
				),
		},
		{
			title: '来店回数',
			dataIndex: 'countVisit',
			align: 'center',
			width: 100,
			sorter: (a: { countVisit: number }, b: { countVisit: number }) =>
				a.countVisit - b.countVisit,
			render: (countVisit: number | string) => <>{countVisit || 'ー'}回</>,
		},
		{
			title: (
				<>
					<span className='whitespace-nowrap'>最終</span>
					<span className='whitespace-nowrap'>来店日</span>
				</>
			),
			dataIndex: 'lastVisit',
			align: 'center',
			width: 110,
			sorter: (a: memberType, b: memberType) =>
				COMMONS.compareDateTime(a.lastVisit as string, b.lastVisit as string),
			sortDirections: ['ascend', 'descend'],
			render: (lastVisit: Date) => (
				<>{lastVisit ? moment(lastVisit).format('YYYY年M月D日') : 'ー'}</>
			),
		},
		{
			title: 'ポイント',
			dataIndex: 'kakeruPoint',
			align: 'center',
			width: 90,
			sorter: (a: memberType, b: memberType) => a.kakeruPoint - b.kakeruPoint,
			sortDirections: ['ascend', 'descend'],
			render: (kakeruPoint: number) => <>{kakeruPoint ? kakeruPoint : '0'}</>,
		},
		{
			title: (
				<>
					<span className='whitespace-nowrap'>友だち</span>
					<span className='whitespace-nowrap'>登録日</span>
				</>
			),
			dataIndex: 'createdAt',
			align: 'center',
			width: 110,
			sorter: (a: memberType, b: memberType) =>
				COMMONS.compareDateTime(a.createdAt as string, b.createdAt as string),
			sortDirections: ['ascend', 'descend'],
			render: (createdAt: Date) => (
				<>{createdAt ? moment(createdAt).format('YYYY年M月D日') : 'ー'}</>
			),
		},
		{
			title: (
				<>
					<span className='whitespace-nowrap'>会員</span>
					<span className='whitespace-nowrap'>登録日</span>
				</>
			),
			dataIndex: 'memberSince',
			align: 'center',
			width: 110,
			sorter: (a: memberType, b: memberType) =>
				COMMONS.compareDateTime(a.memberSince as string, b.memberSince as string),
			sortDirections: ['ascend', 'descend'],
			render: (memberSince: Date) => (
				<>{memberSince ? moment(memberSince).format('YYYY年M月D日') : 'ー'}</>
			),
		},
		{
			title: '有効期限',
			dataIndex: 'activeUntil',
			align: 'center',
			width: 90,
			sorter: (a: memberType, b: memberType) =>
				COMMONS.compareDateTime(a.activeUntil as string, b.activeUntil as string),
			sortDirections: ['ascend', 'descend'],
			render: (activeUntil: Date) => (
				<>{activeUntil ? moment(activeUntil).format('YYYY年M月D日') : 'ー'}</>
			),
		},
		{
			title: '詳細',
			dataIndex: 'member',
			align: 'center',
			width: 50,
			render: (member: memberType) => (
				<>
					<TapAnimationComponent className='inline-block'>
						<Tooltip title='詳細' placement='top'>
							<Button
								size='large'
								className='m-1'
								icon={<EyeOutlined />}
								onClick={() => {
									//@ts-expect-error
									showMemberDetailModal(member?.memberId)
								}}
							/>
						</Tooltip>
					</TapAnimationComponent>
					{/* <Divider type="vertical" />
					<TapAnimationComponent className="inline-block">
						<Tooltip title="削除" placement="top">
							<Button
								size="large"
								className="m-1"
								icon={<DeleteOutlined />}
								danger
								onClick={() => {
									handleMemberDelete(member)
								}}
							/>
						</Tooltip>
					</TapAnimationComponent> */}
				</>
			),
		},
	]

	const campaignMemberColumns = [
		...commonStartColumns,
		...[
			{
				title: `当選`,
				dataIndex: 'candidateAt',
				align: 'center',
				className: 'whitespace-pre-wrap',
				width: 50,
				render: (candidateAt: Date) => (
					<>
						{candidateAt ? (
							<CheckCircleOutlined className='text-lg text-custom-green' />
						) : (
							<MinusCircleOutlined className='text-lg text-yellow-600' />
						)}
					</>
				),
			},
		],
		...commonEndColumns,
	]

	const commonColumnRender = (value: string) => (
		<p className='text-sm whitespace-pre-wrap'>{value ?? ''}</p>
	)

	const getMemberAttributeColumn = useCallback(
		(memberAttribute: MemberAttribute) => {
			switch (memberAttribute.type) {
				case 'text':
				case 'textarea':
				case 'color':
				case 'url':
				case 'number_integer':
				case 'number_float':
				case 'select':
				case 'radio':
				case 'checkbox':
				case 'email':
				case 'telephone':
				case 'firstName':
				case 'lastName':
				case 'firstNameKana':
				case 'lastNameKana':
				case 'time': {
					return {
						title: memberAttribute.label,
						width: 200,
						dataIndex: `memberAttributeId${memberAttribute.memberAttributeId}`,
						render: commonColumnRender,
						sorter: (a: memberType, b: memberType) => {
							const key = `memberAttributeId${memberAttribute.memberAttributeId}`
							const aValue = a[key as keyof memberType] as string
							const bValue = b[key as keyof memberType] as string
							if (aValue === null) return 1 // Move null values to the end
							if (bValue === null) return -1
							return aValue.localeCompare(bValue)
						},
						sortDirections: ['ascend', 'descend'],
					}
				}
				// Combine address fields under the assumption that postal code is required
				case 'address_postal': {
					// case 'address_prefecture':
					// case 'address_city':
					// case 'address_address':
					// case 'address_building':
					return {
						title: memberAttribute.label,
						width: 200,
						dataIndex: `member`, // We need access to the entire member object to get the address parts
						render: (member: memberType) => {
							const addressStr = COMMONS.generateMemberAttributeAddressStr({
								member,
								memberAttributes,
								addrGroupSection: memberAttribute.section,
							})

							return commonColumnRender(addressStr)
						},
						sorter: (a: memberType, b: memberType) => {
							const key = `memberAttributeId${memberAttribute.memberAttributeId}`
							const aValue = a[key as keyof memberType] as string
							const bValue = b[key as keyof memberType] as string
							if (aValue === null) return 1 // Move null values to the end
							if (bValue === null) return -1
							return aValue.localeCompare(bValue)
						},
						sortDirections: ['ascend', 'descend'],
					}
				}
				case 'date': {
					return {
						title: memberAttribute.label,
						width: 137,
						dataIndex: `memberAttributeId${memberAttribute.memberAttributeId}`,
						render: (value: string) =>
							value
								? moment(value).format('YYYY年M月D日 ')
								: commonColumnRender(value),
						sorter: (a: memberType, b: memberType) => {
							const key = `memberAttributeId${memberAttribute.memberAttributeId}`
							const aValue = a[key as keyof memberType] as string
							const bValue = b[key as keyof memberType] as string
							if (aValue === null) return 1 // Move null values to the end
							if (bValue === null) return -1
							return COMMONS.compareDateTime(aValue, bValue)
						},
						sortDirections: ['ascend', 'descend'],
					}
				}
				case 'datetime': {
					return {
						title: memberAttribute.label,
						width: 137,
						dataIndex: `memberAttributeId${memberAttribute.memberAttributeId}`,
						render: (value: string) =>
							value
								? moment(value).format('YYYY年M月D日 HH:mm ')
								: commonColumnRender(value),
						sorter: (a: memberType, b: memberType) => {
							const key = `memberAttributeId${memberAttribute.memberAttributeId}`
							const aValue = a[key as keyof memberType] as string
							const bValue = b[key as keyof memberType] as string
							if (aValue === null) return 1 // Move null values to the end
							if (bValue === null) return -1
							return COMMONS.compareDateTime(aValue, bValue)
						},
						sortDirections: ['ascend', 'descend'],
					}
				}
				case 'image': {
					return {
						title: memberAttribute.label,
						align: 'center',
						width: 130,
						dataIndex: `memberAttributeId${memberAttribute.memberAttributeId}`,
						render: (value: string) => (
							<>
								{value ? (
									<Image
										preview={true}
										className='object-contain max-w-full max-h-full m-auto'
										src={
											API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(
												memberAttribute.memberAttributeId,
											) + `/${value}`
										}
									/>
								) : (
									<Image
										preview={true}
										className='w-20 h-20'
										src='/no-image.png'
									/>
								)}
							</>
						),
						sorter: (a: memberType, b: memberType) => {
							const key = `memberAttributeId${memberAttribute.memberAttributeId}`
							if (
								a[key as keyof memberType] === null ||
								a[key as keyof memberType] === ''
							)
								return 1 // Move null values to the end
							if (
								b[key as keyof memberType] === null ||
								b[key as keyof memberType] === ''
							)
								return -1
							return 0
						},
						sortDirections: ['ascend', 'descend'],
					}
				}
				default:
					return null
			}
		},
		[memberAttributes],
	)

	const memberColumns = [
		...commonStartColumns,
		...memberAttributes.map(getMemberAttributeColumn),
		// ...[
		//   {
		//     title: "メールアドレス",
		//     dataIndex: "email",
		//     align: "center",
		//     width: 200,
		//   },
		//   {
		//     title: "住所",
		//     dataIndex: "address",
		//     align: "center",
		//     width: 150,
		//   },
		// ],
		...commonEndColumns,
	].filter(Boolean)

	const handleTableChange = (
		paginationData: Pagination,
		sorter: { order: string; field: string },
	) => {
		if (paginationData.pageSize !== paginationPerPage) {
			setPaginationPerPage(paginationData.pageSize)
		}

		if (paginationData.current !== paginationPage) {
			setPaginationPage(paginationData.current)
		}

		if (sorter && sorter.order) {
			if (sorter.order === 'ascend') {
				if (sorter.order !== paginationSort) {
					setPaginationSort('asc')
				}
			} else if (sorter.order === 'descend') {
				if (sorter.order !== paginationSort) {
					setPaginationSort('desc')
				}
			}
		}

		if (sorter && sorter.field) {
			if (sorter.field !== paginationSortKey) {
				setPaginationSortKey(sorter.field)
			}
		}
	}

	return (
		<>
			<BaseAnimationComponent>
				<PageHeaderComponent
					publicSettings={publicSettings}
					title={isCampaignPage ? 'キャンペーン応募者一覧' : '顧客管理'}
					actions={<MemberVisit />}
				/>
				<Card bordered={false} className='shadow-none'>
					<Row>
						<Col xs={24}>
							<MembersFilters filters={filters} setFilters={setFilters} />
						</Col>
						<Divider />
						<MotionColComponent
							xs={24}
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
							initial='hidden'
							animate='show'
							exit='hidden'
						>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
								{/* {isCampaignPage ? (
									<div className="flex flex-wrap justify-end gap-2 mb-2">
										<Button
											danger
											size="large"
											icon={<FileSyncOutlined />}
											onClick={handleWinnersResetConfirm}
											loading={campaignWinnersResetMutation.isLoading}
										>
											抽選クリア
										</Button>
										<Button
											size="large"
											icon={<DownloadOutlined />}
											onClick={handleAllCampaignWinnersExport}
											loading={campaignWinnersExportMutation.isLoading}
										>
											当選者リストCSV
										</Button>
										<Button
											type="primary"
											size="large"
											icon={<AuditOutlined />}
											onClick={showCandidateModal}
										>
											⾃動抽選
										</Button>
									</div>
								) : (
								)} */}
								<div className='flex justify-end mb-2'>
									<Button
										size='large'
										icon={<DownloadOutlined />}
										onClick={handleMembersExport}
										loading={membersExportMutation.isLoading}
									>
										お客様リストCSV
									</Button>
								</div>
								<Table
									$publicSettings={publicSettings}
									bordered
									size='small'
									columns={memberColumns}
									// columns={isCampaignPage ? campaignMemberColumns : memberColumns}
									scroll={{
										x: 640,
										y: 720,
									}}
									locale={{ emptyText: 'お客様のデータがありません。' }}
									//@ts-ignore
									onChange={handleTableChange}
									pagination={{
										responsive: true,
										showSizeChanger: true,
										onShowSizeChange: (current, pageSize) =>
											setPaginationPerPage(pageSize),
										current: paginationPage,
										pageSize: paginationPerPage,
										total: paginationTotal,
										showTotal: (total, range) =>
											`全${total}件中${range[0]}～${range[1]}件目`,
										defaultCurrent: 1,
										defaultPageSize: 20,
										position: ['bottomCenter'],
									}}
									dataSource={
										members
											? members.map((member: memberType) => {
													return {
														key: member?.memberId,
														member: member,
														...member,
													}
											  })
											: []
									}
								/>
							</motion.div>
						</MotionColComponent>
					</Row>
				</Card>
			</BaseAnimationComponent>
			<MemberNoteModalComponent
				isMemberRemarksModalVisible={isMemberRemarksModalVisible}
				hideMemberRemarksModal={hideMemberRemarksModal}
				currentMember={currentMember}
			/>
			<MemberDetailModalComponent
				{...props}
				isMemberDetailModalVisible={isMemberDetailModalVisible}
				hideMemberDetailModal={hideMemberDetailModal}
				currentMember={currentMember}
				memberAttributes={memberAttributes}
				handleMemberDelete={handleMemberDelete}
				showMemberEditDetailModal={showMemberEditDetailModal}
			/>
			<MemberEditDetailModalComponent
				{...props}
				isMemberEditDetailModalVisible={isMemberEditDetailModalVisible}
				hideMemberEditDetailModal={hideMemberEditDetailModal}
				currentMember={currentMember}
				memberAttributes={memberAttributes}
			/>
			<ChatModalComponent
				{...props}
				isChatModalVisible={isChatModalVisible}
				hideChatModal={hideChatModal}
				currentMember={currentMember}
			/>
			<CandidateModalComponent
				{...props}
				isCandidateModalVisible={isCandidateModalVisible}
				hideCandidateModal={hideCandidateModal}
				handleCurrentCampaignWinnersExport={handleCurrentCampaignWinnersExport}
			/>
			{contextHolder}
		</>
	)
}

export default Members
