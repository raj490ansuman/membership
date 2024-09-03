import { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import moment from 'moment'
import { generate } from '@ant-design/colors'
import { Tag } from 'antd'
import type { RichMenu, RichMenuArea, RichMenuTemplate } from '@schemas'
import { API } from '@/utils'

/* ROUTES */
export const ADMIN_LOGIN_ROUTE = '/login'
export const ADMIN_HOME_ROUTE = '/home'
export const ADMIN_CATEGORIES_ROUTE = '/categories'
export const ADMIN_OCCASIONS_ROUTE = '/occasions'
export const ADMIN_MEMBERS_ROUTE = '/members'
export const ADMIN_CAMPAIGN_MEMBERS_ROUTE = '/campaign-members'
export const ADMIN_CAMPAIGN_ROUTE = '/campaign'
export const ADMIN_AUDIENCES_ROUTE = '/audiences'
export const ADMIN_SETTINGS_ROUTE = '/settings'
export const ADMIN_SETTINGS_SYS_ROUTE = ADMIN_SETTINGS_ROUTE + '/system'
export const ADMIN_SETTINGS_CUSTOM_REG_ROUTE = ADMIN_SETTINGS_ROUTE + '/custom-registration'
export const ADMIN_SETTINGS_NOTIFICATION_ROUTE = ADMIN_SETTINGS_ROUTE + '/notification'
export const ADMIN_SETTINGS_RICHMENU_ROUTE = ADMIN_SETTINGS_ROUTE + '/richmenu'

export const CLIENT_LOGIN_ROUTE = '/liff/login'
export const CLIENT_REGISTER_ROUTE = '/liff/register'
export const CLIENT_CAMPAIGN_ROUTE = '/liff/campaign'
export const CLIENT_CAMPAIGNS_ROUTE = '/liff/campaigns'
export const CLIENT_MEMBERSHIP_ROUTE = '/liff/membership'
export const CLIENT_CATEGORIES_ROUTE = '/liff/categories'
export const CLIENT_OCCASIONS_ROUTE = '/liff/occasions'
export const CLIENT_OCCURRENCES_ROUTE = '/liff/occurrences'
export const CLIENT_RESERVATION_ROUTE = '/liff/reservation'
export const CLIENT_REGISTRATIONS_ROUTE = '/liff/registrations'
export const CLIENT_REGISTRATION_DETAIL_ROUTE = '/liff/registration/detail'
export const CLIENT_CAMPAIGN_REGISTRATION_DETAIL_ROUTE = '/liff/campaign-registration/detail'
export const CLIENT_PROFILE_UPDATE_ROUTE = '/liff/update'

export const LINE_ACCESS_ROUTE = '/line-access'
export const LINE_FRIEND_ROUTE = '/line-friend'
export const NOT_FOUND_ROUTE = '/404'
export const PERMISSION_ERROR_ROUTE = '/401'

/* ALERT MESSAGES */
export const ERROR_SYSTEM_MSG = 'システムエラー'
export const ERROR_SESSION_MSG = 'もう一度ログインしてください'
export const ERROR_401_MSG = '許可が足りないです。'
export const ERROR_404_MSG = 'アクセスしたページは存在しません'
export const ERROR_LINE_403_MSG = 'LINEアプリからアクセスしてください'
export const ERROR_LINE_FRIEND_MSG = 'LINEで友だち追加してアクセスしてください'
export const ERROR_ADMIN_LOGIN_MISMATCH_MSG = 'ユーザー名またはパスワードが間違っています'
export const ERROR_TELEPHONE_UNIQUE_MSG = 'この電話番号はすでに登録されています'
export const ERROR_EMAIL_UNIQUE_MSG = 'このメールアドレスはすでに登録されています'
export const ERROR_TELEPHONE_EMAIL_UNIQUE_MSG =
	'電話番号またはメールアドレスがすでに登録されています'
export const WARN_POSTAL_CODE_WRONG_MSG = '郵便番号を確認してください'
export const WARN_AUDIENCE_NAME_EXIST_MSG = 'このオーディエンス名はすでに存在しています'
export const WARN_AUDIENCE_COUNT_ZERO_MSG = '該当者0人でオーディエンスを作成することはできません'
export const WARN_AUDIENCE_NOT_MATCH_MSG =
	'検索条件が変更されています。一度検索ボタンクリックしてその後作成してください。'
export const WARN_IMAGE_TOO_BIG = '画像サイズが大きすぎます'
export const WARN_INVALID_RICHMENU_IMG_FORMAT = (
	<>
		<p className='my-2 pr-4	'>リッチメニューの画像は以下の要件を満たす必要があります</p>
		<ul className='text-left'>
			<li>画像形式: JPEGまたはPNG</li>
			<li>画像の幅: 800〜2500ピクセル</li>
			<li>画像の高さ: 250ピクセル以上</li>
			<li>画像のアスペクト比 (幅 / 高さ): 1.45以上</li>
			<li>最大ファイルサイズ: 1MB</li>
		</ul>
	</>
)

export const WARN_IMAGE_REQUIRED = '画像アップロードしてください'
export const WARN_INVALID_RICHMENU = 'リッチメニューの作成に失敗しました'
export const WARN_RICHMENU_ALREADY_PUBLISHED = 'このリッチメニューはもう公開しました。'
export const WARN_RICHMENU_CANNOT_PUBLISH = 'このリッチメニューは公開できませんでした。'
export const WARN_CUSTOMER_CODE_NOT_EXIST_MSG = 'このコードを持つユーザーはありません'
export const WARN_RESERVATION_FULL_MSG =
	'選択した時間帯が満員になったので別の時間帯を選択してください'
export const WARN_RESERVATION_PAST_MSG = '過去に予約を登録することはできません'
export const WARN_CANDIDATES_COUNT_ZERO_MSG = '0人から当選者を抽出ことはできません'
export const WARN_PASSWORD_NOT_MATCH_MSG = 'パスワードが間違っています'
export const WARN_MEMBER_CODE_NOT_EXIST_MSG = 'この会員コードを持つユーザーはありません'
export const WARN_MEMBER_ATTR_SET_ADMIN_DISPLAY =
	'会員証登録フォーム項目表示が「表示」の場合、管理画面項目表示も「表示」に設定してください。'
export const INFO_CAMERA_PERMISSION_MSG = 'カメラの許可をお願いします'
export const SUCCESS_LOGIN_MSG = 'ログインしました。'
export const SUCCESS_LOGOUT_MSG = 'ログアウトしました。'
export const SUCCESS_CREATE_MSG = '作成しました。'
export const SUCCESS_REGISTER_MSG = '登録しました。'
export const SUCCESS_ADD_MSG = '追加しました。'
export const SUCCESS_UPDATE_MSG = '保存しました。'
export const SUCCESS_DELETE_MSG = '削除しました。'
export const SUCCESS_CANCEL_MSG = 'キャンセルしました。'
export const SUCCESS_UPLOAD_MSG = 'アップロードしました。'
export const SUCCESS_AUDIENCE_SYNC_MSG = 'オーディエンス同期しました。'
export const SUCCESS_APPROVED_MSG = 'リクエストを受け取りました。'
export const SUCCESS_REJECTED_MSG = 'リクエストを断りました。'
export const SUCCESS_MESSAGE_SENT_MSG = 'メッセージを送信しました。'
export const SUCCESS_CANDIDATES_SELECT_MSG = '当選者を抽出しました。'
export const SUCCESS_CANDIDATES_RESET_MSG = '当選リストをリセットしました。'
export const SUCCESS_SEARCH_MSG = '検索完了しました。'
export const SUCCESS_PUBLISH_MSG = '公開しました。'
export const ERROR_QR_WRONG_MSG = 'QRコードが違います、再度ご確認ください'
/* RESPONSE TYPE */
export const RESPONSE_BAD_REQUEST_ERROR = 400
export const RESPONSE_PERMISSION_ERROR = 401
export const RESPONSE_SESSION_ERROR = 403
export const RESPONSE_NOT_ACCEPTABLE_ERROR = 406
export const RESPONSE_CONFLICT_ERROR = 409
export const RESPONSE_SYSTEM_ERROR = 500

/* MESSAGE KEY */
export const MESSAGE_SESSION_ERROR_KEY = 'SESSION_ERROR'
export const MESSAGE_SYSTEM_ERROR_KEY = 'SYSTEM_ERROR'
export const MESSAGE_CAMERA_PERMISSION_KEY = 'CAMERA_PERMISSION'

/* AUTH TYPE */
export const AUTH_MASTER = 'master'

export enum ChatMessageContentType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	FILE = 'file',
}

