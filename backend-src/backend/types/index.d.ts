type paginationParams = {
	pp: number //per page
	p: number //page
	sort: 'asc' | 'desc' //asc | desc | undefined, default - asc
	sortKey: string //sort key
}
type memberAttributeTypeSymType = {
	// string types
	text: string
	textarea: string
	color: string
	url: string
	// number types
	number_integer: number
	number_float: number
	// choice types
	boolean: boolean
	select: string
	radio: string
	checkbox: string
	// date types
	date: string // 'YYYY-MM-DD'
	time: string // 'HH:mm:ss'
	datetime: Date // 'YYYY-MM-DDTHH:mm:ssZ (ISO 8601)'
	// file types
	file: string
	image: string
	video: string
	audio: string
	// contact types
	email: string
	telephone: string
} & memberAttributeNameType &
	memberAttributeAddressType
// name types
type memberAttributeNameType = {
	firstName: string
	lastName: string
	firstNameKana: string
	lastNameKana: string
	fullName: string
	fullNameKana: string
}
// address types
type memberAttributeAddressType = {
	address_postal: string
	address_prefecture: string
	address_city: string
	address_address: string
	address_building: string
}
type memberAttributeArchType = memberAttributeTypeSymType[memberAttributeType]
type memberAttributeType = keyof memberAttributeTypeSymType

type richmenuType = 'defaultRM' | 'memberRM'

type chatContentType = 'image' | 'text' | 'video' | 'call' | 'slideshow' | 'file' | 'audio'
type chatSource = 'user' | 'manager' | 'system'

type authTypes = {
	master: 10
	manager: 5
}

type managerSessionDataType = {
	managerId: number
	username: string
	role: number
	expires: number
}

type registrationMemberInfoType = {
	memberId?: number
	firstName: string
	lastName: string
	firstNameKana: string
	lastNameKana: string
	telephone: string
	postalCode: string
	building: string
	address: string
	memberAttributeId1?: string
	memberAttributeId2?: string
}

type systemSettingType = {
	label: string
	valueFlag: boolean | null
	valueString: string | null
	valueNumber: number | null
}

type deadlineType = {
	days: number
	hours: number
	minutes: number
}
type bookingDeadlineType = deadlineType & { isEnabled: boolean }
type cancelBookingDeadlineType = deadlineType & { isAllowed: boolean }

type lineProfile = {
	userId: string
	displayName: string | null
	pictureUrl: string | null
	statusMessage: string | null
}

type imageUpdateType = { originalName: string; showOrder: number }

type audienceSearchQuestionSubtype = {
	attributeId: number
	value: string | number | Date
	valueMin: string | number | Date
	valueMax: string | number | Date
}

type audienceSearchType = {
	address?: string
	memberSinceMin?: string
	memberSinceMax?: string
	isCampaign?: true
	hasWon?: boolean
	candidateAtMin?: string
	candidateAtMax?: string
}
type audienceCreateType = audienceSearchType & {
	audienceName: string
}

type questionArgumentValueType = string[] | string | number | Date
type questionArgumentType = {
	questionId: number
	value: questionArgumentValueType
	valueMin: questionArgumentValueType
	valueMax: questionArgumentValueType
}

// type UploadedRichMenuImage = {
// 	contents: Buffer
// 	filename: string
// }

// type RichMenuTabGroupUpdateRequest = {
// 	richMenu: Richmenu
// 	displayPriority?: 'USER' | 'DEFAULT'
// 	tabGroupId?: number
// 	tabCount?: number
// 	tabIndex: number
// 	transaction: Transaction
// }

type pointSource = 'ec' | 'kakeru' | 'qr-visit'
