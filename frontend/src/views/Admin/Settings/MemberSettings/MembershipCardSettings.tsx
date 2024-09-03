import { useQueryClient } from '@tanstack/react-query'
import { Flex, Form, Switch, message } from 'antd'
import { API, COMMONS } from '@/utils'
import { useEffect, useMemo } from 'react'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import { queries, useSetPublicSettingsMutation } from '@/queries'

const FormToggle = ({ label, name, onChange }: any) => (
	<Form.Item label={label} name={name} valuePropName='checked'>
		<Switch onChange={onChange} />
	</Form.Item>
)

export const MembershipCardSettings = () => {
	const queryClient = useQueryClient()
	const layoutContext = useLayoutConfigContext()
	const { publicSettings } = layoutContext

	const setPublicSettingsMutation = useSetPublicSettingsMutation()
	const setPublicSettings = (param: {
		key: string
		label: string
		isPublic: boolean
		valueFlag: boolean
	}) => {
		setPublicSettingsMutation.mutate(
			{ params: { key: param.key }, body: param },
			{
				onSuccess: () => {
					message.success(COMMONS.SUCCESS_UPDATE_MSG)
					// As admin, we need to invalidate system settings instead of public settings because system settings takes precendence and contains more than public settings
					queryClient.invalidateQueries({
						queryKey: queries.settings.settings.queryKey,
					})
				},
			},
		)
	}

	const [membershipCardSettingsForm] = Form.useForm()

	const formDefaultValues = useMemo(
		() => ({
			isBarcodeEnabled: publicSettings?.BARCODE_ENABLED.valueFlag || false,
			isPointEnabled: publicSettings?.POINTS_ENABLED.valueFlag || false,
			isDateOfExpiryEnabled: publicSettings?.DATE_OF_EXPIRY_ENABLED.valueFlag || false,
		}),
		[
			publicSettings?.BARCODE_ENABLED.valueFlag,
			publicSettings?.POINTS_ENABLED.valueFlag,
			publicSettings?.DATE_OF_EXPIRY_ENABLED.valueFlag,
		],
	)
	// Set form to latest defaults when they come in
	useEffect(() => {
		membershipCardSettingsForm.resetFields()
	}, [membershipCardSettingsForm, formDefaultValues])

	const handleSettingToggle = (settingKey: string, newValue: boolean) => {
		const paramData = {
			key: settingKey,
			label: settingKey,
			isPublic: true,
			valueFlag: newValue,
		}
		setPublicSettings(paramData)
	}

	const membershipCardSettings = [
		{
			label: 'バーコード',
			name: 'isBarcodeEnabled',
			onChange: (checked: boolean) =>
				handleSettingToggle(API.SETTINGS_KEY_BARCODE_ENABLED, checked),
		},
		{
			label: 'ポイント',
			name: 'isPointEnabled',
			onChange: (checked: boolean) =>
				handleSettingToggle(API.SETTINGS_KEY_POINT_ENABLED, checked),
		},
		{
			label: '有効期限',
			name: 'isDateOfExpiryEnabled',
			onChange: (checked: boolean) =>
				handleSettingToggle(API.SETTINGS_KEY_DATE_OF_EXPIRY_ENABLED, checked),
		},
	]

	return (
		<Form
			preserve={false}
			form={membershipCardSettingsForm}
			size='large'
			initialValues={formDefaultValues}
		>
			<Flex gap={20} justify='start' align='center'>
				{membershipCardSettings.map((setting) => (
					<FormToggle key={setting.name} {...setting} />
				))}
			</Flex>
		</Form>
	)
}

export default MembershipCardSettings
