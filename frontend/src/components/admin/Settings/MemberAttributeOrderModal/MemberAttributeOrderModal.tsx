import { Button, Col, message, Modal, Row } from 'antd'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useListMemberAttributes, useUpdateMemberAttributesOrder } from '@/queries'
import MemberAttributeDndOrder from './components/MemberAttributeDndOrder'

const MemberAttributeOrderModal = (props) => {
	const { publicSettings, isMemberAttributeOrderModal, hideMemberAttributeOrderModal } = props

	const [memberAttributesOrder, setMemberAttributesOrder] = useState<MemberAttribute[]>([])

	const { data } = useListMemberAttributes({ enabled: isMemberAttributeOrderModal })
	const memberAttributes: MemberAttribute[] = data?.body?.data || []

	const updateMemberAttributeOrder = useUpdateMemberAttributesOrder()

	useEffect(() => {
		const memberAttributeNewOrder = COMMONS.groupMemberAttributeAddress(memberAttributes)
		setMemberAttributesOrder(memberAttributeNewOrder)
	}, [memberAttributes])

	const handleMemberAttributeOrderUpdate = () => {
		// Check if the member attribute order is changed
		if (JSON.stringify(memberAttributesOrder) === JSON.stringify(memberAttributes)) {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
		} else {
			updateMemberAttributeOrder.mutate({
				body: {
					memberAttributes: memberAttributesOrder.map((q, i) => ({
						memberAttributeId: q?.memberAttributeId,
						showOrder: i,
					})),
				},
			})
		}
		hideMemberAttributeOrderModal()
	}

	const undoMemberAttributeOrderChanges = () => {
		const memberAttributeNewOrder = COMMONS.groupMemberAttributeAddress(memberAttributes)
		setMemberAttributesOrder(memberAttributeNewOrder)
	}

	return (
		<Modal
			open={isMemberAttributeOrderModal}
			onCancel={hideMemberAttributeOrderModal}
			title='質問表示順'
			footer={null}
			destroyOnClose
			maskClosable={false}
			centered
			width={720}
			styles={{
				body: {
					maxHeight: '90vh',
					overflowY: 'auto',
					overflowX: 'hidden',
				},
			}}
		>
			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial='hidden'
				animate='show'
				exit='hidden'
			>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					className='flex justify-end mb-4'
				>
					<TapAnimationComponent>
						<Button
							className='m-1'
							size='large'
							danger
							onClick={undoMemberAttributeOrderChanges}
						>
							元に戻す
						</Button>
					</TapAnimationComponent>
					<TapAnimationComponent>
						<Button
							type='primary'
							className='m-1 w-32'
							size='large'
							onClick={handleMemberAttributeOrderUpdate}
						>
							保存
						</Button>
					</TapAnimationComponent>
				</motion.div>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
					className='flex justify-center rounded mb-8 p-4'
					style={{
						color: publicSettings?.PRIMARY_COLOR?.valueString,
						backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
					}}
				>
					<p>質問を上下にドラッグして並べ替えます</p>
				</motion.div>
			</motion.div>
			<MemberAttributeDndOrder
				memberAttributesOrder={memberAttributesOrder}
				setMemberAttributesOrder={setMemberAttributesOrder}
			/>
		</Modal>
	)
}

export default MemberAttributeOrderModal
