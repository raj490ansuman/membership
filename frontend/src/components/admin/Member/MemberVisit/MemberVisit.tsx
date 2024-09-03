import { AppstoreAddOutlined, BarcodeOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import moment from 'moment'
import 'moment/locale/ja'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import TapAnimation from '@/components/common/TapAnimation'
import MemberRenewModalComponent from '@/components/admin/Member/MemberRenewModal'
import MemberDeviceScanModalComponent from '@/components/admin/Member/DeviceScanModal'
import MemberDeviceSelectModalComponent from '@/components/admin/Member/DeviceSelectModal'
import MemberPointUpdateModal from '@/components/admin/Member/MemberPointUpdateModal'
import MemberCameraScanModalComponent from '@/components/admin/Member/CameraScanModal'

dayjs.extend(relativeTime)
moment.locale('ja')

const MemberVisit = (props: Props) => {
	const { publicSettings } = props

	const queryClient = useQueryClient()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()

	const memberId = searchParams.get('memberId')

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const membersRef = useRef<any>()

	const [currentMember, setCurrentMember] = useState<any>({})
	const [confirmMember, setConfirmMember] = useState<any>({})
	const [renewPickerValue, setRenewPickerValue] = useState(dayjs().toDate())
	const [renewConfirmPickerValue, setRenewConfirmPickerValue] = useState(dayjs().toDate())

	const [isMemberVisit, setIsMemberVisit] = useState(false)

	const [isMemberRenewModalVisible, setIsMemberRenewModalVisible] = useState(false)
	const [isMemberDetailModalVisible, setIsMemberDetailModalVisible] = useState(false)
	const [isMemberRenewSelectModalVisible, setIsMemberRenewSelectModalVisible] = useState(false)
	const [isMemberRenewDeviceModalVisible, setIsMemberRenewDeviceModalVisible] =
		useState<any>(false)
	const [isMemberRenewCameraModalVisible, setIsMemberRenewCameraModalVisible] = useState(false)
	const [isMemberRenewConfirmModalVisible, setIsMemberRenewConfirmModalVisible] = useState(false)
	const [isMemberEditModalVisible, setIsMemberEditModalVisible] = useState(false)

	const [modal, contextHolder] = Modal.useModal()

	const memberGetMutation = useMutation(API.ADMIN_GET_MEMBER, {
		onSuccess: (response: any) => {
			setCurrentMember(response?.data || {})
		},
	})
	const memberEditMutation = useMutation(API.ADMIN_RENEW_MEMBER, {
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			hideMemberEditModal()
			hideMemberRenewConfirmModal()
			queryClient.invalidateQueries([API.QUERY_KEY_ADMIN_MEMBERS])
		},
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

	const handleMemberDetail = (memberId: number) => {
		const paramData: any = {
			memberId: memberId,
		}

		memberGetMutation.mutate(paramData)
	}

	const showMemberDetailModal = (memberId: number) => {
		handleMemberDetail(memberId)
		setIsMemberDetailModalVisible(true)
	}

	const hideMemberDetailModal = () => {
		setCurrentMember({})
		setIsMemberDetailModalVisible(false)
	}

	const showMemberRenewSelectModal = (isVisit = false) => {
		setIsMemberVisit(isVisit)
		setIsMemberRenewSelectModalVisible(true)
	}
	const hideMemberRenewSelectModal = () => {
		setIsMemberRenewSelectModalVisible(false)
	}
	const hideMemberRenewModal = () => {
		setCurrentMember({})
		setIsMemberRenewModalVisible(false)
	}

	const showMemberRenewModal = (member: any) => {
		handleMemberDetail(member.memberId)
		if (!isMemberVisit) {
			setRenewPickerValue(
				member?.activeUntil
					? dayjs(member?.activeUntil).add(1, 'year').subtract(1, 'day').toDate()
					: dayjs(member?.memberSince).add(1, 'year').subtract(1, 'day').toDate(),
			)
		}

		setIsMemberRenewModalVisible(true)
	}
	const showMemberRenewDeviceModal = () => {
		hideMemberRenewSelectModal()
		setIsMemberRenewDeviceModalVisible(true)
	}
	const hideMemberRenewDeviceModal = () => {
		setIsMemberRenewDeviceModalVisible(false)
	}

	const showMemberEditModal = (memberId: any) => {
		handleMemberDetail(memberId)
		setIsMemberEditModalVisible(true)
	}
	const hideMemberEditModal = () => {
		setCurrentMember({})
		setIsMemberEditModalVisible(false)
	}

	const showMemberRenewCameraModal = () => {
		hideMemberRenewSelectModal()
		setIsMemberRenewCameraModalVisible(true)
	}

	const hideMemberRenewCameraModal = () => {
		setIsMemberRenewCameraModalVisible(false)
	}

	const showMemberRenewConfirmModal = (member: any = {}) => {
		setConfirmMember(member)
		hideMemberRenewDeviceModal()
		hideMemberRenewCameraModal()

		if (!isMemberVisit) {
			setRenewConfirmPickerValue(
				member?.activeUntil
					? dayjs(member?.activeUntil).add(1, 'year').subtract(1, 'day').toDate()
					: dayjs(member?.memberSince).add(1, 'year').subtract(1, 'day').toDate(),
			)
		}
		if (!isMemberVisit) {
			setRenewPickerValue(
				member?.activeUntil
					? dayjs(member?.activeUntil).add(1, 'year').subtract(1, 'day').toDate()
					: dayjs(member?.memberSince).add(1, 'year').subtract(1, 'day').toDate(),
			)
		}

		setIsMemberRenewConfirmModalVisible(true)
	}

	const hideMemberRenewConfirmModal = () => {
		setConfirmMember({})
		setIsMemberVisit(false)
		setIsMemberRenewConfirmModalVisible(false)
	}

	return (
		<>
			<div className='inline-flex'>
				<TapAnimation>
					<Button
						type='primary'
						size='large'
						icon={<BarcodeOutlined rev={undefined} />}
						onClick={() => {
							showMemberRenewSelectModal(true)
						}}
						className='w-32 mx-4'
					>
						来店記録
					</Button>
				</TapAnimation>

				<TapAnimation>
					<Button
						type='primary'
						size='large'
						icon={<AppstoreAddOutlined rev={undefined} />}
						onClick={() => {
							showMemberRenewSelectModal()
						}}
						className='w-32'
					>
						会員更新
					</Button>
				</TapAnimation>
			</div>

			<MemberDeviceSelectModalComponent
				{...props}
				isMemberVisit={isMemberVisit}
				showMemberRenewDeviceModal={showMemberRenewDeviceModal}
				isMemberRenewSelectModalVisible={isMemberRenewSelectModalVisible}
				hideMemberRenewSelectModal={hideMemberRenewSelectModal}
				showMemberRenewCameraModal={showMemberRenewCameraModal}
			/>
			<MemberDeviceScanModalComponent
				{...props}
				isMemberVisit={isMemberVisit}
				isMemberRenewDeviceModalVisible={isMemberRenewDeviceModalVisible}
				hideMemberRenewDeviceModal={hideMemberRenewDeviceModal}
				showMemberRenewConfirmModal={showMemberRenewConfirmModal}
			/>
			<MemberCameraScanModalComponent
				{...props}
				isMemberRenewCameraModalVisible={isMemberRenewCameraModalVisible}
				hideMemberRenewCameraModal={hideMemberRenewCameraModal}
				showMemberRenewConfirmModal={showMemberRenewConfirmModal}
				isMemberVisit={isMemberVisit}
			/>
			<MemberRenewModalComponent
				{...props}
				currentMember={currentMember}
				isMemberRenewModalVisible={isMemberRenewModalVisible}
				hideMemberRenewModal={hideMemberRenewModal}
				setRenewPickerValue={setRenewPickerValue}
				renewPickerValue={renewPickerValue}
			/>
			<MemberPointUpdateModal
				{...props}
				confirmMember={confirmMember}
				isMemberVisit={isMemberVisit}
				hideMemberRenewConfirmModal={hideMemberRenewConfirmModal}
				memberEditMutation={memberEditMutation}
				renewConfirmPickerValue={renewConfirmPickerValue}
				setRenewConfirmPickerValue={setRenewConfirmPickerValue}
				isMemberRenewConfirmModalVisible={isMemberRenewConfirmModalVisible}
			/>
			{contextHolder}
		</>
	)
}

export default MemberVisit
