import { Modal, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { BarcodeScanner } from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'
import { API, COMMONS } from '@/utils'

const CameraScanModal = (props: {
	isMemberVisit?: any
	isMemberRenewCameraModalVisible?: any
	hideMemberRenewDeviceModal?: any
	hideMemberRenewCameraModal?: any
	showMemberRenewConfirmModal?: any
}) => {
	const {
		isMemberRenewCameraModalVisible,
		hideMemberRenewCameraModal,
		showMemberRenewConfirmModal,
		isMemberVisit,
	} = props

	const navigate = useNavigate()

	const memberCheckMutation = useMutation(API.ADMIN_CHECK_MEMBER, {
		onSuccess: (response) => {
			showMemberRenewConfirmModal(response?.data || {})
		},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				message.warning(COMMONS.WARN_MEMBER_CODE_NOT_EXIST_MSG)
				hideMemberRenewCameraModal()
			} else if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
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

	const handleMemberCheck = (data: any) => {
		const paramData = {
			memberCode: data.memberCode,
			isMemberVisit: isMemberVisit,
		}

		memberCheckMutation.mutate(paramData)
	}
	return (
		<>
			<Modal
				title={`${isMemberVisit ? '来店記録' : '会員更新'}・カメラ`}
				open={isMemberRenewCameraModalVisible}
				onCancel={hideMemberRenewCameraModal}
				footer={null}
				destroyOnClose
				centered
				styles={{
					body: {
					  maxHeight: '80vh',
					  overflowY: 'auto',
					  overflowX: 'hidden',
					}
				  }}
			>
				<div className='barcode-wrapper'>
					<div className='barcode-image-wrapper'>
						<BarcodeScanner
							options={{ formats: ['code_128', 'itf'], delay: 500 }}
							onCapture={(barcode) => {
								if (barcode) {
									handleMemberCheck({ memberCode: barcode?.rawValue })
									hideMemberRenewCameraModal()
								}
							}}
							trackConstraints={{
								width: { min: 640, ideal: 1280 },
								height: { min: 480, ideal: 480 },
							}}
						/>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default CameraScanModal
