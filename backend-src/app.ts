import path from 'path'
import cors from 'cors'
import express, { type Application } from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import sessionSequelize from 'connect-session-sequelize'
import { LINE_SIGNATURE_HTTP_HEADER_NAME } from '@line/bot-sdk'
import { createExpressEndpoints } from '@ts-rest/express'

import { systemConfig } from './backend/config'
import { router as tsRestRouter } from './backend/routes/ts-rest.router'
import { router as apiRoute } from './backend/routes'
import { ContractAPI } from './contracts'

const SequelizeStore = sessionSequelize(session.Store)
import {
	checkSession,
	handleGlobalError,
	multerFileEncodingFixer,
	richmenuUpload,
	validateRichmenuImageUpload
} from './backend/middlewares'
import { db } from './backend/models'
declare module 'express-session' {
	export interface SessionData {
		user: managerSessionDataType
	}
}
//cors
const corsOrigins = systemConfig.ENV_TEST
	? systemConfig.NGROK_URI
		? ['http://localhost:3000', systemConfig.NGROK_URI]
		: ['http://localhost:3000']
	: [systemConfig.SITE_URI, 'https://status-check.testweb-demo.com']
const corsOptions = {
	allowedHeaders: [
		'Origin',
		'X-Requested-With',
		'Content-Type',
		'Accept',
		'X-Access-Token',
		'Authorization',
		'access-token',
		'Kakeru-Token',
		LINE_SIGNATURE_HTTP_HEADER_NAME
	],
	credentials: true,
	methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
	origin: corsOrigins,
	preflightContinue: false
}

/**
 * Paths that do not require a session
 */
const sessionExcludedPaths = ['/api/favicon', '/api/logo', '/api/store/pic', '/api/publicSettings']

/**
 * Returns whether or not a path is excluded from requiring a session
 */
const isSessionedPath = (pathname: string) => !sessionExcludedPaths.some((path) => pathname.startsWith(path))

/**
 * Middleware wrapper for checking if a path is excluded from requiring a session
 */
const checkSessionedPath =
	(fn: CallableFunction) => (request: express.Request, response: express.Response, next: express.NextFunction) =>
		isSessionedPath(request.path) ? fn(request, response, next) : next()

export function initExpressApp(app: Application) {
	app.disable('x-powered-by')
	app.use(cors(corsOptions))
	app.use(/\/api\/((?!line).)*/, helmet(), express.json(), express.urlencoded({ extended: true }))
	app.use(cookieParser())

	app.use(
		checkSessionedPath(
			session({
				secret: systemConfig.SESS_SEC,
				store: new SequelizeStore({
					db: db.sequelize,
					table: db.Session.name,
					tableName: db.Session.tableName,
					checkExpirationInterval: 60 * 60 * 1000
				}),
				name: systemConfig.SESS_NAME,
				resave: false,
				saveUninitialized: false,
				cookie: {
					sameSite: 'strict',
					maxAge: 86400000 * 7, // 7 days in ms
					httpOnly: true
				}
			})
		)
	)
	// use build folder of react to use as client
	app.use(express.static(path.join(process.cwd(), 'frontend', 'build')))
	// router
	app.use('/api', apiRoute)

	app.use('/storage', checkSession, express.static(path.join(process.cwd(), 'storage')))

	app.put(
		ContractAPI.richmenus.setRichMenuImage.path,
		richmenuUpload.single('richmenuImage'),
		multerFileEncodingFixer('richmenuImage', true),
		validateRichmenuImageUpload
	)

	createExpressEndpoints(ContractAPI, tsRestRouter, app, {
		globalMiddleware: [checkSessionedPath(checkSession)]
	})

	app.use(express.static(path.join(process.cwd(), 'public')))
	app.get('/*', (req, res) => {
		res.sendFile(path.join(process.cwd(), 'frontend', 'build', 'index.html'), function (err) {
			if (err) {
				res.status(500).send(err)
			}
		})
	})
	app.use(handleGlobalError)
}
