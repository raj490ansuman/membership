import { CreationAttributes, Transaction } from 'sequelize'
import { db } from '../models'
import { SystemSetting } from '../models/systemSetting.model'

export const updateSettingsInBulk = async (
	settings: CreationAttributes<SystemSetting>[],
	transaction?: Transaction
) => {
	return db.SystemSetting.bulkCreate(settings, {
		updateOnDuplicate: ['label', 'valueFlag', 'valueNumber', 'valueString', 'isPublic'],
		transaction
	})
}
