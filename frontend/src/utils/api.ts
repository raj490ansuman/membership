import axios from 'axios'
import moment from 'moment'
import { ContractAPI } from '@contracts'
import { initQueryClient } from '@ts-rest/react-query'
import { redirect } from 'react-router-dom'
import { COMMONS } from '.'
import { message } from 'antd'
import type { Query, QueryKey } from '@tanstack/react-query'

const viteAppCategoryVersion: string = import.meta.env.VITE_APP_CATEGORY_VERSION
const viteAppApiUrl: string = import.meta.env.VITE_APP_API_URL

export const IS_CATEGORY_VERSION = viteAppCategoryVersion === 'true'

export const SITE_URL = viteAppApiUrl

export const BASE_URL = SITE_URL + '/api'
export const UPLOADS_URL = SITE_URL + '/uploads'
export const CATEGORIES_UPLOADS_URL = UPLOADS_URL + '/categories/'
export const OCCASIONS_UPLOADS_URL = UPLOADS_URL + '/occasions/'
export const MEMBERS_UPLOADS_URL = UPLOADS_URL + '/members/'
export const MEMBERS_CUSTOM_REGISTRATIONS_UPLOADS_URL = MEMBERS_UPLOADS_URL + 'memberAttribute'
export const SETTINGS_UPLOADS_URL = UPLOADS_URL + '/settings/'
export const MESSAGE_STORAGE_URL = `${SITE_URL}/storage/line`
export const POSTAL_CODE_URL = 'https://yubinbango.github.io/yubinbango-data/data'
export const PUBLIC_HOLIDAY_URL = 'https://holidays-jp.github.io/api/v1/date.json'

/* BACKEND API URLS */
export const API_ADMIN_CHECK_SESSION = BASE_URL + '/sess'
export const API_ADMIN_LOGIN = BASE_URL + '/login'
export const API_ADMIN_LOGOUT = BASE_URL + '/logout'
export const API_ADMIN_AUTH = BASE_URL + '/auth'
export const API_ADMIN_DAILY_STATS = BASE_URL + '/m/dailyStats'
export const API_ADMIN_OCCASIONS = BASE_URL + '/m/occasions'
export const API_ADMIN_GIFTS = BASE_URL + '/m/gifts'
export const API_ADMIN_CAMPAIGN_GIFTS = BASE_URL + '/m/campaign-gifts'
export const API_ADMIN_OCCURRENCES = BASE_URL + '/m/occurrences'
export const API_ADMIN_CATEGORIES = BASE_URL + '/m/categories'
export const API_ADMIN_REGISTRATIONS = BASE_URL + '/m/registrations'
export const API_ADMIN_CAMPAIGN_REGISTRATIONS = BASE_URL + '/m/campaign-registrations'
export const API_ADMIN_HISTORY_REGISTRATIONS = BASE_URL + '/m/attended'
export const API_ADMIN_MEMBERS = BASE_URL + '/m/members'
export const API_ADMIN_CHATS = BASE_URL + '/m/members/chats'
export const API_ADMIN_SETTINGS = BASE_URL + '/settings'
export const API_ADMIN_RICHMENUS = BASE_URL + '/m/richmenus'
export const API_ADMIN_CAMPAIGNS = BASE_URL + '/m/campaigns'
export const API_ADMIN_AUDIENCES = BASE_URL + '/m/audiences'
export const API_ADMIN_SPECTATORS = BASE_URL + '/m/spectators'
export const API_ADMIN_MEMBER_ATTRIBUTES = BASE_URL + '/m/member-attributes'
export const API_CLIENT = BASE_URL + '/liff'

export const API_ADMIN_RICHMENU_TABGROUPS = BASE_URL + '/richmenutabgroups'

/* SOCKET PATH */
export const SOCKET_PATH = '/socket.io'

