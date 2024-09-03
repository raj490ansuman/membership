/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import { writeLog } from './logger.util'

/**
 * Creates a directory only if it doesn't exist
 */
const safeCreateDirectorySync = (dirPath: string) => {
	try {
		// Check if the directory exists
		checkPathExistsSync(dirPath)
	} catch (err: any) {
		// Directory doesn't exist, create it
		if (err.code === 'ENOENT') fs.mkdirSync(dirPath, { recursive: true })
		else writeLog({ msg: 'Error in createDirectory:', err: err }, 'error')
	}
}
/**
 * Check if a directory exists and delete it recursively.
 * If the directory doesn't exist, the error code is 'ENOENT'
 * @param dirPath - The path of the directory to delete.
 * @returns
 */
const deleteDirectory = async (dirPath: string) => {
	try {
		await fs.promises.access(dirPath, fs.constants.F_OK)
		return await fs.promises.rm(dirPath, { recursive: true })
	} catch (err: any) {
		if (err.code === 'ENOENT') writeLog({ msg: `${dirPath} does not exist.`, err: err }, 'info')
		else writeLog({ msg: 'Error deleting in deleteDirectory:', err: err }, 'error')
	}
}
const checkPathExistsSync = (filepath: string) => fs.accessSync(filepath, fs.constants.R_OK | fs.constants.W_OK)
const checkFileExists = async (filepath: string) => fs.promises.access(filepath)
const deleteFile = async (filepath: string) =>
	fs.promises.unlink(filepath).catch((err) => writeLog({ msg: 'err deleteFile', err: err }, 'error'))

const saveBufferToFile = async (buffer: Buffer, filepath: string, filename: string) =>
	fs.promises
		.writeFile(filepath, buffer)
		.then(() => filename)
		.catch((e) => {
			writeLog({ msg: 'err saveBufferToFile', datatype: typeof buffer, filepath: filepath, e: e }, 'error')
			return filename
		})

const readBufferFromFile = async (filepath: string) => fs.promises.readFile(filepath)

const changeEncodingLatin1ToUTF = (f: Express.Multer.File) => {
	// eslint-disable-next-line no-control-regex
	if (!/[^\u0000-\u00ff]/.test(f.originalname))
		f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8')
	return f
}

export default {
	safeCreateDirectorySync,
	deleteDirectory,
	checkPathExistsSync,
	checkFileExists,
	deleteFile,
	saveBufferToFile,
	readBufferFromFile,
	changeEncodingLatin1ToUTF
}
