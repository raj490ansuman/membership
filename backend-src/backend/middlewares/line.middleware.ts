import os from 'os'
import type { NextFunction, Request, Response } from 'express'
import { SYSTEM_ERROR } from '../config'
import { AppError } from '../utilities'

// This middleware is used to authenticate requests from the same server.
// i.e. the CRON task that makes HTTP request to the endpoint
function devAuthenticateMiddleware(req: Request, res: Response, next: NextFunction) {
	const isAuthenticated = checkIpAddress(req, getServerIPAddress())
	if (isAuthenticated) next()
	else next(new AppError(SYSTEM_ERROR, `invalid headerForwardedFor ${req.ip}`))
}

function checkIpAddress(req: Request, serverIpAddress?: string) {
	if (serverIpAddress === undefined) throw new Error('invalid serverIpAddress')
	let ip = req.headers['x-forwarded-for']
	if (Array.isArray(ip)) ip = ip[0]

	const headerForwardedFor = req.headers['x-forwarded-for']
	if (headerForwardedFor === undefined) throw new Error('invalid headerForwardedFor')
	return (
		typeof serverIpAddress == 'string' &&
		typeof headerForwardedFor == 'string' &&
		serverIpAddress === headerForwardedFor
	)
}

/**
 * Retrieves the IPv4 address of the server.
 *
 * @return {string | undefined} The IPv4 address of the server, or undefined if not found.
 */
function getServerIPAddress(): string | undefined {
	const interfaces = os.networkInterfaces()
	for (const name of Object.keys(interfaces)) {
		const ifaceArray = interfaces[name as keyof typeof interfaces]
		if (!ifaceArray) continue
		for (const iface of ifaceArray) {
			if (iface.family === 'IPv4' && !iface.internal) return iface.address
		}
	}
	return undefined
}

export { devAuthenticateMiddleware }