/* QUERY KEY */
export const QUERY_KEY_ADMIN_PUBLIC_SETTINGS = 'ADMIN_PUBLIC_SETTINGS'
export const QUERY_KEY_ADMIN_CHECK_SESSION = 'ADMIN_CHECK_SESSION'
export const QUERY_KEY_ADMIN_AUTH = 'ADMIN_AUTH'
export const QUERY_KEY_ADMIN_DAILY_STATS = 'ADMIN_DAILY_STATS'
export const QUERY_KEY_ADMIN_CATEGORY_TEMPLATES = 'ADMIN_CATEGORY_TEMPLATES'
export const QUERY_KEY_ADMIN_CAMPAIGN_TEMPLATES = 'ADMIN_CAMPAIGN_TEMPLATES'
export const QUERY_KEY_ADMIN_CAMPAIGN_TEMPLATE_DETAIL = 'ADMIN_CAMPAIGN_TEMPLATE_DETAIL'
export const QUERY_KEY_ADMIN_CATEGORY_TEMPLATE_DETAIL = 'ADMIN_CATEGORY_TEMPLATE_DETAIL'
export const QUERY_KEY_ADMIN_CATEGORY_TAGS = 'ADMIN_CATEGORY_TAGS'
export const QUERY_KEY_ADMIN_CATEGORY_AREAS = 'ADMIN_CATEGORY_AREAS'
export const QUERY_KEY_ADMIN_CATEGORIES = 'ADMIN_CATEGORIES'
export const QUERY_KEY_ADMIN_CAMPAIGNS = 'ADMIN_CAMPAIGNS'
export const QUERY_KEY_ADMIN_CATEGORY_LIST = 'ADMIN_CATEGORY_LIST'
export const QUERY_KEY_ADMIN_CATEGORY_DETAIL = 'ADMIN_CATEGORY_DETAIL'
export const QUERY_KEY_ADMIN_CAMPAIGN_DETAIL = 'ADMIN_CAMPAIGN_DETAIL'
export const QUERY_KEY_ADMIN_OCCASIONS = 'ADMIN_OCCASIONS'
export const QUERY_KEY_ADMIN_OCCASION_LIST = 'ADMIN_OCCASION_LIST'
export const QUERY_KEY_ADMIN_OCCASION_DETAIL = 'ADMIN_OCCASION_DETAIL'
export const QUERY_KEY_ADMIN_OCCASION_TAGS = 'ADMIN_OCCASION_TAGS'
export const QUERY_KEY_ADMIN_OCCASION_TEMPLATES = 'ADMIN_OCCASION_TEMPLATES'
export const QUERY_KEY_ADMIN_OCCASION_TEMPLATE_DETAIL = 'OCCASION_TEMPLATE_DETAIL'
export const QUERY_KEY_ADMIN_GIFT_TEMPLATE_DETAIL = 'GIFT_TEMPLATE_DETAIL'
export const QUERY_KEY_ADMIN_OCCURRENCE_DETAIL = 'ADMIN_OCCURRENCE_DETAIL'
export const QUERY_KEY_ADMIN_CAMPAIGN_REGISTRATIONS = 'ADMIN_CAMPAIGN_REGISTRATIONS'
export const QUERY_KEY_ADMIN_HISTORY_REGISTRATIONS = 'ADMIN_GET_HISTORY_ATTENDED'
export const QUERY_KEY_ADMIN_REGISTRATION_DETAIL = 'ADMIN_REGISTRATION_DETAIL'
export const QUERY_KEY_ADMIN_MEMBERS = 'ADMIN_MEMBERS'
export const QUERY_KEY_ADMIN_MEMBERS_LIST = 'ADMIN_MEMBERS_LIST'
export const QUERY_KEY_ADMIN_MEMBER_DETAIL = 'ADMIN_MEMBER_DETAIL'
export const QUERY_KEY_ADMIN_CHATS = 'ADMIN_CHATS'
export const QUERY_KEY_ADMIN_RICHMENUS = 'ADMIN_RICHMENUS'
export const QUERY_KEY_ADMIN_RICHMENU_TEMPLATES = 'ADMIN_RICHMENU_TEMPLATES'
export const QUERY_KEY_ADMIN_RICHMENU_TABGROUPS = 'ADMIN_RICHMENU_TABGROUPS'
export const QUERY_KEY_ADMIN_CAMPAIGN_QUESTIONS = 'ADMIN_CAMPAIGN_QUESTIONS'
export const QUERY_KEY_ADMIN_MEMBER_ATTRIBUTES = 'ADMIN_MEMBER_ATTRIBUTES'
export const QUERY_KEY_ADMIN_AUDIENCES = 'ADMIN_AUDIENCES'
export const QUERY_KEY_ADMIN_SPECTATORS = 'ADMIN_SPECTATORS'
export const QUERY_KEY_ADMIN_SPECTATOR_CANDIDATES = 'ADMIN_SPECTATOR_CANDIDATES'
export const QUERY_KEY_CLIENT_PERSONAL_INFO = 'CLIENT_PERSONAL_INFO'
export const QUERY_KEY_CLIENT_CAMPAIGN_QUESTIONS = 'CLIENT_CAMPAIGN_QUESTIONS'
export const QUERY_KEY_CLIENT_CATEGORIES = 'CLIENT_CATEGORIES'
export const QUERY_KEY_CLIENT_CAMPAIGNS = 'CLIENT_CAMPAIGNS'
export const QUERY_KEY_CLIENT_CATEGORY_DETAIL = 'CLIENT_CATEGORY_DETAIL'
export const QUERY_KEY_CLIENT_CAMPAIGN_DETAIL = 'CLIENT_CAMPAIGN_DETAIL'
export const QUERY_KEY_CLIENT_OCCASIONS = 'CLIENT_OCCASIONS'
export const QUERY_KEY_CLIENT_GIFTS = 'CLIENT_GIFTS'
export const QUERY_KEY_CLIENT_OCCASION_DETAIL = 'CLIENT_OCCASION_DETAIL'
export const QUERY_KEY_CLIENT_MY_REGISTRATIONS = 'CLIENT_MY_REGISTRATIONS'
export const QUERY_KEY_CLIENT_MY_REGISTRATION_DETAIL = 'CLIENT_MY_REGISTRATION_DETAIL'
export const QUERY_KEY_CLIENT_MY_CAMPAIGN_REGISTRATION_DETAIL =
	'CLIENT_MY_CAMPAIGN_REGISTRATION_DETAIL'
export const QUERY_KEY_CLIENT_MEMBER_ATTRIBUTES = 'CLIENT_MEMBER_ATTRIBUTES'
export const QUERY_KEY_LOGO = 'LOGO'
export const QUERY_KEY_FAVICON = 'FAVICON'
export const QUERY_KEY_STORE_PIC = 'STORE_PIC'
export const QUERY_KEY_PUBLIC_SETTINGS = 'PUBLIC_SETTINGS'
export const QUERY_KEY_PUBLIC_HOLIDAYS = 'PUBLIC_HOLIDAYS'

