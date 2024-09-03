import { initServer } from '@ts-rest/express'
import { SystemSettingController } from '../controllers'
import { ContractAPI } from '../../contracts'

const s = initServer()

export const SettingsRouter = s.router(ContractAPI.settings, {
	getSystemSettings: {
		handler: SystemSettingController.getSystemSettings
	},
	getSystemSetting: {
		handler: SystemSettingController.getSystemSetting
	},
	setBulkSystemSettings: {
		handler: SystemSettingController.setBulkSystemSettings
	},
	setSystemSettings: {
		handler: SystemSettingController.setSystemSettings
	},
	deleteSettings: {
		handler: SystemSettingController.deleteSettings
	}
})
