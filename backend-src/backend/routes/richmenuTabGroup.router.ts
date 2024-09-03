import { initServer } from '@ts-rest/express'
import { ContractAPI } from '../../contracts'
import { RichmenuController } from '../controllers'

const s = initServer()

export const RichMenuTabGroupRouter = s.router(ContractAPI.richmenutabgroups, {
	createRichMenuTabGroup: {
		handler: RichmenuController.createRichMenuTabGroup
	},
	getRichMenuTabGroups: {
		handler: RichmenuController.getRichMenuTabGroups
	},
	getRichMenuTabGroup: {
		handler: RichmenuController.getRichMenuTabGroup
	},
	publishRichmenuTabGroup: {
		handler: RichmenuController.publishRichmenuTabGroup
	},
	unpublishRichmenuTabGroup: {
		handler: RichmenuController.unpublishRichmenuTabGroup
	},
	updateRichmenuTabGroup: {
		handler: RichmenuController.updateRichmenuTabGroup
	},
	deleteRichMenuTabGroup: {
		handler: RichmenuController.deleteRichMenuTabGroup
	}
})