/* SETTINGS KEY */
export const SETTINGS_KEY_SYSTEM_COLOR = 'systemColor'
export const SETTINGS_KEY_SYSTEM_TITLE = 'systemTitle'
export const SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_TITLE = 'clientCategoriesScreenTitle'
export const SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_SUBTITLE = 'clientCategoriesScreenSubtitle'
export const SETTINGS_KEY_ADMIN_INITIAL_RESERVABLE_COUNT = 'adminInitialReservableCount'
export const SETTINGS_KEY_RESERVATION_CONFIRM_URL = 'bookConfirmUrl'
export const SETTINGS_KEY_COMPANY_TELEPHONE = 'companyTelephone'
export const SETTINGS_KEY_BOOK_LIMIT_ENABLED = 'bookLimitEnabled'
export const SETTINGS_KEY_BOOK_LIMIT_DAY = 'bookLimitDay'
export const SETTINGS_KEY_BOOK_LIMIT_HOUR = 'bookLimitHour'
export const SETTINGS_KEY_BOOK_LIMIT_MINUTE = 'bookLimitMinute'
export const SETTINGS_KEY_BOOK_CANCEL_ALLOWED = 'bookCancelAllowed'
export const SETTINGS_KEY_BOOK_CANCEL_LIMIT_DAY = 'bookCancelLimitDay'
export const SETTINGS_KEY_BOOK_CANCEL_LIMIT_HOUR = 'bookCancelLimitHour'
export const SETTINGS_KEY_BOOK_CANCEL_LIMIT_MINUTE = 'bookCancelLimitMinute'
export const SETTINGS_KEY_BOOK_CANCEL_TEXT = 'bookCancelText'
export const SETTINGS_KEY_MEMBER_MESSAGE_POST_MEMBER_REGISTER = 'postMemberRegistrationMessage'
export const SETTINGS_KEY_MEMBER_MESSAGE_RESERVATION = 'bookRegistrationMessage'
export const SETTINGS_KEY_MEMBER_MESSAGE_CAMPAIGN = 'campaignApplyMessage'
export const SETTINGS_KEY_MEMBER_MESSAGE_REMIND1 = 'bookRemind1Message'
export const SETTINGS_KEY_MEMBER_MESSAGE_REMIND2 = 'bookRemind2Message'
export const SETTINGS_KEY_ADMIN_MESSAGE_MEMBER = 'watchMemberTemplate'
export const SETTINGS_KEY_ADMIN_MESSAGE_CAMPAIGN = 'watchCampaignApplyTemplate'
export const SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION = 'watchRegistrationTemplate'
export const SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION_CANCEL = 'watchRegistrationCancelTemplate'
export const SETTINGS_KEY_BARCODE_ENABLED = 'isBarcodeEnabled'
export const SETTINGS_KEY_POINT_ENABLED = 'isPointEnabled'
export const SETTINGS_KEY_DATE_OF_EXPIRY_ENABLED = 'isDateOfExpiryEnabled'

/* SETTINGS LABEL */
export const SETTINGS_LABEL_SYSTEM_COLOR = 'システム色'
export const SETTINGS_LABEL_SYSTEM_TITLE = 'システムタイトル'
export const SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_TITLE = '予約画面タイトル'
export const SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_SUBTITLE = '予約画面サブタイトル'
export const SETTINGS_LABEL_ADMIN_INITIAL_RESERVABLE_COUNT = '予約可能人数の初期値'
export const SETTINGS_LABEL_RESERVATION_CONFIRM_URL = '予約確認URL'
export const SETTINGS_LABEL_COMPANY_TELEPHONE = '問い合わせ電話番号'
export const SETTINGS_LABEL_BOOK_LIMIT_ENABLED = '予約限定'
export const SETTINGS_LABEL_BOOK_LIMIT_DAY = '予約限定日数'
export const SETTINGS_LABEL_BOOK_LIMIT_HOUR = '予約限定時'
export const SETTINGS_LABEL_BOOK_LIMIT_MINUTE = '予約限定分'
export const SETTINGS_LABEL_BOOK_CANCEL_ALLOWED = '予約キャンセル可能'
export const SETTINGS_LABEL_BOOK_CANCEL_LIMIT_DAY = '予約キャンセル限定日'
export const SETTINGS_LABEL_BOOK_CANCEL_LIMIT_HOUR = '予約キャンセル限定時'
export const SETTINGS_LABEL_BOOK_CANCEL_LIMIT_MINUTE = '予約キャンセル限定分'
export const SETTINGS_LABEL_BOOK_CANCEL_TEXT = '予約キャンセル説明文'
export const SETTINGS_LABEL_MEMBER_MESSAGE_POST_MEMBER_REGISTER = '会員証登録後メッセージ'
export const SETTINGS_LABEL_MEMBER_MESSAGE_RESERVATION = '予約メッセージ'
export const SETTINGS_LABEL_MEMBER_MESSAGE_CAMPAIGN = 'キャンペーン応募メッセージ'
export const SETTINGS_LABEL_MEMBER_MESSAGE_REMIND1 = '予約リマインドメッセージ1'
export const SETTINGS_LABEL_MEMBER_MESSAGE_REMIND2 = '予約リマインドメッセージ2'
export const SETTINGS_LABEL_ADMIN_MESSAGE_MEMBER = '新規メンバーメッセージ'
export const SETTINGS_LABEL_ADMIN_MESSAGE_CAMPAIGN = '新規キャンペーン応募メッセージ'
export const SETTINGS_LABEL_ADMIN_MESSAGE_RESERVATION = '新規予約メッセージ'
export const SETTINGS_LABEL_ADMIN_MESSAGE_RESERVATION_CANCEL = '予約キャンセルメッセージ'

/* SOCKET LABEL */
export const SOCKET_SYSTEM_SETTING = 'systemSetting'
export const SOCKET_FAVICON = 'favicon'
export const SOCKET_LOGO = 'logo'
export const SOCKET_STORE_PIC = 'storePic'
export const SOCKET_CATEGORY = 'category'
export const SOCKET_CAMPAIGN = 'campaign'
export const SOCKET_TEMPLATE = 'template'
export const SOCKET_OCCASION = 'occasion'
export const SOCKET_GIFT = 'gift'
export const SOCKET_OCCURRENCE = 'occurrence'
export const SOCKET_REGISTRATION = 'registration'
export const SOCKET_MEMBER = 'member'
export const SOCKET_CHAT = 'chat'
export const SOCKET_AUDIENCE = 'audience'

