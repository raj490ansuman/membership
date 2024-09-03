// TODO: Clean up component usage and parent settings layout and auth props?
import { Switch, message } from 'antd'
import { COMMONS } from '@/utils'
import { useUpdateMemberAttributes } from '@/queries'

const MemberAttributeDisplayToggle = ({
	memberAttribute,
	type,
}: {
	memberAttribute: MemberAttribute
	type: 'admin' | 'member'
}) => {
	const { memberAttributeId, isAdminDisplayed, isMemberDisplayed, label, required } =
		memberAttribute
	const updateMemberAttribute = useUpdateMemberAttributes(memberAttributeId)

	const toggleIsAdminDisplayed = (checked: boolean) => {
		if (!checked && isMemberDisplayed) {
			return message.error(COMMONS.WARN_MEMBER_ATTR_SET_ADMIN_DISPLAY)
		}
		updateMemberAttribute.mutate({
			params: {
				memberAttributeId,
			},
			body: {
				isAdminDisplayed: checked,
				isMemberDisplayed,
				label,
				required,
			},
		})
	}
	const toggleIsMemberDisplayed = (checked: boolean) => {
		if (checked && !isAdminDisplayed) {
			return message.error(COMMONS.WARN_MEMBER_ATTR_SET_ADMIN_DISPLAY)
		}
		updateMemberAttribute.mutate({
			params: {
				memberAttributeId,
			},
			body: {
				isAdminDisplayed,
				isMemberDisplayed: checked,
				label,
				required,
			},
		})
	}

	// TODO: Debounce functions
	const handleMemberAttributeDisplayToggle = (checked: boolean) =>
		type === 'admin' ? toggleIsAdminDisplayed(checked) : toggleIsMemberDisplayed(checked)

	return (
		<Switch
			checkedChildren='表示'
			unCheckedChildren='非表示'
			checked={type === 'admin' ? isAdminDisplayed : isMemberDisplayed}
			onChange={handleMemberAttributeDisplayToggle}
		/>
	)
}

export default MemberAttributeDisplayToggle
