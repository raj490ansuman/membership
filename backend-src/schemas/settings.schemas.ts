import { z } from 'zod'
import { zCommonResponse } from './common.schemas'

export const zFavicon = z.string().nullable()
export const zLogo = z.string().nullable()
export const zSettings = z.record(z.string(), z.custom<systemSettingType>())

export const zStorePic = z.string().nullable()

export const zGetFaviconResponse = zCommonResponse.extend({
	data: zFavicon
})
export const zGetLogoResponse = zCommonResponse.extend({
	data: zLogo
})
export const zGetSettingsResponse = zCommonResponse.extend({
	data: zSettings
})
export const zGetStorePicResponse = zCommonResponse.extend({
	data: zStorePic
})

export const zSystemSetting = z.object({
	name: z.string(),
	label: z.string(),
	valueFlag: z.boolean().nullable().optional(),
	valueString: z.string().nullable().optional(),
	valueNumber: z.number().nullable().optional(),
	isPublic: z.boolean()
})

export const zGetSystemSettingsResponse = zCommonResponse.extend({
	data: zSettings
})
export const zGetSystemSettingResponse = zCommonResponse.extend({
	data: zSystemSetting.nullable()
})
export const zSetBulkSystemSettingsBody = z.object({
	settings: z.array(zSystemSetting)
})
export const zSetSystemSettingsBody = z
	.object({
		key: z.string()
	})
	.extend(
		zSystemSetting.partial({
			name: true,
			valueFlag: true,
			valueString: true,
			valueNumber: true
		}).shape
	)
export const zDeleteSettingsBody = z.object({})