export const tsRestClient = initQueryClient(ContractAPI, {
	baseUrl: SITE_URL,
	baseHeaders: {},
	credentials: 'include',
})

// TODO: Standardize server responses to correlate with frontend responses
// e.g. richmenu image upload to already published richmenu tab group should return something more descriptive than 500 status
// Server: RICHMENU_ALREADY_PUBLISHED_IMAGE_UPLOAD_ERROR_MSG => Frontend: Japanese error message
export const clientOnError = (
	error: unknown,
	query: Query<unknown, unknown, unknown, QueryKey>,
) => {
	if (!query.meta?.shouldBeHandledByGlobalErrorHandler) {
		return
	}
	if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
		redirect(COMMONS.PERMISSION_ERROR_ROUTE)
	} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
		message.warning({
			content: COMMONS.ERROR_SESSION_MSG,
			key: COMMONS.MESSAGE_SESSION_ERROR_KEY,
		})
		redirect(COMMONS.ADMIN_LOGIN_ROUTE)
	} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
		message.error({
			content: COMMONS.ERROR_SYSTEM_MSG,
			key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
		})
	} else {
		message.error({
			content: COMMONS.ERROR_SYSTEM_MSG,
			key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
		})
	}
}

/* AXIOS CONFIG */
const axiosInstance = axios.create({
	withCredentials: true,
	baseURL: BASE_URL,
	timeout: 10000,
})

/* BACKEND API REQUESTS */
export async function ADMIN_LOGIN(data) {
	return await axiosInstance.post(API_ADMIN_LOGIN, data)
}

export async function ADMIN_LOGOUT() {
	return await axiosInstance.get(API_ADMIN_LOGOUT)
}

export async function ADMIN_CHECK_SESSION() {
	return await axiosInstance.get(API_ADMIN_CHECK_SESSION)
}

export async function ADMIN_GET_AUTH() {
	return await axiosInstance.get(API_ADMIN_AUTH)
}

export async function ADMIN_GET_DAILY_STATS(filterStatsFrom, filterStatsTo) {
	const paramData = {
		params: {
			from: filterStatsFrom,
			to: filterStatsTo,
		},
	}

	return await axiosInstance.get(API_ADMIN_DAILY_STATS, paramData)
}

export async function ADMIN_GET_CATEGORY_TEMPLATES() {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_CATEGORIES + '/basic', paramData)
}

export async function ADMIN_GET_CATEGORY_TEMPLATE_DETAIL(categoryId) {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_CATEGORIES + '/' + categoryId, paramData)
}

export async function ADMIN_GET_CATEGORY_TAGS() {
	return await axiosInstance.get(API_ADMIN_CATEGORIES + '/tags')
}

export async function ADMIN_GET_CATEGORY_AREAS() {
	return await axiosInstance.get(API_ADMIN_CATEGORIES + '/areas')
}

export async function ADMIN_GET_CATEGORIES({ pageParam = 1 }) {
	const paramData = {
		params: {
			pp: 20,
			p: pageParam,
		},
	}

	return await axiosInstance.get(API_ADMIN_CATEGORIES, paramData)
}
export async function ADMIN_GET_Campaign_CATEGORIES({ pageParam = 1 }) {
	const paramData = {
		params: {
			pp: 20,
			p: pageParam,
			isCampaign: true,
		},
	}

	return await axiosInstance.get(API_ADMIN_CATEGORIES, paramData)
}

export async function ADMIN_GET_CATEGORY_LIST(includePic, includeDestroyed) {
	const paramData = {
		params: {
			includePic: includePic,
			includeDestroyed: includeDestroyed,
		},
	}

	return await axiosInstance.get(API_ADMIN_CATEGORIES + '/basic', paramData)
}

export async function ADMIN_GET_CATEGORY_DETAIL(
	categoryId,
	filterOccurrencesFrom,
	filterOccurrencesTo,
	search,
) {
	const dataSearch = search?.map((item) => item?.toISOString())
	const paramData = {
		params: {
			from: filterOccurrencesFrom,
			to: filterOccurrencesTo,
			search: dataSearch,
		},
	}

	return await axiosInstance.get(API_ADMIN_CATEGORIES + '/' + categoryId, paramData)
}

export async function ADMIN_GET_CAMPAIGN_DETAIL(
	campaignId,
	filterOccurrencesFrom,
	filterOccurrencesTo,
	search,
) {
	const dataSearch = search?.map((item) => item?.toISOString())
	const paramData = {
		params: {
			from: filterOccurrencesFrom,
			to: filterOccurrencesTo,
			search: dataSearch,
		},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGNS + '/' + campaignId, paramData)
}

export async function ADMIN_CREATE_CATEGORY(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.post(API_ADMIN_CATEGORIES, data?.formData, headerData)
}

export async function ADMIN_GET_CAMPAIGN_TEMPLATES() {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGNS + '/basic', paramData)
}

export async function ADMIN_GET_CAMPAIGN_TEMPLATE_DETAIL(campaignId) {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGNS + '/' + campaignId, paramData)
}

export async function ADMIN_GET_CAMPAIGNS({ pageParam = 1 }) {
	const paramData = {
		params: {
			pp: 20,
			p: pageParam,
		},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGNS, paramData)
}
export async function ADMIN_CREATE_CAMPAIGN(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.post(API_ADMIN_CAMPAIGNS, data?.formData, headerData)
}
export async function ADMIN_UPDATE_CAMPAIGN(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.put(
		API_ADMIN_CAMPAIGNS + '/' + data?.campaignId,
		data?.formData,
		headerData,
	)
}

export async function ADMIN_UPDATE_CATEGORY(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.put(
		API_ADMIN_CATEGORIES + '/' + data?.categoryId,
		data?.formData,
		headerData,
	)
}

