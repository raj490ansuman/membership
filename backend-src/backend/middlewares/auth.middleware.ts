import { NextFunction, Request, Response } from 'express'
import { AuthenticationService } from '../services'
import { SESSION_ERROR, systemConfig } from '../config'
import { AppError, EncUtils } from '../utilities'

export const checkSession = async (req: any, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies[systemConfig.SESS_NAME as string] as string
		if (!token) throw new AppError(SESSION_ERROR, 'session does not exist', false)

		const decoded = EncUtils.decodeJWT(token)
		if (decoded === null) {
			throw new AppError(SESSION_ERROR, 'session invalid', false)
		}
		const { managerId, username } = decoded as { managerId: number; username: string }
		const existingSession = await AuthenticationService.checkUserSession({
			managerId,
			username
		})

		if (!existingSession) throw new AppError(SESSION_ERROR, 'session does not exist', false)
		next()
	} catch (e) {
		next(e)
	}
}
export const checkLineProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers['access-token']) {
			throw new AppError(SESSION_ERROR, 'access-token', false)
		}
		const isVerified = await AuthenticationService.verifyAccessToken(req.headers['access-token'] as string)
		if (!isVerified) {
			throw new AppError(SESSION_ERROR, 'not verified', false)
		}
		const memberLine = await AuthenticationService.getProfileByToken(req.headers['access-token'] as string)
		if (!memberLine) {
			throw new AppError(SESSION_ERROR, 'profile not found', false)
		}
		res.locals.memberLine = memberLine
		next()
	} catch (e) {
		next(e)
	}
}
