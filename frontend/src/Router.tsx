import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { COMMONS } from '@/utils'
import { AnimatePresence } from 'framer-motion'
import { ErrorBoundaryComponent, TopProgressBar } from '@/components'
import { LayoutConfigProvider } from '@/providers/layoutConfig.provider'
import { RichMenuSettingsProvider } from '@/components/admin/Settings/RichMenu/RichMenuSettingsProvider'

import MinimalLayout from './layouts/Minimal'
import AdminMainLayout from './layouts/AdminMain'
import ClientMainLayout from './layouts/ClientMain'

import AdminMembersView from './views/Admin/Members'
import AdminAudiencesView from './views/Admin/Audiences'
import AdminSettingsView from './views/Admin/Settings'
import AdminSystemSettingsView from './views/Admin/Settings/SystemSettings'
import AdminMemberSettingsView from './views/Admin/Settings/MemberSettings/MemberSettings'
import AdminNotificationSettingsView from './views/Admin/Settings/NotificationSettings'
import AdminRichMenuSettingsView from './views/Admin/Settings/RichMenuSettings'

const AdminLoginView = lazy(() => import('./views/Admin/Login'))
// const AdminHomeView = lazy(() => import("./views/Admin/Home"))
const AdminHomeV2View = lazy(() => import('./views/Admin/HomeV2'))
// const AdminCategoriesView = lazy(() => import('./views/Admin/Categories'))
// const AdminOccasionVersionOccasionsView = lazy(() =>
//   import("./views/Admin/OccasionVersion/Occasions")
// )
// const AdminOccasionVersionOccasionsDetailView = lazy(() => import('./views/Admin/OccasionVersion/OccasionsDetail'))
// const AdminCategoryVersionCategoryDetailView = lazy(() =>
//   import("./views/Admin/CategoryVersion/CategoryDetail")
// )
// const EventDetailView = lazy(() => import('./views/Admin/EventDetail'))

// const AdminCampaignsView = lazy(() => import('./views/Admin/Campaigns'))

// const AdminCampaignDetaillView = lazy(() => import('./views/Admin/CampaignDetail/CampaignDetail'))

const ClientLoginView = lazy(() => import('./views/Client/Login'))
const ClientRegisterView = lazy(() => import('./views/Client/Register'))
// const ClientCampaignView = lazy(() => import('./views/Client/Campaign'))
const ClientProfileUpdateView = lazy(() => import('./views/Client/ProfileUpdate'))
const ClientMembershipView = lazy(() => import('./views/Client/Membership'))
// const ClientCategoriesView = lazy(() => import('./views/Client/Categories'))
// const ClientCategoryDetailView = lazy(() => import('./views/Client/CategoryDetail'))

// const ClientCampaignsView = lazy(() => import('./views/Client/Campaigns'))
// const ClientCampaignRegistrationsView = lazy(() => import('./views/Client/Campaigns/CampaignRegistrations'))
// const ClientCampaignDetailView = lazy(() => import('./views/Client/Campaigns/CampaignDetail'))

// const ClientVersionOccurrencesView = lazy(() => import('./views/Client/ClientVersionOccurrencesView'))
// const ClientVersionReservationView = lazy(() => import('./views/Client/ClientVersionReservationView'))

// const ClientCategoryVersionOccurrencesView = lazy(() =>
//   import("./views/Client/CategoryVersion/Occurrences")
// )
// const ClientOccasionVersionOccasionDetailView = lazy(() =>
//   import("./views/Client/OccasionVersion/OccasionDetail")
// )
// const ClientCategoryVersionReservationView = lazy(() =>
//   import("./views/Client/CategoryVersion/Reservation")
// )
// const ClientOccasionVersionReservationView = lazy(() =>
//   import("./views/Client/OccasionVersion/Reservation")
// )
const ClientRegistrationsView = lazy(() => import('./views/Client/Registrations'))
const ClientRegistrationDetailView = lazy(() => import('./views/Client/RegistrationDetail'))

// const ClientCampaignRegistrationDetailView = lazy(() => import('./views/Client/Campaigns/RegistrationDetail'))

const LineAccessView = lazy(() => import('./views/LineAccess'))
const LineFriendView = lazy(() => import('./views/LineFriend'))
const PermissionErrorView = lazy(() => import('./views/PermissionError'))
const NotFoundView = lazy(() => import('./views/NotFound'))

