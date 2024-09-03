import 'dotenv/config'
import http from 'http'
import express from 'express'
import { systemConfig } from './backend/config'
import { SocketUtil } from './backend/utilities'
import { initExpressApp } from './app'
import { loadDB } from './backend/loaders/database.loader'

async function main() {
	try {
		const app = express()

		const server = http.createServer(app)
		SocketUtil.attachSocketServer(server)
		await loadDB()
		initExpressApp(app)
		// await initializeScheduledTask()
		//load app
		server.listen(systemConfig.PORT)
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}

main()
