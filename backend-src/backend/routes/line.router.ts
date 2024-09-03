import { Router, Request, Response, NextFunction } from 'express'
import { middleware } from '@line/bot-sdk'
import { lineConfig, RESPONSE_SUCCESS } from '../config'
import { devAuthenticateMiddleware } from '../middlewares'
import { LineController, MemberController } from '../controllers'

const router = Router()

router.post(
	'/line',
	middleware({
		channelSecret: lineConfig.LINE_CHANNEL_SECRET,
		channelAccessToken: lineConfig.LINE_CHANNEL_ACCESS_TOKEN
	}),
	(req: Request, res: Response, next: NextFunction) => {
		Promise.all(req.body.events.map(LineController.handleEvent))
			.then(() => res.sendStatus(RESPONSE_SUCCESS))
			.catch(next)
	}
)

router.post('/dev/sync-followers', devAuthenticateMiddleware, MemberController.syncFollowers)

export { router }