export async function ADMIN_UPDATE_CATEGORY_ORDER(data) {
	return await axiosInstance.put(API_ADMIN_CATEGORIES, data)
}

export async function ADMIN_DELETE_CATEGORY(data) {
	return await axiosInstance.delete(API_ADMIN_CATEGORIES + '/' + data?.categoryId)
}
export async function ADMIN_DELETE_CAMPAIGN(data) {
	return await axiosInstance.delete(API_ADMIN_CAMPAIGNS + '/' + data?.campaignId)
}

export async function ADMIN_GET_OCCASION_TEMPLATES(isCampaign = false) {
	const paramData = {
		params: {
			includeDestroyed: false,
			isCampaign: isCampaign,
		},
	}

	return await axiosInstance.get(API_ADMIN_OCCASIONS + '/basic', paramData)
}

export async function ADMIN_GET_Gift_TEMPLATES() {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_GIFTS + '/basic', paramData)
}
export async function ADMIN_GET_GIFT_TEMPLATE_DETAIL(giftId) {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_GIFTS + '/' + giftId, paramData)
}

export async function ADMIN_GET_OCCASION_TEMPLATE_DETAIL(occasionId) {
	const paramData = {
		params: {
			includeDestroyed: false,
		},
	}

	return await axiosInstance.get(API_ADMIN_OCCASIONS + '/' + occasionId, paramData)
}

export async function ADMIN_GET_OCCASIONS({ pageParam = 1, queryKey }) {
	const paramData = {
		params: {
			categoryId: queryKey[1],
			pp: 20,
			p: pageParam,
		},
	}

	return await axiosInstance.get(API_ADMIN_OCCASIONS, paramData)
}
export async function ADMIN_GET_CAMPAIGN_GIFTS({ pageParam = 1, queryKey }) {
	const paramData = {
		params: {
			campaignId: queryKey[1],
			pp: 20,
			p: pageParam,
		},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGN_GIFTS, paramData)
}

export async function ADMIN_GET_OCCASION_LIST(includePic, includeDestroyed) {
	const paramData = {
		params: {
			includePic: includePic,
			includeDestroyed: includeDestroyed,
		},
	}

	return await axiosInstance.get(API_ADMIN_OCCASIONS + '/basic', paramData)
}

export async function ADMIN_GET_OCCASION_DETAIL(
	occasionId,
	filterOccurrencesFrom,
	filterOccurrencesTo,
	searchOccasions,
) {
	const dataSearch = searchOccasions?.map((item) => item?.toISOString())
	const paramData = {
		params: {
			from: filterOccurrencesFrom,
			to: filterOccurrencesTo,
			search: dataSearch,
		},
	}

	return await axiosInstance.get(API_ADMIN_OCCASIONS + '/' + occasionId, paramData)
}

export async function ADMIN_CREATE_OCCASION(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.post(API_ADMIN_OCCASIONS, data?.formData, headerData)
}

export async function ADMIN_UPDATE_OCCASION(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.put(
		API_ADMIN_OCCASIONS + '/' + data?.occasionId,
		data?.formData,
		headerData,
	)
}

export async function ADMIN_CREATE_CAMPAIGN_GIFTS(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.post(API_ADMIN_CAMPAIGN_GIFTS, data?.formData, headerData)
}

export async function ADMIN_UPDATE_CAMPAIGN_GIFTS(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.put(
		API_ADMIN_CAMPAIGN_GIFTS + '/' + data?.giftId,
		data?.formData,
		headerData,
	)
}

export async function ADMIN_UPDATE_OCCASION_ORDER(data) {
	return await axiosInstance.put(API_ADMIN_OCCASIONS, data)
}

export async function ADMIN_UPDATE_GIFT_ORDER(data) {
	return await axiosInstance.put(API_ADMIN_GIFTS, data)
}
export async function ADMIN_UPDATE_GIFT(data) {
	return await axiosInstance.put(API_ADMIN_GIFTS + '/update', { gifts: data })
}
export async function ADMIN_POST_REGISTER_WINNERS(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/register-winners', data)
}
export async function ADMIN_POST_AUTOMATIC_REGISTER_WINNERS(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/automatic-register-winners', data)
}
export async function ADMIN_DELETE_GIFT(data) {
	return await axiosInstance.delete(API_ADMIN_GIFTS + '/' + data?.giftId)
}
export async function ADMIN_DELETE_OCCASION(data) {
	return await axiosInstance.delete(API_ADMIN_OCCASIONS + '/' + data?.occasionId)
}

export async function ADMIN_GET_OCCASION_TAGS() {
	return await axiosInstance.get(API_ADMIN_OCCASIONS + '/tags')
}

export async function ADMIN_CREATE_OCCURRENCE(data) {
	return await axiosInstance.post(API_ADMIN_OCCURRENCES, data)
}

export async function ADMIN_GET_OCCURRENCE_DETAIL(occurrenceId) {
	return await axiosInstance.get(API_ADMIN_OCCURRENCES + '/' + occurrenceId)
}

export async function ADMIN_GET_CAMPAIGN_REGISTRATIONS(campaignId) {
	return await axiosInstance.get(API_ADMIN_CAMPAIGN_REGISTRATIONS + '/' + campaignId)
}

export async function ADMIN_UPDATE_OCCURRENCE(data) {
	return await axiosInstance.put(API_ADMIN_OCCURRENCES + '/' + data?.occurrenceId, data)
}

export async function ADMIN_DELETE_OCCURRENCE(data) {
	return await axiosInstance.delete(API_ADMIN_OCCURRENCES + '/' + data?.occurrenceId)
}

export async function ADMIN_DELETE_BATCH_OCCURRENCES(data) {
	return await axiosInstance.delete(API_ADMIN_OCCURRENCES, { data: data })
}