/* SYSTEM TYPE */
export const DEFAULT_SYSTEM_TYPE = 'イベント'

/* PAGES */
export const PAGE_ADMIN_HOME = 'ホーム'
export const PAGE_ADMIN_LIST_EVENTS = 'イベント'
export const PAGE_ADMIN_LIST_CAMPAIGN = 'キャンペーン'
export const PAGE_ADMIN_OCCASIONS = `${PAGE_ADMIN_LIST_EVENTS}予約管理`
export const PAGE_ADMIN_CUSTOMERS = '顧客管理'
export const PAGE_ADMIN_CAMPAIGN_CUSTOMERS = 'キャンペーン管理'
export const PAGE_ADMIN_AUDIENCES = 'オーディエンス'
export const PAGE_ADMIN_SETTINGS = '設定'
export const PAGE_ADMIN_SETTINGS_SYS = 'システム設定'
export const PAGE_ADMIN_SETTINGS_CUSTOM_REG = '会員証項目'
export const PAGE_ADMIN_SETTINGS_NOTIFICATION = '通知'
export const PAGE_ADMIN_SETTINGS_RICHMENU = 'リッチメニュー'

/* LABELS */
export const LABEL_ADMIN_LINE_LINK = 'LINEマネージャー'

/* FULLCALENDAR KEY */
export const FKEY = '0671443620-fcs-1624419667'
export const BUSINESS_OPEN_TIME = '07:00:00'
export const BUSINESS_OPEN_TIME_VALUE = 7
export const BUSINESS_CLOSE_TIME = '21:00:00'
export const BUSINESS_CLOSE_TIME_VALUE = 21
export const BUSINESS_INTERVAL_TIME_LABEL = '01:00:00'
export const BUSINESS_INTERVAL_TIME = '01:00:00'
export const BUSINESS_INTERVAL_TIME_VALUE = 60 //MUST BE MINUTE | 15 | 30 | 45 | 60

export const DEFAULT_CLIENT_CATEGORIES_SCREEN_TITLE = `ご希望の${DEFAULT_SYSTEM_TYPE}をお選び下さい`
export const DEFAULT_CLIENT_CATEGORIES_SCREEN_SUBTITLE = '※予約枠が埋まっていてもご相談ください'

/* OCCASION DEFAULT VALUE */
export const DEFAULT_OCCASION_CANCEL_ALLOWED = false
export const DEFAULT_OCCASION_CANCEL_LIMIT_DAY = 1
export const DEFAULT_OCCASION_CANCEL_LIMIT_HOUR = 18
export const DEFAULT_OCCASION_CANCEL_LIMIT_MINUTE = 0
export const DEFAULT_OCCASION_RESERVATION_LIMIT_ENABLED = false
export const DEFAULT_OCCASION_RESERVATION_LIMIT_DAY = 1
export const DEFAULT_OCCASION_RESERVATION_LIMIT_HOUR = 18
export const DEFAULT_OCCASION_RESERVATION_LIMIT_MINUTE = 0
export const DEFAULT_OCCURRENCE_MAX_PARTICIPATION = 3

export const OCCURRENCE_WARN_COUNT = 5

