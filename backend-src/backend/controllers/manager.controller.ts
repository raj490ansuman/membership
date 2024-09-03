import { Request, Response, NextFunction } from 'express'
import { SESSION_ERROR, AUTH_LEVELS } from '../config'
import { AuthenticationService } from '../services'

export const checkAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const managerId = AuthenticationService.getManagerIdFromCookie(req)
		if (managerId === null) return res.sendStatus(SESSION_ERROR)
		const manager = await AuthenticationService.getManager(managerId)
		if (managerId === null || manager === null) return res.sendStatus(SESSION_ERROR)

		res.send({
			auth: manager.authLevel == AUTH_LEVELS.master ? 'master' : 'manager',
			username: manager.username
		})
	} catch (e) {
		next(e)
	}
}
