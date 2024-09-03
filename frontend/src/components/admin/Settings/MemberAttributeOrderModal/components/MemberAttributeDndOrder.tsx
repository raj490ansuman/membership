import { Col, Row } from 'antd'
import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const MotionRowComponent = motion(Row)
const MotionColComponent = motion(Col)

const MemberAttributeDndOrder = (props) => {
	const { publicSettings, setMemberAttributesOrder } = props
	const memberAttributesOrder: MemberAttribute[] = props.memberAttributesOrder

	const handleMemberAttributeOnDragEnd = (result) => {
		// Dropped outside the list
		if (!result.destination) {
			return
		} else {
			const newMemberAttributeOrder = COMMONS.RE_ORDER(
				memberAttributesOrder,
				result.source.index,
				result.destination.index,
			)

			setMemberAttributesOrder(newMemberAttributeOrder)
		}
	}

	const DraggableMemberAttributeItem = ({
		memberAttribute,
		index,
	}: {
		memberAttribute: MemberAttribute
		index: number
	}) => (
		<Draggable
			key={memberAttribute?.memberAttributeId}
			draggableId={String(memberAttribute?.memberAttributeId)}
			index={index}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className='mb-4 cursor-pointer'
				>
					<div
						className='flex items-center px-4 border rounded w-full'
						style={{
							borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
							backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
							color: publicSettings?.PRIMARY_COLOR?.valueString,
						}}
					>
						<p className='p-4 font-bold whitespace-pre-wrap'>
							{`${index + 1}）${memberAttribute?.label || ''}`}
						</p>
					</div>
				</div>
			)}
		</Draggable>
	)

	return (
		<MotionRowComponent
			gutter={[32, 32]}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
			initial='hidden'
			animate='show'
			exit='hidden'
		>
			<MotionColComponent xs={24} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
				{memberAttributesOrder && memberAttributesOrder?.length > 0 ? (
					<DragDropContext onDragEnd={handleMemberAttributeOnDragEnd}>
						<Droppable droppableId='droppableQuestion' direction='vertical'>
							{(provided, snapshot) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className='flex flex-col'
								>
									{memberAttributesOrder.map((memberAttribute, index) => (
										<DraggableMemberAttributeItem
											key={`draggableMemberAttributeItem-${memberAttribute?.memberAttributeId}`}
											memberAttribute={memberAttribute}
											index={index}
										/>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				) : (
					<p className='text-center'>質問がありません。</p>
				)}
			</MotionColComponent>
		</MotionRowComponent>
	)
}

export default MemberAttributeDndOrder
