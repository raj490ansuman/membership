export const AUTH_LEVELS: authTypes = {
	master: 10,
	manager: 5
}
export const API_TIMEOUT = 10000

export const RESPONSE_SUCCESS = 200
export const BAD_REQUEST = 400
export const PERMISSION_ERROR = 401 //not enough authorization
export const SESSION_ERROR = 403 //no-session
export const NOT_ACCEPTABLE = 406 //not acceptable
export const CONFLICT_ERROR = 409
export const TOO_MANY_REQUESTS = 429
export const SYSTEM_ERROR = 500

export const MEMBER_WATCH_MESSAGE = '新規登録の通知です！\n会員：[NAME]'
export const REGISTRATION_WATCH_MESSAGE = '新規予約の通知です！\n会員：[NAME]\n予約日付：[DATE]'

export const WATCH_MESSAGE_KEY_MEMBER = 'watchMemberTemplate'
export const WATCH_MESSAGE_KEY_MEMBER_POST_REGISTRATION = 'postMemberRegistrationMessage'
export const WATCH_MESSAGE_KEY_REGISTRATION = 'watchRegistrationTemplate'
export const WATCH_MESSAGE_KEY_REGISTRATION_CANCEL = 'watchRegistrationCancelTemplate'

export const MEMBER_ATTRIBUTE_ADDRESS_TYPES = Object.freeze([
	'address_postal',
	'address_prefecture',
	'address_city',
	'address_address',
	'address_building'
] as (keyof memberAttributeAddressType)[])

export const memberAttributeArchTypeFromType: Record<memberAttributeType, memberAttributeArchType> = Object.freeze({
	text: 'string',
	textarea: 'string',
	color: 'string',
	url: 'string',
	number_integer: 'number',
	number_float: 'number',
	date: 'date',
	time: 'date',
	datetime: 'date',
	boolean: 'choice',
	select: 'choice',
	radio: 'choice',
	checkbox: 'choice',
	file: 'file',
	image: 'file',
	video: 'file',
	audio: 'file',
	email: 'contact',
	telephone: 'contact',
	address_postal: 'address',
	address_prefecture: 'address',
	address_city: 'address',
	address_address: 'address',
	address_building: 'address',
	firstName: 'name',
	lastName: 'name',
	firstNameKana: 'name',
	lastNameKana: 'name',
	fullName: 'name',
	fullNameKana: 'name'
})