export async function ADMIN_CREATE_REGISTRATION_MANUAL(data) {
	return await axiosInstance.post(API_ADMIN_REGISTRATIONS, data)
}
export async function ADMIN_CREATE_REGISTRATION_CAMPAIGN_MANUAL(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGN_REGISTRATIONS, data)
}

export async function ADMIN_UPDATE_REGISTRATION(data) {
	return await axiosInstance.put(API_ADMIN_REGISTRATIONS + '/edit', data)
}
export async function ADMIN_UPDATE_ATTENDED_REGISTRATION(data) {
	return await axiosInstance.put(API_ADMIN_REGISTRATIONS + '/update-attended', data)
}

export async function ADMIN_GET_HISTORY_ATTENDED(numberId) {
	return await axiosInstance.get(API_ADMIN_HISTORY_REGISTRATIONS + '/' + numberId)
}

export async function ADMIN_CANCEL_REGISTRATION(data) {
	const param = {
		data: {},
	}

	return await axiosInstance.delete(
		API_ADMIN_REGISTRATIONS + '/' + data.registrationId + '/cancel',
		param,
	)
}

export async function ADMIN_CONFIRM_REGISTRATION(data) {
	return await axiosInstance.post(API_ADMIN_REGISTRATIONS + '/qr', data)
}

export async function ADMIN_RECONFIRM_REGISTRATION(data) {
	return await axiosInstance.put(API_ADMIN_REGISTRATIONS + '/confirm', data)
}

export async function ADMIN_EXPORT_REGISTRATIONS(data) {
	return await axiosInstance.post(API_ADMIN_REGISTRATIONS + '/csv', data)
}

export async function ADMIN_GET_MEMBERS(
	paginationPerPage,
	paginationPage,
	paginationSort,
	paginationSortKey,
	filterIsCampaignPage,
	filters,
) {
	// Clean up keys with 'Filter' in the name
	const cleanFilterParams: { [key: string]: any } = {}
	for (const [key, value] of Object.entries(filters)) {
		const cleanKeyName = key.replace('Filter', '')
		cleanFilterParams[cleanKeyName as string] = value
	}
	const paramData = {
		params: {
			pp: paginationPerPage,
			p: paginationPage,
			sort: paginationSort,
			sortKey: paginationSortKey,
			...(filterIsCampaignPage
				? {
						isCampaign: true,
				  }
				: {}),
			...cleanFilterParams,
		},
	}

	return await axiosInstance.get(API_ADMIN_MEMBERS, paramData)
}

export async function ADMIN_GET_MEMBER(data) {
	return await axiosInstance.get(API_ADMIN_MEMBERS + '/' + data.memberId)
}

export async function ADMIN_DELETE_MEMBER(data) {
	return await axiosInstance.delete(API_ADMIN_MEMBERS + '/' + data.memberId)
}

export async function ADMIN_RENEW_MEMBER(data) {
	if (data instanceof FormData) {
		return await axiosInstance.put(API_ADMIN_MEMBERS + '/' + data.get('memberId'), data, {
			headers: {
				'content-type': 'multipart/form-data',
			},
		})
	} else {
		return await axiosInstance.put(API_ADMIN_MEMBERS + '/' + data.memberId, data)
	}
}

export async function ADMIN_CHECK_MEMBER(data) {
	return await axiosInstance.post(API_ADMIN_MEMBERS + '/barcode', data)
}

export async function ADMIN_EXPORT_MEMBERS(data) {
	const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	return await axiosInstance.post(API_ADMIN_MEMBERS + '/csv', {
		...data,
		timeZone: clientTimezone,
	})
}

export async function ADMIN_GET_CHATS(member) {
	return await axiosInstance.get(API_ADMIN_CHATS + '/' + member?.memberId)
}

export async function ADMIN_SEND_CHAT(data) {
	return await axiosInstance.post(API_ADMIN_CHATS + '/' + data.memberId, data)
}

export async function ADMIN_GET_CAMPAIGN_QUESTIONS() {
	const paramData = {
		params: {},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGNS + '/questions', paramData)
}

export async function ADMIN_GET_CAMPAIGN_QUESTIONS_NEW({ campaignId }) {
	const paramData = {
		params: {},
	}

	return await axiosInstance.get(API_ADMIN_CAMPAIGNS + `/list-questions/${campaignId}`, paramData)
}

export async function ADMIN_CREATE_CAMPAIGN_QUESTION(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/questions', data)
}

export async function ADMIN_CREATE_CAMPAIGN_QUESTION_NEW(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/create-questions', data)
}

export async function ADMIN_UPDATE_CAMPAIGN_QUESTION(data) {
	return await axiosInstance.put(API_ADMIN_CAMPAIGNS + '/questions/' + data?.questionId, data)
}

export async function ADMIN_UPDATE_CAMPAIGN_QUESTION_ORDER(data) {
	return await axiosInstance.put(API_ADMIN_CAMPAIGNS + '/questions', data)
}

export async function ADMIN_DELETE_CAMPAIGN_QUESTION(data) {
	return await axiosInstance.delete(API_ADMIN_CAMPAIGNS + '/questions/' + data?.questionId)
}

export async function ADMIN_GET_CAMPAIGN_CANDIDATES(data) {
	return await axiosInstance.get(API_ADMIN_CAMPAIGNS + '/candidates', data)
}

export async function ADMIN_UPDATE_CAMPAIGN_CANDIDATE(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/winners', data)
}

export async function ADMIN_EXPORT_CAMPAIGN_WINNERS(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/winners/csv', data)
}

export async function ADMIN_RESET_CAMPAIGN_WINNERS(data) {
	return await axiosInstance.post(API_ADMIN_CAMPAIGNS + '/winners/reset', data)
}

