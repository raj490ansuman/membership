import { Request } from 'express'
import { db } from '../models/index'
import { AxiosUtil, EncUtils } from '../utilities'
import { lineConfig, systemConfig } from '../config'
import { Transaction } from 'sequelize'

export const verifyAccessToken = async (token: string) => {
	try {
		const oauth2 = await AxiosUtil.requestHttp({
			url: `https://api.line.me/oauth2/v2.1/verify?access_token=${token}`,
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		}).then((r) => r.data)
		if (oauth2.error) throw new Error(`oauth axios err ${oauth2.error_description}`)
		if (oauth2.client_id != lineConfig.LINE_LOGIN_CHANNEL_ID)
			throw new Error(`client_id mismatch ${oauth2.client_id} != ${lineConfig.LINE_LOGIN_CHANNEL_ID}`)
		if (oauth2.expires_in <= 0) throw new Error(`expired ${oauth2.expires_in} < 0`)
		return true
	} catch (e) {
		return false
	}
}

export const getProfileByToken = async (token: string): Promise<lineProfile | null> =>
	AxiosUtil.requestHttp({
		url: 'https://api.line.me/v2/profile',
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json'
		}
	})
		.then((r) => r.data as lineProfile)
		.catch(() => null)

export const getManager = async (managerId: number) => db.Manager.findByPk(managerId)
const findManagerByUsername = async (username: number, transaction?: Transaction) =>
	db.Manager.findOne({ where: { username }, transaction })

export const login = async ({ username, password }: { username: number; password: string }) => {
	const manager = await findManagerByUsername(username)

	// No matching username found
	if (manager === null) {
		return null
	}

	const dbHash = manager?.get('pwhash') as string
	const validCredentials = await EncUtils.comparePassword(password, dbHash)

	// Verify passwords
	if (validCredentials) {
		return manager
	}
	return null
}

export const createUserSession = async ({
	username,
	managerId,
	token
}: {
	username: string
	managerId: number
	token: string
}) =>
	db.Session.create({
		username,
		managerId,
		token,
		expires: new Date(Date.now() + 86400000 * 7) // 7 days from now in ms
	})

export const checkUserSession = async ({ username, managerId }: { username: string; managerId: number }) =>
	db.Session.findOne({
		where: {
			username: username,
			managerId: managerId
		}
	})

export const logout = async (token: string) =>
	db.Session.destroy({
		where: {
			token: token
		}
	})

export const getManagerIdFromCookie = (req: Request) => {
	const jwt = req.cookies?.[systemConfig.SESS_NAME as string] ?? ''
	const decoded = EncUtils.decodeJWT(jwt)
	if (decoded === null) {
		return null
	}
	const { managerId } = decoded as { managerId: number; username: string }
	return managerId
}
