import { initContract } from '@ts-rest/core'
import {
	zCommonResponse,
	zDeleteSettingsBody,
	zGetSystemSettingResponse,
	zGetSystemSettingsResponse,
	zSetBulkSystemSettingsBody,
	zSetSystemSettingsBody
} from '../schemas'

const c = initContract()

export const SettingsAPI = c.router(
	{
		getSystemSettings: {
			description: 'getSystemSettings',
			method: 'GET',
			path: '',
			responses: {
				200: zGetSystemSettingsResponse
			}
		},
		getSystemSetting: {
			description: 'getSystemSetting',
			method: 'GET',
			path: '/:key',
			responses: {
				200: zGetSystemSettingResponse
			}
		},
		setBulkSystemSettings: {
			description: 'setBulkSystemSettings',
			method: 'PUT',
			path: '',
			body: zSetBulkSystemSettingsBody,
			responses: {
				200: zCommonResponse
			}
		},
		setSystemSettings: {
			description: 'setSystemSettings',
			method: 'PUT',
			path: '/:key',
			body: zSetSystemSettingsBody,
			responses: {
				200: zCommonResponse
			}
		},
		deleteSettings: {
			description: 'deleteSettings',
			method: 'DELETE',
			path: '/:key',
			body: zDeleteSettingsBody,
			responses: {
				200: zCommonResponse
			}
		}
	},
	{
		pathPrefix: '/settings'
	}
)
