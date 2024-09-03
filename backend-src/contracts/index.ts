import { initContract } from '@ts-rest/core'
import { MemberAttributeAPI } from './memberAttribute.contracts'
import { RichMenuAPI } from './richmenu.contracts'
import { RichMenuTabGroupAPI } from './richmenuTabGroup.contracts'
import { SettingsAPI } from './settings.contracts'
import { RootAPI } from './root.contracts'
// import { AudienceAPI } from './audience.contracts'
// import { SpectatorAPI } from './spectator.contracts'

const c = initContract()

export const ContractAPI = c.router(
	{
		memberAttributes: MemberAttributeAPI,
		richmenus: RichMenuAPI,
		richmenutabgroups: RichMenuTabGroupAPI,
		root: RootAPI,
		settings: SettingsAPI,
		// audiences: AudienceAPI,
		// spectators: SpectatorAPI,

	},
	{
		pathPrefix: '/api'
	}
)
