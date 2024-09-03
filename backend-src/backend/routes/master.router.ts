import { Router } from 'express'
import { memberUploadImage, multerFileEncodingFixer } from '../middlewares'
import {
	AudienceController,
	ChatController,
	MemberController,
	TemplateController,
	SpectatorController
} from '../controllers'

const router = Router()

router.get('/members/chats/:memberId', ChatController.getChat)
router.post('/members/chats/:memberId', ChatController.replyChat)
router.post('/members/csv', MemberController.generateMemberCSV)
router.get('/members', MemberController.browseMembers)
router.get('/members/list', MemberController.listMembers)
router.put(
	'/members/:memberId',
	memberUploadImage.array('photos', 10),
	multerFileEncodingFixer('photos', true),
	MemberController.updateMember
)
router.get('/members/:memberId', MemberController.getMember)
router.post('/members/barcode', MemberController.recordMemberVisitByMemberCode)
router.delete('/members/:memberId', MemberController.deleteMember)
router.post('/followers/sync', MemberController.syncFollowers)
//SPECTATORS
router.get('/spectators/candidates', SpectatorController.listPossibleSpectators)
router.get('/spectators', SpectatorController.listSpectators)
router.post('/spectators', SpectatorController.bulkEditSpectators)
router.delete('/spectators/:spectatorId', SpectatorController.deleteSpectator)

router.get('/audiences', AudienceController.listAudiences)
router.post('/audiences/find', AudienceController.searchAudience)
router.post('/audiences', AudienceController.createAudience)
router.delete('/audiences/:audienceGroupId', AudienceController.deleteAudience)

router.post('/templates', TemplateController.createTemplate)
router.get('/templates', TemplateController.browseTemplates)
router.get('/templates/:templateId', TemplateController.getTemplate)
router.put('/templates/:templateId', TemplateController.updateTemplate)
router.delete('/templates/:templateId', TemplateController.deleteTemplate)

export { router }
