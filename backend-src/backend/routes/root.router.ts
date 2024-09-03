import { initServer } from '@ts-rest/express'
import { SystemSettingController } from '../controllers'
import { ContractAPI } from '../../contracts'
import { multerFileEncodingFixer, checkSession, uploadIco, uploadImage } from '../middlewares'

const s = initServer()

export const RootRouter = s.router(ContractAPI.root, {
	getFavicon: {
		handler: SystemSettingController.getFavicon
	},
	getLogo: {
		handler: SystemSettingController.getLogo
	},
	getStorePic: {
		handler: SystemSettingController.getStorePic
	},
	getPublicSettings: {
		handler: SystemSettingController.getPublicSettings
	},
	setLogo: {
		middleware: [checkSession, uploadImage.single('logo'), multerFileEncodingFixer('logo', false)],
		handler: SystemSettingController.setLogo
	},
	setFavicon: {
		middleware: [checkSession, uploadIco.single('favicon'), multerFileEncodingFixer('favicon', false)],
		handler: SystemSettingController.setFavicon
	},
	setStorePic: {
		middleware: [checkSession, uploadImage.single('storePic'), multerFileEncodingFixer('storePic', false)],
		handler: SystemSettingController.setStorePic
	}
})
