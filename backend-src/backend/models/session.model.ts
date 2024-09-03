import { Sequelize, Model, DataTypes, Optional, UUIDV4, ForeignKey } from 'sequelize'
import type { Manager } from './manager.model'
interface sessionStructure {
	sid: string
	expires: Date
	token: string
	username: string
	managerId: ForeignKey<Manager['managerId']>
}
interface sessionCreationAttributes extends Optional<sessionStructure, 'sid'> {}
export class Session extends Model<sessionCreationAttributes> implements sessionStructure {
	public sid!: string
	public expires!: Date
	public token!: string
	public username!: string
	declare managerId: ForeignKey<Manager['managerId']>

	static initClass(sequelize: Sequelize) {
		return Session.init(
			{
				sid: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
				expires: { type: DataTypes.DATE, allowNull: false },
				token: { type: DataTypes.STRING(400), allowNull: false },
				username: { type: DataTypes.STRING(), allowNull: false }
			},
			{
				sequelize: sequelize,
				tableName: 'sessions',
				modelName: 'Session',
				timestamps: true,
				paranoid: false,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				name: {
					singular: 'Session',
					plural: 'sessions'
				}
			}
		)
	}
}