/* Days of week */
export const DAYS_OF_WEEK = [
	{
		label: '日',
		longLabel: '日曜日',
		value: 7,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
	{
		label: '月',
		longLabel: '月曜日',
		value: 1,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
	{
		label: '火',
		longLabel: '火曜日',
		value: 2,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
	{
		label: '水',
		longLabel: '水曜日',
		value: 3,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
	{
		label: '木',
		longLabel: '木曜日',
		value: 4,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
	{
		label: '金',
		longLabel: '金曜日',
		value: 5,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
	{
		label: '土',
		longLabel: '土曜日',
		value: 6,
		times: [
			{
				startTime: moment(BUSINESS_OPEN_TIME, 'HH:mm:ss'),
				endTime: moment(BUSINESS_CLOSE_TIME, 'HH:mm:ss'),
			},
		],
		enabled: true,
	},
]

/* FORM SCROLL CONFIG */
export const FORM_SCROLL_CONFIG = {
	behavior: 'smooth',
	block: 'top',
	inline: 'center',
}

/* THEME COLOR */
export const PRIMARY_COLOR = '#99CA29'
export const PRIMARY_LIGHT_COLOR = '#fdfff0'
export const SECONDARY_COLOR = '#21acd7'
export const SECONDARY_LIGHT_COLOR = '#f0feff'
export const THIRD_COLOR = '#fa8c16'
export const THIRD_LIGHT_COLOR = '#fff7e6'
export const CUSTOM_GREEN = '#8ac926'
export const CUSTOM_LIGHT_GREEN = '#fcfff0'
export const CUSTOM_RED = '#ff595e'
export const CUSTOM_LIGHT_RED = '#fff2f0'
export const CUSTOM_YELLOW = '#FAD717'
export const CUSTOM_LIGHT_YELLOW = '#FEFBE8'
export const CUSTOM_GRAY_COLOR = '#d9d9d9'
export const CUSTOM_CAMPAIGN_COLOR = '#960E0E'
export const GRAY_COLOR = '#9CA3AF'
export const WHITE_COLOR = '#FFF'
export const BLACK_COLOR = '#000'
export const SATURDAY_COLOR = '#00c2ff'
export const SUNDAY_COLOR = '#c40055'

export const THEME_COLORS = [
	'#99CA29',
	'#EA638C',
	'#DB5461',
	'#BB3E03',
	'#E85D75',
	'#C76D7E',
	'#AB92BF',
	'#8D6B94',
	'#4EA5D9',
	'#134074',
	'#005F73',
	'#8DA9C4',
	'#72A1E5',
	'#0A9396',
	'#84A07C',
	'#3C787E',
	'#77878B',
	'#9a8c98',
	'#9F8082',
	'#b5838d',
	'#6d6875',
	'#30343F',
	'#2E382E',
]

export const GET_AUDIENCE_STATUS = (value) => {
	switch (value) {
		case 'IN_PROGRESS':
			return (
				<Tag color='#fcbf49' className='mr-0'>
					作成中
				</Tag>
			)
		case 'READY':
			return (
				<Tag color='#06d6a0' className='mr-0'>
					完成
				</Tag>
			)
		case 'FAILED':
			return (
				<Tag color='#ff6b6b' className='mr-0'>
					エラー
				</Tag>
			)
		case 'EXPIRED':
			return (
				<Tag color='#f77f00' className='mr-0'>
					期限切れ
				</Tag>
			)
		case 'INACTIVE':
			return (
				<Tag color='#38a3a5' className='mr-0'>
					無効
				</Tag>
			)
		case 'ACTIVATING':
			return (
				<Tag color='#52b788' className='mr-0'>
					有効化中
				</Tag>
			)
		default:
			break
	}
}

export const OCCURRENCE_TIME_STYLE = (publicSettings) => {
	return {
		borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
		backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
		color: publicSettings?.PRIMARY_COLOR?.valueString,
	}
}

export const RESERVATION_STYLE = (publicSettings) => {
	return {
		borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
		backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString,
		color: WHITE_COLOR,
	}
}

export const ATTENDED_STYLE = (publicSettings) => {
	return {
		borderColor: SECONDARY_COLOR,
		backgroundColor: WHITE_COLOR,
		color: publicSettings?.PRIMARY_COLOR?.valueString,
	}
}

export const MAX_CAPACITY_STYLE = (publicSettings) => {
	return {
		borderColor: SECONDARY_COLOR,
		backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
		color: publicSettings?.PRIMARY_COLOR?.valueString,
	}
}

const REGISTRATION_EXPECTED_STYLE = () => {
	return {
		borderColor: SECONDARY_COLOR,
		backgroundColor: SECONDARY_LIGHT_COLOR,
		color: SECONDARY_COLOR,
	}
}

const REGISTRATION_ATTENDED_STYLE = (publicSettings) => {
	return {
		borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
		backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
		color: publicSettings?.PRIMARY_COLOR?.valueString,
	}
}

export const CHECK_IS_ATTENDED = (publicSettings, attended) => {
	if ((attended || 0) === 0) {
		return REGISTRATION_EXPECTED_STYLE(publicSettings)
	} else {
		return REGISTRATION_ATTENDED_STYLE(publicSettings)
	}
}

export const IS_ACTIVE = (end) => {
	if (end) {
		return moment().isSameOrBefore(moment(end), 'minute')
	} else {
		return false
	}
}

export const FIND_PERCENTAGE = (x, max) => {
	return Math.round((x / max) * 100)
}

export const OCCURRENCE_STATUS_FULL = 'full'
export const OCCURRENCE_STATUS_ALMOST_FULL = 'almost-full'
export const OCCURRENCE_STATUS_RESERVED = 'reserved'
export const OCCURRENCE_STATUS_AVAILABLE = 'available'

export const CHECK_IS_EVENT_FULL = (max, current) => {
	return max > 0 && current > 0 && max === current
}

export const GET_LEFT_SLOTS = (max, current) => {
	return max - current
}

export const IS_ALREADY_RESERVED = (registrations, occurrenceId) => {
	if (registrations && registrations.length > 0) {
		const isReserved = registrations.filter((registration) => {
			if (registration?.occurrences) {
				return registration.occurrences.find((ro) => ro?.occurrenceId === occurrenceId)
			} else {
				return false
			}
		})

		return isReserved.length > 0 ? true : false
	} else {
		return false
	}
}

export const CAN_RESERVE = (slotCount, registrations, occurrenceId, max, current) => {
	if (IS_ALREADY_RESERVED(registrations, occurrenceId)) {
		return false
	}

	if (CHECK_IS_EVENT_FULL(max, current)) {
		return false
	}

	if (GET_LEFT_SLOTS(max, current) < slotCount) {
		return false
	}

	return true
}

export const ARRAY_RANGE_CREATOR = (start, end, step) => {
	return Array(Math.ceil((end - start) / step))
		.fill(start)
		.map((x, y) => x + y * step)
}

export function USE_IS_MOUNTED_REF() {
	const isMountedRef = useRef(null)

	useEffect(() => {
		isMountedRef.current = true
		return () => (isMountedRef.current = false)
	})

	return isMountedRef
}

export function COLOR_ADJUST(color, amount) {
	const colors = generate(color)

	return colors[amount - 100] || colors[0]
}

export const RE_ORDER = (list, startIndex, endIndex): MemberAttribute[] => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)

	return result as MemberAttribute[]
}

export function POSTAL_CODE_INSERT_CHARACTER(str, index, value) {
	return str.substr(0, index) + value + str.substr(index)
}

export const RESIZE_FILE = (file, type) =>
	new Promise((resolve) => {
		Resizer.imageFileResizer(
			file,
			1024,
			1024,
			'JPEG',
			80,
			0,
			(uri) => {
				resolve(uri)
			},
			type,
		)
	})

export const SESSION_STORAGE_USER_INFO_KEY = 'PREGIO:USER_INFO'

const GET_SESSION_STORAGE_OR_DEFAULT = (key, defaultValue) => {
	const stored = sessionStorage.getItem(key)
	if (!stored) {
		return defaultValue
	}
	return JSON.parse(stored)
}

export const USE_SESSION_STORAGE = (key, defaultValue) => {
	const [value, setValue] = useState(GET_SESSION_STORAGE_OR_DEFAULT(key, defaultValue))

	useEffect(() => {
		sessionStorage.setItem(key, JSON.stringify(value))
	}, [key, value])

	return [value, setValue]
}

const GET_LOCAL_STORAGE_OR_DEFAULT = (key, defaultValue) => {
	const stored = localStorage.getItem(key)
	if (!stored) {
		return defaultValue
	}
	return JSON.parse(stored)
}

export const USE_LOCAL_STORAGE = (key, defaultValue) => {
	const [value, setValue] = useState(GET_LOCAL_STORAGE_OR_DEFAULT(key, defaultValue))

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value])

	return [value, setValue]
}

export const ANIMATION_VARIANT_STAGGER_CONTAINER = {
	hidden: {
		transition: {
			staggerChildren: 0.01,
			staggerDirection: -1,
			when: 'afterChildren',
		},
	},
	show: {
		transition: {
			staggerChildren: 0.04,
			staggerDirection: 1,
			when: 'beforeChildren',
		},
	},
}

export const ANIMATION_VARIANT_STAGGER_ITEM = {
	hidden: {
		opacity: 0,
		// scale: 1,
		transition: { type: 'linear' },
	},
	show: {
		opacity: 1,
		// scale: [0.95, 1],
		transition: { type: 'linear' },
	},
}

export const PREFECTURES = [
	{ value: 1, label: '北海道' },
	{ value: 2, label: '青森県' },
	{ value: 3, label: '岩手県' },
	{ value: 4, label: '宮城県' },
	{ value: 5, label: '秋田県' },
	{ value: 6, label: '山形県' },
	{ value: 7, label: '福島県' },
	{ value: 8, label: '茨城県' },
	{ value: 9, label: '栃木県' },
	{ value: 10, label: '群馬県' },
	{ value: 11, label: '埼玉県' },
	{ value: 12, label: '千葉県' },
	{ value: 13, label: '東京都' },
	{ value: 14, label: '神奈川県' },
	{ value: 15, label: '新潟県' },
	{ value: 16, label: '富山県' },
	{ value: 17, label: '石川県' },
	{ value: 18, label: '福井県' },
	{ value: 19, label: '山梨県' },
	{ value: 20, label: '長野県' },
	{ value: 21, label: '岐阜県' },
	{ value: 22, label: '静岡県' },
	{ value: 23, label: '愛知県' },
	{ value: 24, label: '三重県' },
	{ value: 25, label: '滋賀県' },
	{ value: 26, label: '京都府' },
	{ value: 27, label: '大阪府' },
	{ value: 28, label: '兵庫県' },
	{ value: 29, label: '奈良県' },
	{ value: 30, label: '和歌山県' },
	{ value: 31, label: '鳥取県' },
	{ value: 32, label: '島根県' },
	{ value: 33, label: '岡山県' },
	{ value: 34, label: '広島県' },
	{ value: 35, label: '山口県' },
	{ value: 36, label: '徳島県' },
	{ value: 37, label: '香川県' },
	{ value: 38, label: '愛媛県' },
	{ value: 39, label: '高知県' },
	{ value: 40, label: '福岡県' },
	{ value: 41, label: '佐賀県' },
	{ value: 42, label: '長崎県' },
	{ value: 43, label: '熊本県' },
	{ value: 44, label: '大分県' },
	{ value: 45, label: '宮崎県' },
	{ value: 46, label: '鹿児島県' },
	{ value: 47, label: '沖縄県' },
]
export const RICHMENU_INPUT_DISPLAY_LABEL = {
	uri: 'リンク先',
	message: 'メッセージ',
	customUriMembership: '会員証リンク',
	telephone: '電話番号',
}
// Unique values necessary as select options
export const RICHMENU_INPUT_OPTIONS = [
	{ value: 'telephone', label: '電話番号' },
	{ value: 'uri', label: 'リンク' },
	{ value: 'message', label: 'メッセージ' },
	{ value: 'customUriMembership', label: '会員証リンク' },
]
const getImageArea = (width: number, height: number) => ({
	compact: {
		'richmenu-template-guidem-01.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 3,
						height: height,
					},
				},
				{
					bounds: {
						x: width / 3,
						y: 0,
						width: width / 3,
						height: height,
					},
				},
				{
					bounds: {
						x: (width / 3) * 2,
						y: 0,
						width: width / 3,
						height: height,
					},
				},
			],
		},
		'richmenu-template-guidem-02.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 2,
						height: height,
					},
				},
				{
					bounds: {
						x: width / 2,
						y: 0,
						width: width / 2,
						height: height,
					},
				},
			],
		},
		'richmenu-template-guidem-03.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 2,
						height: height,
					},
				},
				{
					bounds: {
						x: width / 2,
						y: 0,
						width: width / 3,
						height: height,
					},
				},
			],
		},
		'richmenu-template-guidem-04.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 3,
						height: height,
					},
				},
				{
					bounds: {
						x: width / 3,
						y: 0,
						width: width / 2,
						height: height,
					},
				},
			],
		},
		'richmenu-template-guidem-05.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width,
						height: height,
					},
				},
			],
		},
	},
	large: {
		'richmenu-template-guidem-01.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: width / 3,
						y: 0,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: (width / 3) * 2,
						y: 0,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: 0,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: width / 3,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: (width / 3) * 2,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
			],
		},
		'richmenu-template-guidem-02.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 2,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: width / 2,
						y: 0,
						width: width / 2,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: 0,
						y: height / 2,
						width: width / 2,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: width / 2,
						y: height / 2,
						width: width / 2,
						height: height / 2,
					},
				},
			],
		},
		'richmenu-template-guidem-03.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: 0,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: width / 3,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: (width / 3) * 2,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
			],
		},
		'richmenu-template-guidem-04.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: (width / 3) * 2,
						height: height,
					},
				},
				{
					bounds: {
						x: (width / 3) * 2,
						y: 0,
						width: width / 3,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: (width / 3) * 2,
						y: height / 2,
						width: width / 3,
						height: height / 2,
					},
				},
			],
		},
		'richmenu-template-guidem-05.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width,
						height: height / 2,
					},
				},
				{
					bounds: {
						x: 0,
						y: height / 2,
						width: width,
						height: height / 2,
					},
				},
			],
		},
		'richmenu-template-guidem-06.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width / 2,
						height: height,
					},
				},
				{
					bounds: {
						x: width / 2,
						y: 0,
						width: width / 2,
						height: height,
					},
				},
			],
		},
		'richmenu-template-guidem-07.png': {
			areas: [
				{
					bounds: {
						x: 0,
						y: 0,
						width: width,
						height: height,
					},
				},
			],
		},
	},
})

