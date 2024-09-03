import path from 'path'
import { NextFunction, Request, Response } from 'express'
import pwgen from 'generate-password'
import multer from 'multer'
import sharp from 'sharp'
import { lineConfig, systemConfig } from '../config'
import { FileUtils } from '../utilities'

const occasionStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, systemConfig.PATH_FILE_UPLOAD_OCCASION)
	},
	filename: (req, file, cb) => {
		cb(null, `${pwgen.generate({ length: 10, numbers: true })}${path.extname(file.originalname)}`)
	}
})

const categoryStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, systemConfig.PATH_FILE_UPLOAD_CATEGORY)
	},
	filename: (req, file, cb) => {
		cb(null, `${pwgen.generate({ length: 10, numbers: true })}${path.extname(file.originalname)}`)
	}
})

const settingStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, systemConfig.PATH_FILE_UPLOAD_SETTING)
	},
	filename: (req, file, cb) => {
		cb(null, `${pwgen.generate({ length: 10, numbers: true })}${path.extname(file.originalname)}`)
	}
})
const memberStorage = multer.diskStorage({
	destination: async (req, file, cb) => {
		// Store custom registration uploads in separate directory for easier purge
		const uploadFileName = Buffer.from(file.originalname, 'latin1').toString('utf8') // Temporary fix to encode correctly https://github.com/expressjs/multer/issues/1104
		const memberAttributeUploadEntry = Object.entries(req.body).find(
			([k, v]) => k.startsWith('memberAttributeId') && v == uploadFileName
		)
		const memberAttributeEntryKey = memberAttributeUploadEntry?.[0]
		const memberAttributeId = memberAttributeEntryKey?.split('memberAttributeId')?.[1]

		// Check if an upload is associated to a custom registration
		if (memberAttributeId != null) {
			const uploadDirectory = systemConfig.PATH_FILE_UPLOAD_MEMBER_ATTRIBUTE_ID(memberAttributeId)
			// Ensure custom registration directory exists and create it if it doesn't
			FileUtils.safeCreateDirectorySync(uploadDirectory)

			cb(null, uploadDirectory)
		} else {
			cb(null, systemConfig.PATH_FILE_UPLOAD_MEMBER)
		}
	},
	filename: (req, file, cb) => {
		cb(null, `${pwgen.generate({ length: 10, numbers: true })}${path.extname(file.originalname)}`)
	}
})

const memStorage = multer.memoryStorage()

export const memberUploadImage = multer({
	storage: memberStorage,
	fileFilter: (req, file, cb) => {
		const fileFormat = path.extname(file.originalname).toLowerCase()
		if (['.jpg', '.jpeg', '.png'].includes(fileFormat)) {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error(`Only .png, .jpg, and .jpeg format allowed! current format ${fileFormat}`))
		}
	}
})

export const uploadImage = multer({
	storage: settingStorage,
	fileFilter: (req, file, cb) => {
		const fileFormat = path.extname(file.originalname)
		if (['.jpg', '.jpeg', '.png', '.svg'].includes(fileFormat)) {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error(`Only .png, .svg, .jpg, and .jpeg format allowed! current format ${fileFormat}`))
		}
	}
})
export const uploadIco = multer({
	storage: settingStorage,
	fileFilter: (req, file, cb) => {
		if (path.extname(file.originalname) == '.ico') {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error(`Only .ico format allowed! ${path.extname(file.originalname)}`))
		}
	}
})

export const uploadOccasion = multer({ storage: occasionStorage })
export const uploadCategoryPic = multer({ storage: categoryStorage })
export const richmenuUpload = multer({ storage: memStorage })

export const validateRichmenuImageUpload = (req: Request, res: Response, next: NextFunction) => {
	// check file exists
	if (!req.file) return next(new Error('No file found'))

	const fileFormat = path.extname(req.file.originalname).toLowerCase()
	if (!['.jpg', '.jpeg', '.png'].includes(fileFormat))
		return next(new Error(`Only .png, .jpg, and .jpeg format allowed! current format ${fileFormat}`))

	sharp(req.file.buffer).metadata((err, metadata) => {
		if (err) return next(new Error('Invalid image'))

		if (!metadata.width || !metadata.height || !metadata.size) return next(new Error('Invalid image metadata'))
		else if (
			metadata.width < lineConfig.RICHMENU_MIN_IMAGE_WIDTH ||
			metadata.width > lineConfig.RICHMENU_MAX_IMAGE_WIDTH
		)
			return next(new Error(`Image width ${metadata.width} exceeds limit`))
		else if (metadata.height < lineConfig.RICHMENU_MIN_IMAGE_HEIGHT)
			return next(new Error(`Image height ${metadata.height} exceeds limit`))
		else if (metadata.width / metadata.height < lineConfig.RICHMENU_MIN_ASPECT_RATIO)
			return next(new Error(`Invalid image aspect ratio ${metadata.width / metadata.height}`))
		else if (metadata.size > lineConfig.RICHMENU_MAX_BYTE_FILE_SIZE)
			return next(new Error(`File size ${metadata.size} exceeds limit`))
		next()
	})
}
