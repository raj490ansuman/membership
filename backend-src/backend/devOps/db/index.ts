import 'dotenv/config'
import { log, warn } from 'console'
import { db } from '../../models'
import dbSync from './migrations/sync'
import dbForceSync from './migrations/force'
import seedManager from './seeds/manager'

const tryMigration = async (migration: CallableFunction, database: any, testCase: string) => {
	try {
		await migration(database)
		log(testCase + ' complete')
	} catch (e) {
		warn(testCase + ' failed ' + (e as Error).message)
	}
}
const main = async () => {
	let initArgument = process.argv.find((arg) => arg.startsWith('init:')) ?? ''
	if (initArgument) initArgument = initArgument.replace('init:', '')
	const initMigrations = initArgument.split(',')
	log('initArgument', initArgument, 'initMigrations', initMigrations)
	const sequelize = db.sequelize
	await sequelize.authenticate()

	for await (const migration of initMigrations) {
		switch (migration) {
			case 'sync':
				await tryMigration(dbSync, sequelize, 'dbSync')
				break
			case 'force':
				await tryMigration(dbForceSync, sequelize, 'dbForceSync')
				break
			case 'manager':
				await tryMigration(seedManager, db, 'init manager')
				break
			default:
				break
		}
	}
}
main()
	// eslint-disable-next-line promise/always-return
	.then(() => {
		log('script finished', 'info')
		process.exit(0)
	})
	.catch((e) => {
		log({ msg: 'script error', err: e })
	})