export const isValidRichMenuDraft = (richMenu: Partial<RichMenu>) =>
	richMenu && richMenu.id !== undefined && richMenu.templateType

export const isValidRichMenu = (richMenu: Partial<RichMenu>) =>
	isValidRichMenuDraft(richMenu) && richMenu.groupId !== undefined

export const isPublishableTabGroup = (richMenu: Partial<RichMenu>) =>
	isValidRichMenu(richMenu) && richMenu.imageName

const isSameRichMenuAreaBounds = (area1: RichMenuArea, area2: RichMenuArea) =>
	area1.bounds.x === area2.bounds.x &&
	area1.bounds.y === area2.bounds.y &&
	area1.bounds.width === area2.bounds.width &&
	area1.bounds.height === area2.bounds.height

/**
 * This function takes in an object of richmenu templates and a list of partial richmenus.
 * It will fill in the areas of the partial richmenus based on the matching richmenu template.
 * If there is no matching template, the function will return the partial richmenus unmodified.
 * If there is a matching template, the function will return a new list of richmenus with their areas filled in.
 * The function will not modify the original partial richmenus list.
 * @param {object} templates - Object of richmenu templates, with optional keys for compact and large size
 * @param {RichMenuTemplate[]} [templates.compact] - List of compact size richmenu templates
 * @param {RichMenuTemplate[]} [templates.large] - List of large size richmenu templates
 * @param {Partial<RichMenu>[]} richMenus - List of partial richmenus to fill in areas from templates
 * @returns {Partial<RichMenu>[]} - List of partial richmenus with their areas filled in from templates
 */
