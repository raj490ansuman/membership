import { db } from '../models'
import { writeLog } from '../utilities'

export async function loadDB() {
	await db.sequelize.authenticate().catch((e) => {
		writeLog({ msg: 'could not initialize db', error: e }, 'crit')
		throw e
	})
	return
}
