import {
	Sequelize,
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	Association,
	HasManyGetAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	Transaction
} from 'sequelize'
import type { Richmenu } from './richmenu.model'
import type { RichMenuDisplayPriority, RichMenuTabGroupStatus } from '../../schemas'
import { RICHMENU_GROUP_STATUS } from '../config'

export class RichMenuTabGroup extends Model<
	InferAttributes<RichMenuTabGroup, { omit: 'richmenus' }>,
	InferCreationAttributes<RichMenuTabGroup, { omit: 'richmenus' }>
> {
	declare groupId: CreationOptional<number>
	declare displayPriority: CreationOptional<RichMenuDisplayPriority>
	declare status: CreationOptional<RichMenuTabGroupStatus>
	declare name: CreationOptional<string>

	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	declare deletedAt: CreationOptional<Date> | null

	// Since TS cannot determine model association at compile time
	// we have to declare them here purely virtually
	// these will not exist until `Model.init` was called.
	declare getRichmenus: HasManyGetAssociationsMixin<Richmenu> // Note the null assertions!
	declare addRichmenu: HasManyAddAssociationMixin<Richmenu, string>
	declare addRichmenus: HasManyAddAssociationsMixin<Richmenu, string>
	declare setRichmenus: HasManySetAssociationsMixin<Richmenu, string>
	declare removeRichmenu: HasManyRemoveAssociationMixin<Richmenu, string>
	declare removeRichmenus: HasManyRemoveAssociationsMixin<Richmenu, string>
	declare hasRichmenu: HasManyHasAssociationMixin<Richmenu, string>
	declare hasRichmenus: HasManyHasAssociationsMixin<Richmenu, string>
	declare countRichmenus: HasManyCountAssociationsMixin
	declare createRichmenu: HasManyCreateAssociationMixin<Richmenu, 'richMenuId'>

	//ASSOCIATIONS
	declare richmenus?: NonAttribute<Richmenu[]>

	declare static associations: {
		richmenus: Association<RichMenuTabGroup, Richmenu>
	}

	static initClass = (sequelize: Sequelize) =>
		RichMenuTabGroup.init(
			{
				groupId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
				displayPriority: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'DEFAULT' },
				status: { type: DataTypes.ENUM(...RICHMENU_GROUP_STATUS), allowNull: false, defaultValue: 'DRAFT' },
				name: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
				deletedAt: DataTypes.DATE
			},
			{
				sequelize: sequelize,
				timestamps: true,
				paranoid: false,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				tableName: 'richMenuTabGroups',
				name: {
					singular: 'RichMenuTabGroup',
					plural: 'richMenuTabGroups'
				}
			}
		)
	static findOneWithRichMenus = async (groupId: number, options: { transaction?: Transaction } = {}) => {
		const instance = await this.findByPk(groupId, {
			include: [{ association: this.associations.richmenus, order: ['tabIndex', 'asc'] }],
			...options
		})
		if (instance === null) throw new Error(`tabGroupId ${groupId} does not exist`)
		return instance as RichMenuTabGroup & { richmenus: Richmenu[] }
	}
	public reloadWithRichMenus = async () => {
		await this.reload({
			include: [{ association: 'richmenus', order: ['tabIndex', 'asc'] }]
		})
		if (this.richmenus === undefined) throw new Error(`tabGroupId ${this.groupId} does not exist`)
		return this as RichMenuTabGroup & { richmenus: Richmenu[] }
	}
}
