import { NextFunction, Request, Response } from 'express'
import { systemConfig, PERMISSION_ERROR, RESPONSE_SUCCESS } from '../config'
import { AppError, EncUtils } from '../utilities'
import { AuthenticationService } from '../services'

export const Login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!(req.body.username && req.body.password)) {
			throw new AppError(PERMISSION_ERROR, 'invalid parameters', false)
		}
		const isAuthenticated = await AuthenticationService.login(req.body)
		if (isAuthenticated == null) {
			throw new AppError(PERMISSION_ERROR, 'email or password mismatch', false)
		}

		const userSession: managerSessionDataType = {
			managerId: isAuthenticated.managerId,
			username: req.body.username,
			role: 10,
			expires: 86400000 * 7 // 7 days in ms
		}

		const existingSession = await AuthenticationService.checkUserSession(userSession)
		if (existingSession) {
			res.cookie(systemConfig.SESS_NAME as string, existingSession.token, { maxAge: 86400000 * 7 })
		}

		const token = EncUtils.signJWT(userSession)
		await AuthenticationService.createUserSession({ ...userSession, token })

		res.cookie(systemConfig.SESS_NAME as string, token, { maxAge: 86400000 * 7 })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

export const CheckUserSession = async (req: Request, res: Response) => {
	const jwt = req.cookies?.[systemConfig.SESS_NAME as string] ?? ''
	const decoded = EncUtils.decodeJWT(jwt)
	if (decoded === null) {
		return res.sendStatus(PERMISSION_ERROR)
	}
	const { managerId, username } = decoded as { managerId: number; username: string }
	const existingSession = await AuthenticationService.checkUserSession({
		managerId,
		username
	})

	const manager = await AuthenticationService.getManager(managerId)
	if (!existingSession || !manager) return res.sendStatus(PERMISSION_ERROR)

	res.sendStatus(RESPONSE_SUCCESS)
}

export const Logout = async (req: Request, res: Response) => {
	const jwt = req.cookies?.[systemConfig.SESS_NAME as string] ?? ''
	await AuthenticationService.logout(jwt)
	res.clearCookie(systemConfig.SESS_NAME as string, { path: '/' })
	res.sendStatus(RESPONSE_SUCCESS)
}
