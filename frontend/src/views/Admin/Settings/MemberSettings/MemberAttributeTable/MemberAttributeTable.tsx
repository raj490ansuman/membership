// TODO: Clean up component usage and parent settings layout and auth props?
import { QuestionCircleFilled } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { Table, Tooltip } from 'antd'
import { COMMONS } from '@/utils'
import { useListMemberAttributes } from '@/queries'
import { HookAPI } from 'antd/es/modal/useModal'
import MemberAttributeTableActions from './components/MemberAttributeTableActions'
import MemberAttributeDisplayToggle from './components/MemberAttributeDisplayToggle'

export const MemberAttributeTable = ({
	modalInstance,
	showMemberAttributeDetailModal,
}: {
	modalInstance: HookAPI
	showMemberAttributeDetailModal: (value: MemberAttribute | undefined) => void
}) => {
	const { data } = useListMemberAttributes()
	const memberAttributes: MemberAttribute[] = data?.body?.data || []

	const memberAttributeSettingColumns: GenericTableColumn<MemberAttribute>[] = [
		{
			title: '項目ラベル',
			dataIndex: 'label',
			key: 'label',
		},
		{
			title: '回答形式',
			dataIndex: 'type',
			key: 'memberAttributeType',
			render: (value: string) => {
				if (value.startsWith('address')) {
					return '郵便番号・住所'
				} else {
					const label = COMMONS.FLAT_MEMBER_ATTRIBUTE_LABELS[value]
					return label ? label : value
				}
			},
		},
		{
			title: '選択肢',
			dataIndex: 'attributeChoices',
			key: 'attributeChoices',
			width: 300,
			render: (value: any) => {
				return value?.length > 0 ? (
					value.map(
						(
							choice: { attributeChoiceId: number | undefined; contents: string },
							i: number,
						) => (
							<p
								key={choice?.attributeChoiceId}
								className='whitespace-pre-wrap break-all'
							>
								{`${i + 1}）${choice?.contents || ''}`}
							</p>
						),
					)
				) : (
					<p>質問の選択肢がありません。</p>
				)
			},
		},
		{
			title: '必須設定',
			align: 'left',
			dataIndex: 'required',
			key: 'required',
			render: (value: string) => <>{value ? '必須' : '任意'}</>,
		},
		{
			title: (
				<Tooltip
					color='green'
					title='お客様が会員登録をする際に入力するフォームの項目について「表示」「非表示」を設定できます。「非表示」にするとお客様には入力欄が表示されません。'
				>
					<p>
						会員証登録フォーム項目表示
						<span className='ml-1'>
							<QuestionCircleFilled />
						</span>
					</p>
				</Tooltip>
			),

			align: 'center',
			dataIndex: 'isMemberDisplayed',
			key: 'isMemberDisplayed',
			width: 150,
			render: (value: string, record: MemberAttribute) => (
				<MemberAttributeDisplayToggle memberAttribute={record} type={'member'} />
			),
		},
		{
			title: (
				<Tooltip
					color='green'
					title='管理画面に表示する項目について「表示」「非表示」を設定できます。【会員証登録フォーム項目表示】が「非表示」であっても、【管理画面項目表示】を「表示」とすると、管理画面上には該当項目が表示されます。ユーザーに入力はさせたくないが、管理者側で情報を追加したい場合などに利用します。注意：【会員証登録フォーム項目表示】を「表示」としている項目につきましては、【管理画面項目表示】も「表示」に設定してご利用ください。'
				>
					<p>
						管理画面項目表示
						<span className='ml-1'>
							<QuestionCircleFilled />
						</span>
					</p>
				</Tooltip>
			),
			align: 'center',
			dataIndex: 'isAdminDisplayed',
			key: 'isAdminDisplayed',
			width: 150,
			render: (value: string, record: MemberAttribute) => (
				<MemberAttributeDisplayToggle memberAttribute={record} type={'admin'} />
			),
		},
		{
			title: '',
			dataIndex: 'memberAttributeActions',
			key: 'memberAttributeActions',
			render: (value: string, record: MemberAttribute) => (
				<MemberAttributeTableActions
					memberAttribute={record}
					modalInstance={modalInstance}
					showMemberAttributeDetailModal={showMemberAttributeDetailModal}
				/>
			),
		},
	]

	return (
		<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
			<Table
				scroll={{ x: 'max-content' }}
				columns={memberAttributeSettingColumns}
				dataSource={
					memberAttributes
						.filter(
							(memberAttribute) =>
								!/address_prefecture|address_city|address_address|address_building/.test(
									memberAttribute.type,
								),
						)
						.map((memberAttribute) => ({
							...memberAttribute,
							key: memberAttribute.memberAttributeId,
						})) as (MemberAttribute & { key: number })[]
				}
			/>
		</motion.div>
	)
}

export default MemberAttributeTable