export async function ADMIN_GET_AUDIENCES() {
	return await axiosInstance.get(API_ADMIN_AUDIENCES)
}

export async function ADMIN_CREATE_AUDIENCE(data) {
	return await axiosInstance.post(API_ADMIN_AUDIENCES, data)
}

export async function ADMIN_DELETE_AUDIENCE(data) {
	return await axiosInstance.delete(API_ADMIN_AUDIENCES + '/' + data.audienceGroupId)
}

export async function ADMIN_SEARCH_AUDIENCE_MEMBERS(data) {
	return await axiosInstance.post(API_ADMIN_AUDIENCES + '/find', data)
}

export async function ADMIN_GET_SPECTATORS() {
	const paramData = {
		params: {},
	}

	return await axiosInstance.get(API_ADMIN_SPECTATORS, paramData)
}

export async function ADMIN_GET_SPECTATOR_CANDIDATES() {
	const paramData = {
		params: {},
	}

	return await axiosInstance.get(API_ADMIN_SPECTATORS + '/candidates', paramData)
}

export async function ADMIN_REMOVE_SPECTATOR(data) {
	return await axiosInstance.delete(API_ADMIN_SPECTATORS + '/' + data.spectatorId)
}

export async function ADMIN_ADD_SPECTATOR(data) {
	return await axiosInstance.post(API_ADMIN_SPECTATORS, data)
}

export async function GET_LOGO() {
	return await axiosInstance.get(BASE_URL + '/logo')
}

export async function ADMIN_UPLOAD_LOGO(logo) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	const formData = new FormData()
	formData.append('picUrl', logo)

	return await axiosInstance.put(BASE_URL + '/logo', formData, headerData)
}

export async function GET_FAVICON() {
	return await axiosInstance.get(BASE_URL + '/favicon')
}

export async function ADMIN_UPLOAD_FAVICON(favicon) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	const formData = new FormData()
	formData.append('picUrl', favicon)

	return await axiosInstance.put(BASE_URL + '/favicon', formData, headerData)
}

export async function GET_STORE_PIC() {
	return await axiosInstance.get(BASE_URL + '/store/pic')
}

export async function ADMIN_UPLOAD_STORE_PIC(logo) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	const formData = new FormData()
	formData.append('picUrl', logo)

	return await axiosInstance.put(BASE_URL + '/store/pic', formData, headerData)
}

export async function GET_ADMIN_PUBLIC_SETTINGS() {
	return await axiosInstance.get(BASE_URL + '/publicSettings')
}

export async function GET_PUBLIC_SETTINGS() {
	return await axiosInstance.get(BASE_URL + '/settings')
}

export async function ADMIN_UPDATE_SETTINGS_BATCH(data) {
	return await axiosInstance.put(API_ADMIN_SETTINGS, data)
}

export async function ADMIN_UPDATE_PUBLIC_SETTINGS(data) {
	return await axiosInstance.put(API_ADMIN_SETTINGS + '/' + data.key, data)
}

export async function ADMIN_GET_RICHMENUS() {
	return await axiosInstance.get(API_ADMIN_RICHMENUS)
}

export async function ADMIN_UPDATE_RICHMENU(data) {
	const headerData = {
		headers: {
			'content-type': 'multipart/form-data',
		},
	}

	const formData = new FormData()
	Object.keys(data).forEach((key) => {
		if (typeof data[key] === 'object') {
			// If the value is an object, convert it to a JSON string.
			formData.append(key, JSON.stringify(data[key]))
		} else {
			// For non-object types, append directly.
			formData.append(key, data[key])
		}
	})
	return await axiosInstance.put(API_ADMIN_RICHMENUS, formData, headerData)
}

export async function ADMIN_UPDATE_RICHMENU_VISIBILITY(data) {
	return await axiosInstance.put(API_ADMIN_RICHMENUS + '/props', data)
}

export async function ADMIN_DELETE_RICHMENU(data) {
	const param = {
		data: {
			type: data.type,
		},
	}

	return await axiosInstance.delete(API_ADMIN_RICHMENUS, param)
}

export async function CLIENT_GET_PERSONAL_INFO(accessToken) {
	const headerData = { headers: { 'access-token': accessToken } }

	return await axiosInstance.get(API_CLIENT + '/personal', headerData)
}

export async function CLIENT_GET_MEMBER_ATTRIBUTES(accessToken) {
	const headerData = { headers: { 'access-token': accessToken } }

	return await axiosInstance.get(API_CLIENT + '/member-attributes', headerData)
}

export async function CLIENT_REGISTER_PROFILE(data) {
	const headerData = {
		headers: { 'access-token': data.accessToken },
	}

	return await axiosInstance.post(API_CLIENT + '/personal', data, headerData)
}

