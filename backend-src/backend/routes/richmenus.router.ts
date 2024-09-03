import { initServer } from '@ts-rest/express'
import { ContractAPI } from '../../contracts'
import { RichmenuController } from '../controllers'

const s = initServer()

export const RichMenuRouter = s.router(ContractAPI.richmenus, {
	getRichMenuTemplates: {
		handler: RichmenuController.getRichMenuTemplates
	},
	getRichMenu: {
		handler: RichmenuController.getRichMenu
	},
	setRichMenuImage: {
		handler: RichmenuController.setRichMenuImage
	}
})
