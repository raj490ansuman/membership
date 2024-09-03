import path from 'path'
import { CreationAttributes } from 'sequelize'
import { RESPONSE_SUCCESS, systemConfig, SYSTEM_ERROR } from '../config'
import { AppError, FileUtils, SocketUtil } from '../utilities'
import { db } from '../models/index'
import { SystemSetting } from '../models/systemSetting.model'
import { SettingService } from '../services'
import type { ContractAPI } from '../../contracts'
import { AppRouteOptions } from '@ts-rest/express'

export const getSystemSettings: AppRouteOptions<
	typeof ContractAPI.settings.getSystemSettings
>['handler'] = async () => {
	const settings = await db.SystemSetting.getSettings()
	return {
		status: 200,
		body: {
			data: settings,
			message: 'Successfully retrieved system settings',
			success: true
		}
	}
}

export const getSystemSetting: AppRouteOptions<typeof ContractAPI.settings.getSystemSetting>['handler'] = async ({
	params
}) => {
	const key = params.key
	if (!key) {
		throw new AppError(SYSTEM_ERROR, 'invalid key', false)
	}
	const setting = await db.SystemSetting.findSettings(key)
	return {
		status: 200,
		body: {
			data: setting,
			message: 'Successfully retrieved system setting',
			success: true
		}
	}
}

export const getPublicSettings: AppRouteOptions<typeof ContractAPI.root.getPublicSettings>['handler'] = async () => {
	const sysSettings = await db.SystemSetting.findPublicSettings()
	return {
		status: 200,
		body: {
			data: sysSettings,
			message: 'Successfully retrieved public settings',
			success: true
		}
	}
}

export const setBulkSystemSettings: AppRouteOptions<
	typeof ContractAPI.settings.setBulkSystemSettings
>['handler'] = async ({ body }) => {
	const settings = body.settings as CreationAttributes<SystemSetting>[]
	if (!settings || settings.length == 0) {
		throw new AppError(SYSTEM_ERROR, 'invalid parameters')
	}
	try {
		await SettingService.updateSettingsInBulk(settings)
		SocketUtil.emitSystemSetting({ keys: settings.map((s) => s.name) })
		return {
			status: 200,
			body: {
				message: 'Successfully updated bulk settings',
				success: true
			}
		}
	} catch (e) {
		return {
			status: 500,
			body: {
				message: `Unsuccessful updated bulk settings, ${(e as Error).message}`,
				success: false
			}
		}
	}
}

export const setSystemSettings: AppRouteOptions<typeof ContractAPI.settings.setSystemSettings>['handler'] = async ({
	body,
	params
}) => {
	const key = params.key
	if (!key) {
		throw new AppError(SYSTEM_ERROR, 'invalid key', false)
	}
	const { label, valueFlag, valueString, valueNumber, isPublic } = body as {
		label: string
		valueFlag?: boolean
		valueString?: string
		valueNumber?: number
		isPublic?: boolean
	}
	let setting = await db.SystemSetting.findByPk(key)
	if (setting == null) {
		setting = await db.SystemSetting.create({
			name: key,
			label: label,
			valueFlag: valueFlag,
			valueString: valueString,
			valueNumber: valueNumber,
			isPublic: isPublic
		})
	} else {
		setting.set({
			label: label,
			valueFlag: valueFlag,
			valueString: valueString,
			valueNumber: valueNumber,
			isPublic: isPublic
		})
		if (setting.changed()) {
			setting = await setting.save()
		}
	}
	SocketUtil.emitSystemSetting({ keys: [key] })
	return {
		status: 200,
		body: {
			message: 'Successfully updated settings',
			success: true
		}
	}
}

export const deleteSettings: AppRouteOptions<typeof ContractAPI.settings.deleteSettings>['handler'] = async ({
	params
}) => {
	const key = params.key
	if (!key) {
		throw new AppError(SYSTEM_ERROR, 'invalid key', false)
	}
	await db.SystemSetting.deleteSettings(key)
	SocketUtil.emitSystemSetting({ keys: [key] })
	return {
		status: 200,
		body: {
			message: 'Successfully deleted settings',
			success: true
		}
	}
}

