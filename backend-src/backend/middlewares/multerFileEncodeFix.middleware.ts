import { Request, Response, NextFunction } from 'express'
import { FileUtils } from '../utilities'
// export const multerFileEncodingFixer1 = (req: Request, res: Response, next: NextFunction) => {
//     let reqFiles = req.files as { categoryImages?: Express.Multer.File[] };
//     let images = reqFiles?.categoryImages ?? [];
//     if (images.length > 0) {
//         (req.files as { categoryImages: Express.Multer.File[] }).categoryImages = images.map(f => FileUtils.changeEncodingLatin1ToUTF(f));
//     }
//     next();
// };
export const multerFileEncodingFixer = (filename: string, isArray: boolean) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (isArray && req.files) {
			// TODO: Confirm this usage
			const reqFiles = req.files as Record<string, Express.Multer.File[]>
			// eslint-disable-next-line security/detect-object-injection
			const images = reqFiles[filename]
			if (images && images.length > 0)
				// eslint-disable-next-line security/detect-object-injection
				(req.files as Record<string, Express.Multer.File[]>)[filename] = images.map((f) =>
					FileUtils.changeEncodingLatin1ToUTF(f)
				)

			// Encode the images correctly in the request
			if (
				Array.isArray(req.files) &&
				req.files.some((f: Express.Multer.File) => /image\/(jpeg|png)/i.test(f.mimetype))
			) {
				req.files = req.files.map((f) =>
					/image\/(jpeg|png)/i.test(f.mimetype) ? FileUtils.changeEncodingLatin1ToUTF(f) : f
				)
			}
		} else if (req.file) {
			req.file = FileUtils.changeEncodingLatin1ToUTF(req.file)
		}
		next()
	}
}
