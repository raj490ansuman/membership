import { initContract } from '@ts-rest/core'
import {
	zCommonResponse,
	zGetFaviconResponse,
	zGetLogoResponse,
	zGetSettingsResponse,
	zGetStorePicResponse
} from '../schemas'

const c = initContract()

export const RootAPI = c.router({
	getFavicon: {
		description: 'favicon',
		method: 'GET',
		path: '/favicon',
		responses: {
			200: zGetFaviconResponse
		}
	},
	getLogo: {
		description: 'logo',
		method: 'GET',
		path: '/logo',
		responses: {
			200: zGetLogoResponse
		}
	},
	getStorePic: {
		description: 'Store image',
		method: 'GET',
		path: '/store/pic',
		responses: {
			200: zGetStorePicResponse
		}
	},
	getPublicSettings: {
		description: 'settings',
		method: 'GET',
		path: '/publicSettings',
		responses: {
			200: zGetSettingsResponse
		}
	},
	setLogo: {
		description: 'setLogo',
		method: 'PUT',
		path: '/logo',
		contentType: 'multipart/form-data',
		body: c.type<{ logo: File }>(),
		responses: {
			200: zCommonResponse
		}
	},
	setFavicon: {
		description: 'setFavicon',
		method: 'PUT',
		path: '/favicon',
		contentType: 'multipart/form-data',
		body: c.type<{ favicon: File }>(),
		responses: {
			200: zCommonResponse
		}
	},
	setStorePic: {
		description: 'setStorePic',
		method: 'PUT',
		path: '/store/pic',
		contentType: 'multipart/form-data',
		body: c.type<{ storePic: File }>(),
		responses: {
			200: zCommonResponse
		}
	}
})