export const getFavicon: AppRouteOptions<typeof ContractAPI.root.getFavicon>['handler'] = async () => {
	const favicon = await db.SystemSetting.findFavicon()
	return {
		status: 200,
		body: {
			data: favicon?.valueString ?? null,
			message: 'Successfully retrieved favicon',
			success: true
		}
	}
}

export const setFavicon: AppRouteOptions<typeof ContractAPI.root.setFavicon>['handler'] = async ({ req }) => {
	if (!req.file || !req.file.filename) {
		throw new AppError(SYSTEM_ERROR, 'no favicon file', false)
	}
	if (!req.file.filename.endsWith('.ico')) {
		await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, req.file.filename)).then(() => {
			throw new AppError(SYSTEM_ERROR, `wrong file format ${req.file?.filename}`)
		})
	}
	let favicon = await db.SystemSetting.findOne({ where: { name: 'favicon' } })
	if (favicon == null) {
		favicon = await db.SystemSetting.createSettings({
			name: 'favicon',
			label: 'ファビコン',
			valueString: req.file.filename
		})
	} else {
		if (favicon.valueString != null) {
			await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, favicon.valueString))
		}
		await favicon.update({
			label: 'ファビコン',
			valueString: req.file.filename
		})
	}
	SocketUtil.emitFavicon({ favicon: req.file.filename })
	return {
		status: RESPONSE_SUCCESS,
		body: {
			message: 'Successfully set favicon',
			success: true
		}
	}
}

export const getLogo: AppRouteOptions<typeof ContractAPI.root.getLogo>['handler'] = async () => {
	const logo = await db.SystemSetting.findLogo()
	return {
		status: 200,
		body: {
			data: logo?.valueString ?? null,
			message: 'Successfully retrieved logo',
			success: true
		}
	}
}

export const setLogo: AppRouteOptions<typeof ContractAPI.root.setLogo>['handler'] = async ({ req }) => {
	if (!req.file || !req.file.filename) {
		throw new AppError(SYSTEM_ERROR, 'no logo file', false)
	}
	let logo = await db.SystemSetting.findOne({ where: { name: 'logo' } })
	if (logo == null) {
		logo = await db.SystemSetting.createSettings({
			name: 'logo',
			label: 'ロゴ',
			valueString: req.file.filename
		})
	} else {
		if (logo.valueString != null) {
			await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, logo.valueString))
		}
		await logo.update({
			label: 'ロゴ',
			valueString: req.file.filename
		})
	}
	SocketUtil.emitLogo({ logo: req.file.filename })
	return {
		status: RESPONSE_SUCCESS,
		body: {
			message: 'Successfully set logo',
			success: true
		}
	}
}

export const getStorePic: AppRouteOptions<typeof ContractAPI.root.getStorePic>['handler'] = async () => {
	const storePic = await db.SystemSetting.findStorePic()
	return {
		status: 200,
		body: {
			data: storePic?.valueString ?? null,
			message: 'Successfully retrieved store picture',
			success: true
		}
	}
}

export const setStorePic: AppRouteOptions<typeof ContractAPI.root.setStorePic>['handler'] = async ({ req }) => {
	if (!req.file || !req.file.filename) {
		throw new AppError(SYSTEM_ERROR, 'no store pic file', false)
	}
	let storePic = await db.SystemSetting.findOne({ where: { name: 'storePic' } })
	if (storePic == null) {
		storePic = await db.SystemSetting.createSettings({
			name: 'storePic',
			label: '店舗画像',
			valueString: req.file.filename
		})
	} else {
		if (storePic.valueString != null) {
			await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, storePic.valueString))
		}
		await storePic.update({
			label: '店舗画像',
			valueString: req.file.filename
		})
	}
	SocketUtil.emitStorePic({ storePic: req.file.filename })
	return {
		status: RESPONSE_SUCCESS,
		body: {
			message: 'Successfully set store picture',
			success: true
		}
	}
}
