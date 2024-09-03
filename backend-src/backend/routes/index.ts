import { Router } from 'express'
import { RESPONSE_SUCCESS } from '../config'
import { checkSession, checkLineProfile, errorLogger, errorResponder } from '../middlewares'
import { AuthenticationController, ManagerController } from '../controllers'
import { router as MasterRouter } from './master.router'
import { router as LiffRouter } from './liff.router'
import { router as LineRouter } from './line.router'
const router = Router()

// router.use('/line', LineWebhook);
router.post('/login', AuthenticationController.Login)
router.get('/logout', AuthenticationController.Logout)
router.get('/sess', checkSession, (req, res) => {
	res.sendStatus(RESPONSE_SUCCESS)
})
router.get('/auth', checkSession, ManagerController.checkAuthenticatedUser)

router.use('/m', checkSession, MasterRouter)
router.use('/hooks', LineRouter)
router.use('/liff', checkLineProfile, LiffRouter)
router.use(errorLogger, errorResponder)
export { router }