export const insertRichMenuTemplateAreas = (
	templates:
		| {
				compact?: RichMenuTemplate[]
				large?: RichMenuTemplate[]
		  }
		| undefined,
	richMenus: Partial<RichMenu>[],
) => {
	// If there are no templates or no richmenus to fill in, return early
	if (
		templates === undefined ||
		(templates?.compact?.length === 0 && templates?.large?.length === 0) ||
		!richMenus
	) {
		return richMenus
	}

	return richMenus.map((richMenu) => {
		// Find the richmenu template that matches the partial richmenu's template type
		const template = Object.values(templates)
			.flat()
			.find((template) => template.name === richMenu.templateType)

		if (!template) {
			// If there is no matching template, return the partial richmenu unmodified
			return richMenu
		}

		// Create a new list of areas by mapping over the template's areas
		const mappedAreas = template.areas.map((area, index) => {
			// Find an existing richmenu area that matches the template area bounds
			const existingArea = richMenu?.areas?.find((richMenuArea) =>
				isSameRichMenuAreaBounds(richMenuArea, area),
			)

			// Replace with existing area if it exists
			if (existingArea) {
				return existingArea
			} else {
				// Otherwise, use template area with action but replace placeholder template text with empty new line
				if (area.action && 'text' in area.action) {
					area.action.text = '\n'
				}
				return area
			}
		})

		// Return a new partial richmenu with the filled in areas
		return {
			...richMenu,
			areas: mappedAreas,
		}
	})
}

/**
 * Checks whether the image file has a valid format and size for a richmenu image
 */
export const isValidRichMenuImageFile = (file: File | null) => {
	if (!file) return false
	const fileType = file.type
	const fileSize = file.size
	if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
		return false
	}
	// 1 MB in bytes
	if (fileSize > 1024 * 1024) {
		return false
	}
	return true
}

/**
 * Checks whether the image height and width are valid for a richmenu image
 */
export const isValidRichMenuImageSize = (width: number, height: number) => {
	const ratio = width / height
	if (ratio < 1.45) return false
	if (width < 800 || width > 2500) return false
	if (height < 250) return false
	return true
}

export const initialPublicSettings = Object.freeze({
	PRIMARY_COLOR: {
		name: API.SETTINGS_KEY_SYSTEM_COLOR,
		label: API.SETTINGS_LABEL_SYSTEM_COLOR,
		valueString: PRIMARY_COLOR,
	},
	PRIMARY_LIGHT_COLOR: {
		name: API.SETTINGS_KEY_SYSTEM_COLOR,
		label: API.SETTINGS_LABEL_SYSTEM_COLOR,
		valueString: PRIMARY_LIGHT_COLOR,
	},
	TITLE: {
		name: API.SETTINGS_KEY_SYSTEM_TITLE,
		label: API.SETTINGS_LABEL_SYSTEM_TITLE,
		valueString: import.meta.env.VITE_APP_SYSTEM_NAME,
	},
	ADMIN_INITIAL_RESERVABLE_COUNT: {
		name: API.SETTINGS_KEY_ADMIN_INITIAL_RESERVABLE_COUNT,
		label: API.SETTINGS_LABEL_ADMIN_INITIAL_RESERVABLE_COUNT,
		valueNumber: DEFAULT_OCCURRENCE_MAX_PARTICIPATION,
	},
	CLIENT_CATEGORIES_SCREEN_TITLE: {
		name: API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_TITLE,
		label: API.SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_TITLE,
		valueString: DEFAULT_CLIENT_CATEGORIES_SCREEN_TITLE,
	},
	CLIENT_CATEGORIES_SCREEN_SUBTITLE: {
		name: API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_SUBTITLE,
		label: API.SETTINGS_LABEL_CLIENT_CATEGORIES_SCREEN_SUBTITLE,
		valueString: DEFAULT_CLIENT_CATEGORIES_SCREEN_SUBTITLE,
	},
	RESERVATION_CONFIRM_URL: {
		name: API.SETTINGS_KEY_RESERVATION_CONFIRM_URL,
		label: API.SETTINGS_LABEL_RESERVATION_CONFIRM_URL,
		valueString: undefined,
	},
	COMPANY_TELEPHONE: {
		name: API.SETTINGS_KEY_COMPANY_TELEPHONE,
		label: API.SETTINGS_LABEL_COMPANY_TELEPHONE,
		valueString: undefined,
	},
	CANCEL_ALLOWED: {
		name: API.SETTINGS_KEY_BOOK_CANCEL_ALLOWED,
		label: API.SETTINGS_LABEL_BOOK_CANCEL_ALLOWED,
		valueFlag: DEFAULT_OCCASION_CANCEL_ALLOWED,
	},
	CANCEL_LIMIT_DAY: {
		name: API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_DAY,
		label: API.SETTINGS_LABEL_BOOK_CANCEL_LIMIT_DAY,
		valueNumber: DEFAULT_OCCASION_CANCEL_LIMIT_DAY,
	},
	CANCEL_LIMIT_HOUR: {
		name: API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_HOUR,
		label: API.SETTINGS_LABEL_BOOK_CANCEL_LIMIT_HOUR,
		valueNumber: DEFAULT_OCCASION_CANCEL_LIMIT_HOUR,
	},
	CANCEL_LIMIT_MINUTE: {
		name: API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_MINUTE,
		label: API.SETTINGS_LABEL_BOOK_CANCEL_LIMIT_MINUTE,
		valueNumber: DEFAULT_OCCASION_CANCEL_LIMIT_MINUTE,
	},
	CANCEL_TEXT: {
		name: API.SETTINGS_KEY_BOOK_CANCEL_TEXT,
		label: API.SETTINGS_LABEL_BOOK_CANCEL_TEXT,
		valueString: undefined,
	},
	RESERVATION_LIMIT_ENABLED: {
		name: API.SETTINGS_KEY_BOOK_LIMIT_ENABLED,
		label: API.SETTINGS_LABEL_BOOK_LIMIT_ENABLED,
		valueFlag: DEFAULT_OCCASION_RESERVATION_LIMIT_ENABLED,
	},
	RESERVATION_LIMIT_DAY: {
		name: API.SETTINGS_KEY_BOOK_LIMIT_DAY,
		label: API.SETTINGS_LABEL_BOOK_LIMIT_DAY,
		valueNumber: DEFAULT_OCCASION_RESERVATION_LIMIT_DAY,
	},
	RESERVATION_LIMIT_HOUR: {
		name: API.SETTINGS_KEY_BOOK_LIMIT_HOUR,
		label: API.SETTINGS_LABEL_BOOK_LIMIT_HOUR,
		valueNumber: DEFAULT_OCCASION_RESERVATION_LIMIT_HOUR,
	},
	RESERVATION_LIMIT_MINUTE: {
		name: API.SETTINGS_KEY_BOOK_LIMIT_MINUTE,
		label: API.SETTINGS_LABEL_BOOK_LIMIT_MINUTE,
		valueNumber: DEFAULT_OCCASION_RESERVATION_LIMIT_MINUTE,
	},
	MEMBER_MESSAGE_POST_MEMBER_REGISTER: {
		name: API.SETTINGS_KEY_MEMBER_MESSAGE_POST_MEMBER_REGISTER,
		label: API.SETTINGS_LABEL_MEMBER_MESSAGE_POST_MEMBER_REGISTER,
		valueString: undefined,
	},
	MEMBER_MESSAGE_RESERVATION: {
		name: API.SETTINGS_KEY_MEMBER_MESSAGE_RESERVATION,
		label: API.SETTINGS_LABEL_MEMBER_MESSAGE_RESERVATION,
		valueString: undefined,
	},
	MEMBER_MESSAGE_CAMPAIGN: {
		name: API.SETTINGS_KEY_MEMBER_MESSAGE_CAMPAIGN,
		label: API.SETTINGS_LABEL_MEMBER_MESSAGE_CAMPAIGN,
		valueString: undefined,
	},
	MEMBER_MESSAGE_REMIND1: {
		name: API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND1,
		label: API.SETTINGS_LABEL_MEMBER_MESSAGE_REMIND1,
		valueString: undefined,
	},
	MEMBER_MESSAGE_REMIND2: {
		name: API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND2,
		label: API.SETTINGS_LABEL_MEMBER_MESSAGE_REMIND2,
		valueString: undefined,
	},
	ADMIN_MESSAGE_MEMBER: {
		name: API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER,
		label: API.SETTINGS_LABEL_ADMIN_MESSAGE_MEMBER,
		valueString: undefined,
	},
	ADMIN_MESSAGE_CAMPAIGN: {
		name: API.SETTINGS_KEY_ADMIN_MESSAGE_CAMPAIGN,
		label: API.SETTINGS_LABEL_ADMIN_MESSAGE_CAMPAIGN,
		valueString: undefined,
	},
	ADMIN_MESSAGE_RESERVATION: {
		name: API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION,
		label: API.SETTINGS_LABEL_ADMIN_MESSAGE_RESERVATION,
		valueString: undefined,
	},
	ADMIN_MESSAGE_RESERVATION_CANCEL: {
		name: API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION_CANCEL,
		label: API.SETTINGS_LABEL_ADMIN_MESSAGE_RESERVATION_CANCEL,
		valueString: undefined,
	},
	BARCODE_ENABLED: {
		name: API.SETTINGS_KEY_BARCODE_ENABLED,
		label: API.SETTINGS_KEY_BARCODE_ENABLED,
		valueFlag: false,
	},
	POINTS_ENABLED: {
		name: API.SETTINGS_KEY_POINT_ENABLED,
		label: API.SETTINGS_KEY_POINT_ENABLED,
		valueFlag: false,
	},
	DATE_OF_EXPIRY_ENABLED: {
		name: API.SETTINGS_KEY_DATE_OF_EXPIRY_ENABLED,
		label: API.SETTINGS_KEY_DATE_OF_EXPIRY_ENABLED,
		valueFlag: false,
	},
})

