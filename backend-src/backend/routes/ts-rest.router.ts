import { initServer } from '@ts-rest/express'
import { ContractAPI } from '../../contracts'
import { MemberAttributeRouter } from './memberAttribute.router'
import { RichMenuRouter } from './richmenus.router'
import { RichMenuTabGroupRouter } from './richmenuTabGroup.router'
import { SettingsRouter } from './settings.router'
import { RootRouter } from './root.router'
// import { AudienceRouter } from './audience.router' 

const s = initServer()

export const router = s.router(ContractAPI, {
	memberAttributes: MemberAttributeRouter,
	richmenus: RichMenuRouter,
	richmenutabgroups: RichMenuTabGroupRouter,
	root: RootRouter,
	settings: SettingsRouter,
	// audiences: AudienceRouter,
})