const Router = () => {
	return (
		<ErrorBoundaryComponent>
			<Suspense fallback={<TopProgressBar />}>
				<AnimatePresence mode='wait'>
					<LayoutConfigProvider>
						<Routes>
							<Route
								path='/'
								element={<Navigate replace to={COMMONS.ADMIN_LOGIN_ROUTE} />}
							/>
							<Route
								path={COMMONS.ADMIN_LOGIN_ROUTE}
								element={
									<MinimalLayout>
										<AdminLoginView />
									</MinimalLayout>
								}
							/>

							<Route
								path={COMMONS.ADMIN_MEMBERS_ROUTE}
								element={
									<AdminMainLayout>
										<AdminMembersView />
									</AdminMainLayout>
								}
							/>

							<Route
								path={COMMONS.ADMIN_AUDIENCES_ROUTE}
								element={
									<AdminMainLayout>
										<AdminAudiencesView />
									</AdminMainLayout>
								}
							/>
							<Route
								path={COMMONS.ADMIN_SETTINGS_ROUTE}
								element={
									<AdminMainLayout>
										<AdminSettingsView />
									</AdminMainLayout>
								}
							/>
							<Route
								path={COMMONS.ADMIN_SETTINGS_SYS_ROUTE}
								element={
									<AdminMainLayout>
										<AdminSystemSettingsView />
									</AdminMainLayout>
								}
							/>
							<Route
								path={COMMONS.ADMIN_SETTINGS_CUSTOM_REG_ROUTE}
								element={
									<AdminMainLayout>
										<AdminMemberSettingsView />
									</AdminMainLayout>
								}
							/>
							<Route
								path={COMMONS.ADMIN_SETTINGS_NOTIFICATION_ROUTE}
								element={
									<AdminMainLayout>
										<AdminNotificationSettingsView />
									</AdminMainLayout>
								}
							/>
							<Route
								path={COMMONS.ADMIN_SETTINGS_RICHMENU_ROUTE}
								element={
									<RichMenuSettingsProvider>
										<AdminMainLayout>
											<AdminRichMenuSettingsView />
										</AdminMainLayout>
									</RichMenuSettingsProvider>
								}
							/>
							<Route
								path={`${COMMONS.CLIENT_LOGIN_ROUTE}/:liffId`}
								element={
									<MinimalLayout>
										<ClientLoginView />
									</MinimalLayout>
								}
							/>
							<Route
								path={`${COMMONS.CLIENT_REGISTER_ROUTE}/:liffId`}
								element={
									<MinimalLayout>
										<ClientRegisterView />
									</MinimalLayout>
								}
							/>

							<Route
								path={`${COMMONS.CLIENT_PROFILE_UPDATE_ROUTE}/:liffId`}
								element={
									<ClientMainLayout>
										<ClientProfileUpdateView />
									</ClientMainLayout>
								}
							/>
							<Route
								path={`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/:liffId`}
								element={
									<ClientMainLayout>
										<ClientMembershipView />
									</ClientMainLayout>
								}
							/>

							<Route
								path={`${COMMONS.CLIENT_REGISTRATIONS_ROUTE}/:liffId`}
								element={
									<ClientMainLayout>
										<ClientRegistrationsView />
									</ClientMainLayout>
								}
							/>
							<Route
								path={`${COMMONS.CLIENT_REGISTRATION_DETAIL_ROUTE}/:liffId/:registrationId`}
								element={
									<ClientMainLayout>
										<ClientRegistrationDetailView />
									</ClientMainLayout>
								}
							/>

							<Route
								path={COMMONS.LINE_ACCESS_ROUTE}
								element={
									<MinimalLayout>
										<LineAccessView />
									</MinimalLayout>
								}
							/>
							<Route
								path={COMMONS.LINE_FRIEND_ROUTE}
								element={
									<MinimalLayout>
										<LineFriendView />
									</MinimalLayout>
								}
							/>
							<Route
								path={COMMONS.PERMISSION_ERROR_ROUTE}
								element={
									<MinimalLayout>
										<PermissionErrorView />
									</MinimalLayout>
								}
							/>
							<Route
								path={COMMONS.NOT_FOUND_ROUTE}
								element={
									<MinimalLayout>
										<NotFoundView />
									</MinimalLayout>
								}
							/>
							<Route
								path='*'
								element={<Navigate replace to={COMMONS.NOT_FOUND_ROUTE} />}
							/>
						</Routes>
					</LayoutConfigProvider>
				</AnimatePresence>
			</Suspense>
		</ErrorBoundaryComponent>
	)
}

export default Router