/**
 * TODO: Normalize publicSettings frontend data usage with backend data, remove key reference and instead declare types
 * Transforms backend public settings records for frontend using static keys
 * @param data Public settings query data
 * @returns Data transformed using static keys
 */
export const transformPublicSettings = (data: any) => {
	const transformedPublicSettings: Record<string, systemSettingType> | undefined = {}
	if (data?.[API.SETTINGS_KEY_SYSTEM_COLOR]) {
		transformedPublicSettings.PRIMARY_COLOR = data?.[API.SETTINGS_KEY_SYSTEM_COLOR]
		transformedPublicSettings.PRIMARY_LIGHT_COLOR = {
			name: 'PRIMARY_LIGHT_COLOR',
			label: 'PRIMARY_LIGHT_COLOR',
			valueString: COLOR_ADJUST(data?.[API.SETTINGS_KEY_SYSTEM_COLOR].valueString, 100),
		}
	}
	if (data?.[API.SETTINGS_KEY_SYSTEM_TITLE])
		transformedPublicSettings.TITLE = data?.[API.SETTINGS_KEY_SYSTEM_TITLE]
	if (data?.[API.SETTINGS_KEY_ADMIN_INITIAL_RESERVABLE_COUNT])
		transformedPublicSettings.ADMIN_INITIAL_RESERVABLE_COUNT =
			data?.[API.SETTINGS_KEY_ADMIN_INITIAL_RESERVABLE_COUNT]
	if (data?.[API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_TITLE])
		transformedPublicSettings.CLIENT_CATEGORIES_SCREEN_TITLE =
			data?.[API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_TITLE]
	if (data?.[API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_SUBTITLE])
		transformedPublicSettings.CLIENT_CATEGORIES_SCREEN_SUBTITLE =
			data?.[API.SETTINGS_KEY_CLIENT_CATEGORIES_SCREEN_SUBTITLE]
	if (data?.[API.SETTINGS_KEY_RESERVATION_CONFIRM_URL])
		transformedPublicSettings.RESERVATION_CONFIRM_URL =
			data?.[API.SETTINGS_KEY_RESERVATION_CONFIRM_URL]
	if (data?.[API.SETTINGS_KEY_COMPANY_TELEPHONE])
		transformedPublicSettings.COMPANY_TELEPHONE = data?.[API.SETTINGS_KEY_COMPANY_TELEPHONE]
	if (data?.[API.SETTINGS_KEY_BOOK_CANCEL_ALLOWED])
		transformedPublicSettings.CANCEL_ALLOWED = data?.[API.SETTINGS_KEY_BOOK_CANCEL_ALLOWED]
	if (data?.[API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_DAY])
		transformedPublicSettings.CANCEL_LIMIT_DAY = data?.[API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_DAY]
	if (data?.[API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_HOUR])
		transformedPublicSettings.CANCEL_LIMIT_HOUR =
			data?.[API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_HOUR]
	if (data?.[API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_MINUTE])
		transformedPublicSettings.CANCEL_LIMIT_MINUTE =
			data?.[API.SETTINGS_KEY_BOOK_CANCEL_LIMIT_MINUTE]
	if (data?.[API.SETTINGS_KEY_BOOK_CANCEL_TEXT])
		transformedPublicSettings.CANCEL_TEXT = data?.[API.SETTINGS_KEY_BOOK_CANCEL_TEXT]
	if (data?.[API.SETTINGS_KEY_BOOK_LIMIT_ENABLED])
		transformedPublicSettings.RESERVATION_LIMIT_ENABLED =
			data?.[API.SETTINGS_KEY_BOOK_LIMIT_ENABLED]
	if (data?.[API.SETTINGS_KEY_BOOK_LIMIT_DAY])
		transformedPublicSettings.RESERVATION_LIMIT_DAY = data?.[API.SETTINGS_KEY_BOOK_LIMIT_DAY]
	if (data?.[API.SETTINGS_KEY_BOOK_LIMIT_HOUR])
		transformedPublicSettings.RESERVATION_LIMIT_HOUR = data?.[API.SETTINGS_KEY_BOOK_LIMIT_HOUR]
	if (data?.[API.SETTINGS_KEY_BOOK_LIMIT_MINUTE])
		transformedPublicSettings.RESERVATION_LIMIT_MINUTE =
			data?.[API.SETTINGS_KEY_BOOK_LIMIT_MINUTE]
	if (data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_POST_MEMBER_REGISTER])
		transformedPublicSettings.MEMBER_MESSAGE_POST_MEMBER_REGISTER =
			data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_POST_MEMBER_REGISTER]
	if (data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_RESERVATION])
		transformedPublicSettings.MEMBER_MESSAGE_RESERVATION =
			data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_RESERVATION]
	if (data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_CAMPAIGN])
		transformedPublicSettings.MEMBER_MESSAGE_CAMPAIGN =
			data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_CAMPAIGN]
	if (data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND1])
		transformedPublicSettings.MEMBER_MESSAGE_REMIND1 =
			data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND1]
	if (data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND2])
		transformedPublicSettings.MEMBER_MESSAGE_REMIND2 =
			data?.[API.SETTINGS_KEY_MEMBER_MESSAGE_REMIND2]
	if (data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER])
		transformedPublicSettings.ADMIN_MESSAGE_MEMBER =
			data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_MEMBER]
	if (data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_CAMPAIGN])
		transformedPublicSettings.ADMIN_MESSAGE_CAMPAIGN =
			data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_CAMPAIGN]
	if (data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION])
		transformedPublicSettings.ADMIN_MESSAGE_RESERVATION =
			data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION]
	if (data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION_CANCEL])
		transformedPublicSettings.ADMIN_MESSAGE_RESERVATION_CANCEL =
			data?.[API.SETTINGS_KEY_ADMIN_MESSAGE_RESERVATION_CANCEL]
	if (data?.[API.SETTINGS_KEY_BARCODE_ENABLED])
		transformedPublicSettings.BARCODE_ENABLED = data?.[API.SETTINGS_KEY_BARCODE_ENABLED]
	if (data?.[API.SETTINGS_KEY_POINT_ENABLED])
		transformedPublicSettings.POINTS_ENABLED = data?.[API.SETTINGS_KEY_POINT_ENABLED]
	if (data?.[API.SETTINGS_KEY_DATE_OF_EXPIRY_ENABLED])
		transformedPublicSettings.DATE_OF_EXPIRY_ENABLED =
			data?.[API.SETTINGS_KEY_DATE_OF_EXPIRY_ENABLED]
	return transformedPublicSettings
}