export async function CLIENT_REGISTER_PROFILE_NEW(data) {
	const headerData = {
		headers: {
			'access-token': data?.accessToken,
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.post(API_CLIENT + '/personal', data?.formData, headerData)
}

export async function CLIENT_UPDATE_PROFILE(data) {
	const headerData = {
		headers: {
			'access-token': data.accessToken,
		},
	}

	return await axiosInstance.post(API_CLIENT + '/personal', data, headerData)
}

export async function CLIENT_GET_CAMPAIGN_QUESTIONS(accessToken) {
	const headerData = {
		headers: { 'access-token': accessToken },
	}

	return await axiosInstance.get(API_CLIENT + '/campaigns/questions', headerData)
}

export async function CLIENT_GET_CAMPAIGN_QUESTIONS_NEW({ accessToken, campaignId }) {
	const headerData = {
		headers: { 'access-token': accessToken },
	}

	return await axiosInstance.get(API_CLIENT + `/campaigns/questions/${campaignId}`, headerData)
}

export async function CLIENT_APPLY_CAMPAIGN(data) {
	const headerData = {
		headers: {
			'access-token': data.accessToken,
		},
	}

	return await axiosInstance.post(API_CLIENT + '/campaigns/answers', data, headerData)
}

export async function CLIENT_GET_CATEGORIES({ pageParam = 1, queryKey }) {
	const headerData = {
		headers: { 'access-token': queryKey[1] },
		params: {
			pp: 20,
			p: pageParam,
		},
	}

	return await axiosInstance.get(API_CLIENT + '/categories', headerData)
}

export async function CLIENT_GET_CAMPAIGNS({ pageParam = 1, queryKey }) {
	const headerData = {
		headers: { 'access-token': queryKey[1] },
		params: {
			pp: 20,
			p: pageParam,
		},
	}

	return await axiosInstance.get(API_CLIENT + '/campaigns', headerData)
}

export async function CLIENT_GET_CATEGORY_DETAIL(accessToken, categoryId) {
	const paramData = {
		headers: { 'access-token': accessToken },
		params: {
			from: moment().format('YYYY-MM-DD HH:mm'),
			to: moment()
				.add(1, 'month')
				.endOf('month')
				.hours(23)
				.minutes(59)
				.format('YYYY-MM-DD HH:mm'),
		},
	}

	return await axiosInstance.get(API_CLIENT + '/categories/' + categoryId, paramData)
}

export async function CLIENT_GET_CAMPAIGN_DETAIL(accessToken, campaignId) {
	const paramData = {
		headers: { 'access-token': accessToken },
		params: {
			from: moment().format('YYYY-MM-DD HH:mm'),
			to: moment()
				.add(1, 'month')
				.endOf('month')
				.hours(23)
				.minutes(59)
				.format('YYYY-MM-DD HH:mm'),
		},
	}

	return await axiosInstance.get(API_CLIENT + '/campaigns/' + campaignId, paramData)
}

export async function CLIENT_GET_OCCASIONS({ pageParam = 1, queryKey }) {
	const headerData = {
		headers: { 'access-token': queryKey[1] },
		params: {
			pp: 20,
			p: pageParam,
			categoryId: queryKey[2],
		},
	}

	return await axiosInstance.get(API_CLIENT + '/occasions', headerData)
}

export async function CLIENT_GET_GIFTS({ pageParam = 1, queryKey }) {
	const headerData = {
		headers: { 'access-token': queryKey[1] },
		params: {
			pp: 20,
			p: pageParam,
			campaignId: queryKey[2],
		},
	}

	return await axiosInstance.get(API_CLIENT + '/campaigns-gifts', headerData)
}

export async function CLIENT_GET_OCCASION_DETAIL(accessToken, occasionId) {
	const paramData = {
		headers: { 'access-token': accessToken },
		params: {
			from: moment().format('YYYY-MM-DD HH:mm'),
			to: moment()
				.add(1, 'month')
				.endOf('month')
				.hours(23)
				.minutes(59)
				.format('YYYY-MM-DD HH:mm'),
		},
	}

	return await axiosInstance.get(API_CLIENT + '/occasions/' + occasionId, paramData)
}

export async function CLIENT_RESERVE_OCCASION(data) {
	const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const headerData = {
		headers: {
			'access-token': data.accessToken,
		},
	}

	return await axiosInstance.post(
		API_CLIENT + '/registerForEvent',
		{ ...data, timeZone: clientTimezone },
		headerData,
	)
}

export async function CLIENT_RESERVE_CAMPAIGN_OCCASION(data) {
	const headerData = {
		headers: {
			'access-token': data?.accessToken,
			'content-type': 'multipart/form-data',
		},
	}

	return await axiosInstance.post(
		API_CLIENT + '/campaign-registerForEvent',
		data?.formData,
		headerData,
	)
}

export async function CLIENT_GET_MY_REGISTRATIONS(accessToken) {
	const headerData = {
		headers: { 'access-token': accessToken },
	}

	return await axiosInstance.get(API_CLIENT + '/registrations', headerData)
}
export async function CLIENT_GET_MY_CAMPAIGN_REGISTRATIONS(accessToken) {
	const headerData = {
		headers: { 'access-token': accessToken },
	}

	return await axiosInstance.get(API_CLIENT + '/campaigns-registrations', headerData)
}

export async function CLIENT_GET_MY_REGISTRATION_DETAIL(accessToken, registrationId) {
	const headerData = {
		headers: { 'access-token': accessToken },
	}

	return await axiosInstance.get(API_CLIENT + '/registrations/' + registrationId, headerData)
}

export async function CLIENT_GET_MY_CAMPAIGN_REGISTRATION_DETAIL(accessToken, registrationId) {
	const headerData = {
		headers: { 'access-token': accessToken },
	}

	return await axiosInstance.get(
		API_CLIENT + '/campaign-registrations/' + registrationId,
		headerData,
	)
}

export async function CLIENT_CANCEL_REGISTRATION(data) {
	const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const param = {
		headers: { 'access-token': data.accessToken },
		data: { timeZone: clientTimezone },
	}

	return await axiosInstance.delete(API_CLIENT + '/registrations/' + data.registrationId, param)
}

export const GET_PUBLIC_HOLIDAYS = async () => {
	return await axios.get(PUBLIC_HOLIDAY_URL)
}

export const GET_ADDRESS_BY_POSTAL_CODE = (postalCode) => {
	const p3 = postalCode.substr(0, 3)

	return fetch(`${POSTAL_CODE_URL}/${p3}.js`)
		.then((response) => response.text())
		.then((text) => text)
		.catch((error) => {})
}

export const GET_CUSTOM_REGISTRATION_UPLOAD_PATH = (memberAttributeId: number) => {
	return MEMBERS_CUSTOM_REGISTRATIONS_UPLOADS_URL + memberAttributeId
}
