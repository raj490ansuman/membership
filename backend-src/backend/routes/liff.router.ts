import { Router } from 'express'
import { LiffController, MemberAttributeController, MemberController } from '../controllers'
import { memberUploadImage, multerFileEncodingFixer } from '../middlewares'

const router = Router()

router.get('/personal', LiffController.getPersonalInfo)
router.post(
	'/personal',
	memberUploadImage.array('photos', 10),
	multerFileEncodingFixer('photos', true),
	LiffController.setPersonalInfo
)

router.get('/member-attributes', MemberAttributeController.listLiffMemberAttributes)

router.post('/visits/qr-code', MemberController.recordMemberVisitByQrCode)

export { router }