export const memberAttributeLabels: Record<string, Record<string, string>> = {
	string: {
		text: 'テキスト',
		textarea: 'テキストエリア',
		color: 'カラー',
		url: 'URL',
	},
	number: {
		number_integer: '整数',
		number_float: '浮動小数点数',
	},
	choice: {
		boolean: '真偽値',
		select: 'セレクトボックス（単一選択形式）',
		radio: 'ラジオボタン（単一選択形式）',
		checkbox: 'チェックボックス（複数選択形式）',
	},
	date: {
		date: '日付',
		time: '時間',
		datetime: '日時',
	},
	file: {
		image: '画像',
		// file: 'ファイル',
		// video: 'ビデオ',
		// audio: 'オーディオ'
	},
	contact: {
		email: 'メール',
		telephone: '電話番号',
	},
	name: {
		fullName: '氏名',
		fullNameKana: '氏名 カナ',
		firstName: '名前 (名)',
		lastName: '名前 (姓)',
		firstNameKana: '名前 (名) カナ',
		lastNameKana: '名前 (姓) カナ',
	},
	address: {
		address_postal: '郵便番号',
		address_prefecture: '都道府県',
		address_city: '住所',
		address_address: '町域',
		address_building: '建物名',
	},
}

// Flattens memberAttributeLabels object into a single object
export const FLAT_MEMBER_ATTRIBUTE_LABELS = Object.values(memberAttributeLabels).reduce(
	(accum, curr) => ({ ...accum, ...curr }),
	{},
)

export const filterLabels = {
	createdAtMin: '友だち追加日から',
	createdAtMax: '友だち追加日まで',
	memberSinceMin: '会員登録日から',
	memberSinceMax: '会員登録日まで',
	lastVisitMin: '最終来店日から',
	lastVisitMax: '最終来店日まで',
	isFriends: {
		label: 'ブロック状態',
		'0': { label: 'ブロックユーザーのみ', value: 0 },
		'1': { label: 'ブロックユーザーを含まない', value: 1 },
	},
	isRegistered: {
		label: '会員登録状態',
		true: { label: '会員登録あり', value: true },
		false: { label: '会員登録なし', value: false },
	},
	messages: {
		label: 'LINEチャット',
		unread: {
			label: '未読',
			value: 'unread',
		},
		read: {
			label: '既読',
			value: 'read',
		},
	},
}

export const compareDateTime = (a: Date | null, b: Date | null) => {
	// Handle null values
	if (a === null) return 1 // Move null values to the end
	if (b === null) return -1

	// Compare datetime strings
	const dateA = new Date(a)
	const dateB = new Date(b)
	return dateA.getTime() - dateB.getTime()
}

export const deepCopy = <T extends object>(source: T): T => {
	function isObject(value: unknown): value is object {
		return typeof value === 'object' && value !== null
	}

	if (!isObject(source)) {
		return source // Return the value if it's not an object
	}

	if (source instanceof File) {
		// If it's a File object, create a new instance with the same properties
		return new File([source], source.name, { type: source.type }) as unknown as T
	}

	// Create a new instance of the same type as the source object
	const target: T = Array.isArray(source) ? ([] as unknown as T) : ({} as T)

	// Recursively copy the properties of the source object
	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			const value = source[key]
			if (isObject(value)) {
				target[key] = deepCopy(value) as T[Extract<keyof T, string>]
			} else {
				target[key] = value
			}
		}
	}

	return target
}

export const isURL = (str: string) => {
	const urlRegex =
		'^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$'
	const url = new RegExp(urlRegex, 'i')
	return str.length < 2083 && url.test(str)
}

export const isValidJapanesePhoneNumber = (str: string): boolean => {
	// Regular expression pattern for Japanese phone numbers
	const japanPhonePattern =
		/^(tel:?)?(0\d{1,4}-?\d{1,4}-?\d{3,4}|0[789]0-\d{4}-?\d{4}|050-?\d{4}-?\d{4}|\+?\d{1,2}?[-\s]?(\(\d{2,}\)?\d+[-\s]?\d{3,5}[-\s]?\d{3,4}|\d{7,12}))$/

	return japanPhonePattern.test(str?.trimEnd())
}

