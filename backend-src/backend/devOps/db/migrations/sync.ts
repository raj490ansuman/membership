import 'dotenv/config'
import { log } from 'console'
import { DataTypes, ModelStatic, Sequelize } from 'sequelize'
import type { MemberAttribute } from '../../../models/memberAttribute.model'

export default async function (sequelize: Sequelize) {
	await sequelize
		.sync({ alter: true })
		.then(async () => {
			const customRegistrations = await (
				sequelize.models.MemberAttribute as ModelStatic<MemberAttribute>
			).findAll()
			if (customRegistrations != null) {
				const transaction = await sequelize.transaction()
				try {
					const queryInterface = sequelize.getQueryInterface()
					const membersTableDetails = await queryInterface.describeTable('members')
					await Promise.all(
						customRegistrations.map((cr) =>
							!membersTableDetails[`memberAttributeId${cr.memberAttributeId}`]
								? queryInterface.addColumn(
										'members',
										`memberAttributeId${cr.memberAttributeId}`,
										{
											type: DataTypes.STRING,
											defaultValue: null,
											allowNull: true
										},
										{ transaction }
								  )
								: Promise.resolve()
						)
					)
					await transaction.commit()
				} catch (error) {
					await transaction.rollback()
					throw error
				}
			}
			log('db sync finished', 'info')
			process.exit(0)
		})
		.catch((e) => {
			throw e
		})
}
