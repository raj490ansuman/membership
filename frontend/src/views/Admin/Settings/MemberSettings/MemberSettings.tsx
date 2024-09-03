// TODO: Clean up component usage and parent settings layout and auth props?
import { OrderedListOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Modal, Row } from 'antd'
import { COMMONS } from '@/utils'
import {
	BaseAnimationComponent,
	MemberAttributeDetailModal,
	MemberAttributeOrderModalComponent,
	PageHeaderComponent,
	TapAnimationComponent,
} from '@/components'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import MembershipCardSettings from './MembershipCardSettings'
import MemberAttributeTable from './MemberAttributeTable/MemberAttributeTable'

export const MemberSettings = (props: Props) => {
	const { auth } = props

	const layoutContext = useLayoutConfigContext()
	const { publicSettings } = layoutContext

	const [modalInstance, contextHolder] = Modal.useModal()
	const [isMemberAttributeDetailModalVisible, setIsMemberAttributeDetailModalVisible] =
		useState(false)
	const [isMemberAttributeOrderModal, setIsMemberAttributeOrderModal] = useState(false)
	const [currentMemberAttribute, setCurrentMemberAttribute] = useState<
		MemberAttribute | undefined
	>(undefined)

	const showMemberAttributeOrderModal = () => {
		setIsMemberAttributeOrderModal(true)
	}
	const showMemberAttributeDetailModal = (item: MemberAttribute | undefined) => {
		setCurrentMemberAttribute(item)
		setIsMemberAttributeDetailModalVisible(true)
	}
	const hideMemberAttributeDetailModal = () => {
		setCurrentMemberAttribute(undefined)
		setIsMemberAttributeDetailModalVisible(false)
	}
	const hideMemberAttributeOrderModal = () => {
		setIsMemberAttributeOrderModal(false)
	}

	return (
		auth &&
		auth?.auth === COMMONS.AUTH_MASTER && (
			<>
				<BaseAnimationComponent>
					<PageHeaderComponent publicSettings={publicSettings} title='設定' />
					<Card bordered={false}>
						<Row gutter={[16, 16]}>
							<Col xs={24}>
								<Card
									title='会員証項目'
									bordered={true}
									type='inner'
									styles={{
										header: {
											color: publicSettings?.PRIMARY_COLOR?.valueString,
											backgroundColor:
												publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										},
									}}
									style={{
										borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
									}}
									extra={
										<div className='flex flex-wrap justify-end mt-1 gap-1'>
											<div>
												<TapAnimationComponent>
													<Button
														type='primary'
														size='large'
														icon={<PlusOutlined />}
														onClick={() =>
															showMemberAttributeDetailModal(
																undefined,
															)
														}
													>
														項目追加
													</Button>
												</TapAnimationComponent>
											</div>
											<div>
												<TapAnimationComponent>
													<Button
														type='primary'
														size='large'
														icon={<OrderedListOutlined />}
														onClick={showMemberAttributeOrderModal}
													>
														質問表示順
													</Button>
												</TapAnimationComponent>
											</div>
										</div>
									}
								>
									<motion.div
										variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
										initial='hidden'
										animate='show'
										exit='hidden'
									>
										<MembershipCardSettings />
										<MemberAttributeTable
											modalInstance={modalInstance}
											showMemberAttributeDetailModal={
												showMemberAttributeDetailModal
											}
										/>
									</motion.div>
								</Card>
							</Col>
						</Row>
					</Card>
				</BaseAnimationComponent>
				<MemberAttributeDetailModal
					isMemberAttributeDetailModalVisible={isMemberAttributeDetailModalVisible}
					hideMemberAttributeDetailModal={hideMemberAttributeDetailModal}
					currentMemberAttribute={currentMemberAttribute}
				/>
				<MemberAttributeOrderModalComponent
					{...props}
					isMemberAttributeOrderModal={isMemberAttributeOrderModal}
					hideMemberAttributeOrderModal={hideMemberAttributeOrderModal}
				/>
				{contextHolder}
			</>
		)
	)
}

export default MemberSettings
