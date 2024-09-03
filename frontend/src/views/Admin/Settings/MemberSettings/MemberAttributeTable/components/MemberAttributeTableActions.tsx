// TODO: Clean up component usage and parent settings layout and auth props?
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'
import { TapAnimationComponent } from '@/components'
import { useDeleteMemberAttribute } from '@/queries'
import { HookAPI } from 'antd/es/modal/useModal'

const MemberAttributeTableActions = ({
	memberAttribute,
	modalInstance,
	showMemberAttributeDetailModal,
}: {
	memberAttribute: MemberAttribute
	modalInstance: HookAPI
	showMemberAttributeDetailModal: (value: MemberAttribute | undefined) => void
}) => {
	const deleteMemberAttribute = useDeleteMemberAttribute(memberAttribute?.memberAttributeId)

	const MemberAttributeEditButton = () => (
		<Button
			icon={<EditOutlined />}
			onClick={() => {
				showMemberAttributeDetailModal(memberAttribute)
			}}
		>
			編集
		</Button>
	)
	const MemberAttributeDeleteButton = () => (
		<Button
			danger
			// disabled={!item?.isDelete}
			icon={<DeleteOutlined />}
			onClick={() => {
				modalInstance.confirm({
					title: '確認',
					icon: <ExclamationCircleOutlined className='text-red-600' />,
					content: (
						<p>
							<span className='text-red-600'>「{memberAttribute?.label || ''}」</span>
							を削除してもよろしいでしょうか？
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
						deleteMemberAttribute.mutate({
							params: {
								memberAttributeId: memberAttribute?.memberAttributeId,
							},
						})
					},
				})
			}}
		>
			削除
		</Button>
	)
	return (
		<Flex gap={10} justify='center'>
			<TapAnimationComponent>
				<MemberAttributeEditButton />
			</TapAnimationComponent>
			<TapAnimationComponent className='ml-1'>
				<MemberAttributeDeleteButton />
			</TapAnimationComponent>
		</Flex>
	)
}

export default MemberAttributeTableActions