export const getMemberAttributeDataTypes = (currentMemberAttribute: { type: string }) => {
	const currentType = currentMemberAttribute?.type || ''

	return [
		{
			title: '文字列タイプ',
			key: 'string',
			children: [
				{
					title: 'テキスト',
					value: 'text',
					key: 'string-text',
					disabled: currentType !== '' && currentType !== 'text',
				},
				// {
				// 	title: 'テキストエリア',
				// 	value: 'textarea',
				// 	key: 'string-textarea',
				// 	disabled: currentType !== '' && currentType !== 'textarea'
				// },
				// {
				// 	title: 'カラー',
				// 	value: 'color',
				// 	key: 'string-color',
				// 	disabled: currentType !== '' && currentType !== 'color'
				// },
				// { title: 'URL', value: 'url', key: 'string-url', disabled: currentType !== '' && currentType !== 'url' }
			],
		},
		// {
		// 	title: '数値タイプ',
		// 	key: 'number',
		// 	children: [
		// 		{
		// 			title: '整数',
		// 			value: 'number_integer',
		// 			key: 'number-integer',
		// 			disabled: currentType !== '' && currentType !== 'number_integer'
		// 		},
		// 		{
		// 			title: '浮動小数点数',
		// 			value: 'number_float',
		// 			key: 'number-float',
		// 			disabled: currentType !== '' && currentType !== 'number_float'
		// 		}
		// 	]
		// },
		{
			title: '選択タイプ',
			key: 'choice',
			children: [
				// {
				// 	title: '真偽値',
				// 	value: 'boolean',
				// 	key: 'choice-boolean',
				// 	disabled: currentType !== '' && currentType !== 'boolean'
				// },
				{
					title: 'セレクトボックス（単一選択形式）',
					value: 'select',
					key: 'choice-select',
					disabled: currentType !== '' && currentType !== 'select',
				},
				{
					title: 'ラジオボタン（単一選択形式）',
					value: 'radio',
					key: 'choice-radio',
					disabled: currentType !== '' && currentType !== 'radio',
				},
				{
					title: 'チェックボックス（複数選択形式）',
					value: 'checkbox',
					key: 'choice-checkbox',
					disabled: currentType !== '' && currentType !== 'checkbox',
				},
			],
		},
		{
			title: '日付タイプ',
			key: 'date',
			children: [
				{
					title: '日付',
					value: 'date',
					key: 'date-date',
					disabled: currentType !== '' && currentType !== 'date',
				},
				// {
				// 	title: '時間',
				// 	value: 'time',
				// 	key: 'date-time',
				// 	disabled: currentType !== '' && currentType !== 'time'
				// },
				// {
				// 	title: '日時',
				// 	value: 'datetime',
				// 	key: 'date-datetime',
				// 	disabled: currentType !== '' && currentType !== 'datetime'
				// }
			],
		},
		{
			title: 'ファイルタイプ',
			key: 'file',
			children: [
				{
					title: '画像',
					value: 'image',
					key: 'file-image',
					disabled: currentType !== '' && currentType !== 'image',
				},
				// {
				// 	title: 'ファイル',
				// 	value: 'file',
				// 	key: 'file-file',
				// 	disabled: true
				// },

				// {
				// 	title: 'ビデオ',
				// 	value: 'video',
				// 	key: 'file-video',
				// 	disabled: true
				// },
				// {
				// 	title: 'オーディオ',
				// 	value: 'audio',
				// 	key: 'file-audio',
				// 	disabled: true
				// }
			],
		},
		{
			title: '連絡先タイプ',
			key: 'contact',
			children: [
				{
					title: 'メール',
					value: 'email',
					key: 'contact-email',
					disabled: currentType !== '' && currentType !== 'email',
				},
				{
					title: '電話番号',
					value: 'telephone',
					key: 'contact-telephone',
					disabled: currentType !== '' && currentType !== 'telephone',
				},
			],
		},
		// {
		// 	title: '名前タイプ',
		// 	key: 'name',
		// 	children: [
		// 		{
		// 			title: '名前 (名)',
		// 			value: 'firstName',
		// 			key: 'name-firstName',
		// 			disabled: currentType !== '' && currentType !== 'firstName'
		// 		},
		// 		{
		// 			title: '名前 (姓)',
		// 			value: 'lastName',
		// 			key: 'name-lastName',
		// 			disabled: currentType !== '' && currentType !== 'lastName'
		// 		},
		// 		{
		// 			title: '名前 (名) カナ',
		// 			value: 'firstNameKana',
		// 			key: 'name-firstNameKana',
		// 			disabled: currentType !== '' && currentType !== 'firstNameKana'
		// 		},
		// 		{
		// 			title: '名前 (姓) カナ',
		// 			value: 'lastNameKana',
		// 			key: 'name-lastNameKana',
		// 			disabled: currentType !== '' && currentType !== 'lastNameKana'
		// 		},
		// 		{
		// 			title: '氏名',
		// 			value: 'fullName',
		// 			key: 'name-fullName',
		// 			disabled: currentType !== '' && currentType !== 'fullName'
		// 		},
		// 		{
		// 			title: '氏名 カナ',
		// 			value: 'fullNameKana',
		// 			key: 'name-fullNameKana',
		// 			disabled: currentType !== '' && currentType !== 'fullNameKana'
		// 		}
		// 	]
		// },
		{
			title: '住所タイプ',
			key: 'address',
			children: [
				{
					title: '郵便番号',
					value: 'address_postal',
					key: 'address_postal',
					disabled: currentType !== '' && currentType !== 'address_postal',
				},
				{
					title: '都道府県',
					value: 'address_prefecture',
					key: 'address-prefecture',
					disabled: currentType !== '' && currentType !== 'address_prefecture',
				},
				{
					title: '住所',
					value: 'address_city',
					key: 'address-city',
					disabled: currentType !== '' && currentType !== 'address_city',
				},
				// {
				// 	title: '町域',
				// 	value: 'address_address',
				// 	key: 'address-address',
				// 	disabled: currentType !== '' && currentType !== 'address_address'
				// },
				// {
				// 	title: '建物名',
				// 	value: 'address_building',
				// 	key: 'address-building',
				// 	disabled: currentType !== '' && currentType !== 'address_building'
				// }
			],
		},
	]
}

export const DEFAULT_MEMBERS_FILTERS_STATE = {
	lineNameFilter: undefined,
	addressFilter: undefined,
	createdAtMinFilter: undefined,
	createdAtMaxFilter: undefined,
	memberSinceMinFilter: undefined,
	memberSinceMaxFilter: undefined,
	lastVisitMinFilter: undefined,
	lastVisitMaxFilter: undefined,
	isRegisteredFilter: undefined,
	messagesFilter: undefined,
	isFriendsFilter: undefined,
}

// TODO: Potentially make more generic
// Finds the attribute that belongs to the given same section
export const findMemberAttributeBy = ({
	type,
	section,
	memberAttributes,
}: {
	type: string
	section: string | null
	memberAttributes: MemberAttribute[]
}) =>
	memberAttributes.find(
		(memberAttribute) => memberAttribute.type === type && memberAttribute.section === section,
	)

export const generateMemberAttributeAddressStr = ({
	member,
	memberAttributes,
	addrGroupSection,
}: {
	member: memberType
	memberAttributes: MemberAttribute[]
	addrGroupSection: string | null
}) => {
	const addressValues: string[] = []
	const sectionAttributes = { section: addrGroupSection, memberAttributes }

	const memberAttributeAddressPart = [
		findMemberAttributeBy({ type: 'address_postal', ...sectionAttributes }),
		findMemberAttributeBy({ type: 'address_prefecture', ...sectionAttributes }),
		findMemberAttributeBy({ type: 'address_city', ...sectionAttributes }),
		findMemberAttributeBy({ type: 'address_address', ...sectionAttributes }),
		findMemberAttributeBy({ type: 'address_building', ...sectionAttributes }),
	].filter(Boolean)

	memberAttributeAddressPart.forEach((addressPart) => {
		const addressMemberAttrKey = `memberAttributeId${addressPart?.memberAttributeId}`
		const addressValue = member[addressMemberAttrKey as keyof memberType] as string
		if (addressPart?.type === 'address_postal' && addressValue) {
			addressValues.push(`〒${addressValue}`)
		} else if (addressValue) {
			addressValues.push(addressValue)
		}
	})

	return addressValues.join('、')
}

/**
 * Returns the original ordered array with same-section address duplicates removed. First address section is kept.
 * @param memberAttributes
 */
export const groupMemberAttributeAddress = (memberAttributes: MemberAttribute[]) =>
	memberAttributes.reduce((attrArraySet, curr) => {
		// If the current attribute is an address, check if the same section already exists in the array
		if (
			!attrArraySet.some(
				(item) => curr.archType === 'address' && item.section === curr.section,
			)
		) {
			attrArraySet.push(curr)
		}
		return attrArraySet
	}, [] as MemberAttribute[])
