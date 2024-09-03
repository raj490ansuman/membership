import 'dotenv/config'
import { EncUtils } from '../../../utilities'
import { ModelStatic } from 'sequelize'
import { AUTH_LEVELS } from '../../../config'
import type { Manager } from '../../../models/manager.model'

export default async function (models: { Manager: ModelStatic<Manager> }) {
	if (!process.env.INIT_MANAGER_USERNAME || !process.env.INIT_MANAGER_PW) {
		throw new Error('invalid manager data')
	}

	const managerData = {
		username: process.env.INIT_MANAGER_USERNAME as string,
		password: process.env.INIT_MANAGER_PW ?? '',
		recoveryMail: process.env.INIT_MANAGER_EMAIL as string,
		authLevel: AUTH_LEVELS.master,
		isActivated: true,
		pwhash: ''
	}

	managerData.pwhash = await EncUtils.createHash(managerData.password)

	return await models.Manager.create(managerData, {
		fields: ['username', 'pwhash', 'recoveryMail', 'authLevel'],
		updateOnDuplicate: ['username', 'pwhash', 'recoveryMail', 'authLevel']
	})
}
