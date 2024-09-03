import 'dotenv/config'
import { log } from 'console'
import { db } from '../models'
import { EncUtils } from '../utilities'
async function syncDB() {
	return db.sequelize.authenticate()
}
syncDB()
	.then(async () => {
		if (process.env.MANAGER_ID && process.env.MANAGER_PW && process.env.MANAGER_MAIL) {
			const master = await db.Manager.findOne({ where: { username: process.env.MANAGER_ID } })
			if (master == null) {
				await db.Manager.create({
					username: process.env.MANAGER_ID as string,
					pwhash: await EncUtils.createHash(process.env.MANAGER_PW),
					recoveryMail: process.env.MANAGER_MAIL as string,
					authLevel: 10,
					isActivated: true
				})
			}
			return
		} else {
			throw new Error('manager id | pw | email not set')
		}
		// const memberAttribute = await db.memberAttributes.findOne()
		// if (memberAttribute == null) {
		// 	let transaction: Transaction | null = null
		// 	const queryInterface = db.sequelize.getQueryInterface()
		// 	transaction = await db.sequelize.transaction()
		// 	await db.memberAttributes.bulkCreate(
		// 		[
		// 			{
		// 				memberAttributeId: 1,
		// 				isDelete: false,
		// 				required: true,
		// 				isDisplayed: true,
		// 				label: '氏名（フリガナ）',
		// 				type: 'text',
		// 				showOrder: 1
		// 			},
		// 			{
		// 				memberAttributeId: 2,
		// 				isDelete: false,
		// 				required: true,
		// 				isDisplayed: true,
		// 				label: '電話番号',
		// 				type: 'text',
		// 				showOrder: 2
		// 			}
		// 		],
		// 		{ transaction }
		// 	)
		// 	await Promise.all(
		// 		Array.from({ length: 2 }, (_, i) => i).map((i) =>
		// 			queryInterface.addColumn(
		// 				'members',
		// 				`memberAttributeId${i + 1}`,
		// 				{
		// 					type: DataTypes.STRING,
		// 					defaultValue: null,
		// 					allowNull: true
		// 				},
		// 				{ transaction }
		// 			)
		// 		)
		// 	)
		// }
	})
	.then(() => {
		log('init manager finished', 'info')
		process.exit(0)
		return
	})
	.catch((e) => {
		throw e
	})
