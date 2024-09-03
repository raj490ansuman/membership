interface FetchError {
	[x: string]: any
	message: string
	error: {
		response: object
	}
}

interface FetchResponse {
	memberId?: number
	data?: {
		registrations?: [any]
		current?: string
		rows?: [any]
		pp?: number
		p?: number
		count?: number
		sort?: string
		sortKey?: string
	}
}
type audienceStatusType = 'IN_PROGRESS' | 'READY' | 'FAILED' | 'EXPIRED' | 'INACTIVE' | 'ACTIVATING'
type audienceType = {
	audienceGroupId: string
	description: string
	remarks: string
	audienceCount: number
	status: audienceStatusType
	created: Date
}

type Props = {
	PRIMARY_LIGHT_COLOR: BackgroundColor | undefined
	PRIMARY_COLOR: Color | undefined
	logo?: string
	publicSettings?: any | string
	auth?: { auth: Object }
	children?: React.ReactNode
	personalInfo?: any
	accessToken?: string | undefined
	isCollapsed?: boolean
	toggleCollapse?: any
	isHamburger?: boolean
	isMemberDetailModalVisible?: boolean
	toggleMemberDetailModal?: any
	hideMemberDetailModal?: any
	memberAttributes?: any
	currentMember?: any
	memberDetail?: any
	$publicSettings?: {
		PRIMARY_COLOR: string
		PRIMARY_LIGHT_COLOR: string
	}
	open?: any
	onCancel?: any
	memberId?: number
}
type Richmenus = {
	defaultRM?: {
		richmenuId?: string
		richMenuActions?: { type: string; uri: string; text: string }[]

		picUrl?: string
		type?: string
		isDisplayed?: boolean
		link1?: string
		link2?: string
		link3?: string
		link4?: string
		link5?: string
		link6?: string
		imgType?: string
		areas?: string | object
		template?: string
		createdAt?: Date
		updatedAt?: Date
	}
	memberRM?: {
		richmenuId?: string
		picUrl?: string
		type?: string
		isDisplayed?: boolean
		link1?: string
		link2?: string
		link3?: string
		link4?: string
		link5?: string
		link6?: string
		imgType?: string
		areas?: string
		template?: string
		createdAt?: Date
		updatedAt?: Date
	}
}
interface Event {
	key?: string
}

interface Pagination {
	order: Pagination
	field: Pagination
	current: number
	pageSize: number
	total: number
	sorter: {
		order: string
		field: string
	}
}
interface TopBarProps {
	toggleDrawer?: () => void
	isBigScreen?: boolean
}

interface tableColumn {
	title: string
	dataIndex: string
	key: string
	render?: any
	width?: number
	sorter?: any
	defaultSortOrder?: any
	align?: 'left' | 'center' | 'right'
}
interface profileDataType {
	lastName: string
	firstName: string
	lastNameKana: string
	firstNameKana: string
	telephone: string | number
	prefecture: string | number
	postalCode: string | number
	address: string
	building: string
	email: string
	password: string
	passwordConfirm: string
}
interface memberType {
	memberId: string
	displayName: string
	picUrl: string
	activeUntil: Date | string
	memberSince: Date | string
	lastName: string
	firstName: string
	lastNameKana: string
	firstNameKana: string
	telephone: string
	prefecture: string
	postalCode: string
	address: string
	building: string
	email: string
	status: string
	createdAt: Date | string
	updatedAt: Date | string
	memberId: number | string
	unreadCount: number
	candidateAt: Date | string
	lastVisit: Date | string
	kakeruPoint: number
	remarks: string
}

interface filterType {
	fullNameFilter: string
	genderFilter: string
	countVisitMinFilter: number
	countVisitMaxFilter: number
	telephoneFilter: number
	lastVisitMinFilter: number | string
	lastVisitMaxFilter: number | string
	isFriendFilter: boolean
}
interface RichMenu {
	richmenuId?: string
	picUrl?: string
	type?: string
	isDisplayed?: boolean
	link1?: string | null
	link2?: string | null
	link3?: string | null
	createdAt?: string
	updatedAt?: string
}

interface DefaultRM extends RichMenu {
	type: 'defaultRM'
}

interface MemberRM extends RichMenu {
	type: 'memberRM'
}

interface RichMenuState {
	defaultRM?: DefaultRM
	memberRM?: MemberRM
}
interface FormData extends FormData {
	[key: string]: string | File | Blob
}

type MemberAttributeChoice = {
	attributeChoiceId: number
	contents: string
	showOrder: number
}

type MemberAttributeChoice = {
	campaignChoiceId: number
	contents: string
}

interface MemberAttribute {
	archType?: string | null
	attributeChoices?: MemberAttributeChoice[]
	campaignChoices?: MemberAttributeChoice[]
	isAdminDisplayed: boolean
	isMemberDisplayed: boolean
	label: string
	memberAttributeId: number
	required: boolean
	section: string | null
	showOrder: number
	type: string
}

type systemSettingType = {
	name: string
	label: string
	valueFlag?: boolean
	valueString?: string
	valueNumber?: number
}

type LayoutConfigCtx = {
	logo?: string | null
	favicon?: string | null
	storePic?: string | null
	publicSettings?: Record<string, systemSettingType>
}

interface GenericTableColumn<T> {
	align?: 'left' | 'center' | 'right'
	title?: string | ReactNode
	dataIndex?: string
	key?: string
	width?: number
	render?: (value: string, record: T) => ReactNode
}

type ChatMessage = {
	chatId: number
	contents: string
	contentType: ChatMessageContentType
	source: 'user' | 'manager'
	createdAt: Date
	updatedAt: Date
	memberId: number
}
