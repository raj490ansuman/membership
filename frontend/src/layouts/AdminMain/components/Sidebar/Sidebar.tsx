import React from 'react'
import { Button, Divider, Menu } from 'antd'
import Icon, {
	ScheduleOutlined,
	TeamOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	IdcardOutlined,
	SettingOutlined,
	HomeOutlined,
	NotificationOutlined,
	ExportOutlined,
	LinkOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar = (props: any) => {
	const { isHamburger, isCollapsed, logo, collapseToggle } = props
	const { publicSettings } = useLayoutConfigContext()
	const location = useLocation()
	const navigate = useNavigate()

	const enabledRoutes = [
		COMMONS.ADMIN_HOME_ROUTE,
		COMMONS.ADMIN_CATEGORIES_ROUTE,
		COMMONS.ADMIN_MEMBERS_ROUTE,
		COMMONS.ADMIN_CAMPAIGN_ROUTE,
		COMMONS.ADMIN_AUDIENCES_ROUTE,
		COMMONS.ADMIN_SETTINGS_ROUTE,
		COMMONS.ADMIN_SETTINGS_SYS_ROUTE,
		COMMONS.ADMIN_SETTINGS_CUSTOM_REG_ROUTE,
		COMMONS.ADMIN_SETTINGS_NOTIFICATION_ROUTE,
		COMMONS.ADMIN_SETTINGS_RICHMENU_ROUTE
	]

	const handleClick = (event) => {
		if (event.key == 'collapse') collapseToggle()
		if (enabledRoutes.includes(event.key)) navigate(event.key)
		if (isHamburger) collapseToggle()
	}
	const getMenuItem = (
		label: React.ReactNode,
		key: React.Key,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group'
	): MenuItem => ({
		label: <span className="text-base">{label}</span>,
		key,
		icon,
		children,
		type
	})

	const menuItems: MenuProps['items'] = [
		// {
		// 	key: COMMONS.ADMIN_HOME_ROUTE,
		// 	icon: <HomeOutlined className="text-base" />,
		// 	label: <span className="text-base">{COMMONS.PAGE_ADMIN_HOME}</span>
		// },
		// {
		// 	key: COMMONS.ADMIN_CATEGORIES_ROUTE,
		// 	icon: <ScheduleOutlined className="text-base" />,
		// 	label: <span className="text-base">{COMMONS.PAGE_ADMIN_OCCASIONS}</span>,
		// 	hidden: true
		// },
		getMenuItem(COMMONS.PAGE_ADMIN_CUSTOMERS, COMMONS.ADMIN_MEMBERS_ROUTE, <TeamOutlined className="text-base" />),
		// getMenuItem(
		// 	COMMONS.PAGE_ADMIN_CAMPAIGN_CUSTOMERS,
		// 	COMMONS.ADMIN_CAMPAIGN_ROUTE,
		// 	<NotificationOutlined className="text-base" />,
		// ),
		getMenuItem(
			COMMONS.PAGE_ADMIN_AUDIENCES,
			COMMONS.ADMIN_AUDIENCES_ROUTE,
			<IdcardOutlined className="text-base" />
		),
		getMenuItem(
			COMMONS.PAGE_ADMIN_SETTINGS,
			COMMONS.ADMIN_SETTINGS_ROUTE,
			<SettingOutlined className="text-base" />,
			[
				getMenuItem(COMMONS.PAGE_ADMIN_SETTINGS_SYS, COMMONS.ADMIN_SETTINGS_SYS_ROUTE),
				getMenuItem(COMMONS.PAGE_ADMIN_SETTINGS_CUSTOM_REG, COMMONS.ADMIN_SETTINGS_CUSTOM_REG_ROUTE),
				getMenuItem(COMMONS.PAGE_ADMIN_SETTINGS_NOTIFICATION, COMMONS.ADMIN_SETTINGS_NOTIFICATION_ROUTE),
				getMenuItem(COMMONS.PAGE_ADMIN_SETTINGS_RICHMENU, COMMONS.ADMIN_SETTINGS_RICHMENU_ROUTE)
			]
		),
		getMenuItem(
			<a
				href={import.meta.env.VITE_APP_LINE_MANAGER_URL}
				target="_blank"
				rel="noreferrer noopener"
				className={`${isCollapsed ? 'text-xs' : 'text-base'}`}
			>
				{`${isCollapsed ? COMMONS.LABEL_ADMIN_LINE_LINK : COMMONS.LABEL_ADMIN_LINE_LINK}`}
			</a>,
			'linePublicAccountLink',
			<ExportOutlined className="text-base" />
		)
	]

	return (
		<div className="flex flex-col h-full" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
			<div className="flex m-4">
				<img
					src={logo ? API.SETTINGS_UPLOADS_URL + logo : '/logo.svg'}
					alt="ロゴ"
					className="mx-auto rounded max-w-full object-contain"
					style={{ maxHeight: '150px' }}
				/>
			</div>
			<Divider className="mt-0" />
			<div className="text-center mx-4">
				<p className={`${isCollapsed ? 'text-xs' : 'text-base'}`}>
					{publicSettings?.TITLE?.valueString || import.meta.env.VITE_APP_SYSTEM_NAME}
				</p>
			</div>
			<Divider />
			<div className="flex-grow flex-shrink">
				<Menu
					// $publicSettings={publicSettings}
					onClick={handleClick}
					defaultSelectedKeys={[COMMONS.ADMIN_MEMBERS_ROUTE]}
					defaultOpenKeys={[COMMONS.ADMIN_SETTINGS_ROUTE]}
					selectedKeys={[location.pathname]}
					forceSubMenuRender={true}
					items={menuItems}
					mode="inline"
				/>
			</div>
			<Divider />
			<div className="flex justify-center mb-4 mx-4">
				<img src={import.meta.env.VITE_APP_LINE_QR_URL} alt="LINE" className="max-w-full" />
			</div>
			<Button
				block
				className="p-0 rounded-b-none"
				onClick={collapseToggle}
				icon={
					isCollapsed ? (
						<MenuUnfoldOutlined className="text-base" />
					) : (
						<MenuFoldOutlined className="text-base" />
					)
				}
			/>
		</div>
	)
}

export default Sidebar
