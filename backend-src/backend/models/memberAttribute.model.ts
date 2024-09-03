import {
	Sequelize,
	Model,
	Association,
	DataTypes,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	Transaction,
	col,
	WhereAttributeHash,
	literal
} from 'sequelize'
import type { AttributeChoice } from './attributeChoice.model'
import { MEMBER_ATTRIBUTE_ADDRESS_TYPES } from '../config'
import { Literal } from 'sequelize/types/utils'
export class MemberAttribute extends Model<
	InferAttributes<MemberAttribute, { omit: 'attributeChoices' }>,
	InferCreationAttributes<MemberAttribute, { omit: 'attributeChoices' }>
> {
	//ATTRIBUTES
	declare memberAttributeId: CreationOptional<number>
	declare required: boolean
	declare isMemberDisplayed: CreationOptional<boolean>
	declare isAdminDisplayed: CreationOptional<boolean>
	declare isDelete?: boolean
	declare label: string
	declare type: memberAttributeType
	declare archType?: memberAttributeArchType | null
	declare section: string | null
	declare showOrder: CreationOptional<number>
	//ASSOCIATIONS
	declare attributeChoices?: NonAttribute<AttributeChoice[]>
	declare static associations: {
		attributeChoices: Association<AttributeChoice, MemberAttribute>
	}
	static initClass = (sequelize: Sequelize) =>
		MemberAttribute.init(
			{
				memberAttributeId: {
					type: DataTypes.INTEGER({ unsigned: true }),
					primaryKey: true,
					autoIncrement: true
				},
				required: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				isMemberDisplayed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
				isAdminDisplayed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
				isDelete: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
				label: { type: DataTypes.STRING, allowNull: false },
				type: { type: DataTypes.STRING, allowNull: false },
				archType: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				section: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				showOrder: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 }
			},
			{
				sequelize: sequelize,
				timestamps: false,
				tableName: 'memberAttributes',
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				name: {
					singular: 'MemberAttribute',
					plural: 'memberAttributes'
				}
			}
		)
	// indicate
	public isAttributeAddressMain(): boolean {
		return this.type === MEMBER_ATTRIBUTE_ADDRESS_TYPES[0] //address_postal
	}
	public isAttributeTypeAddress(): boolean {
		if (this.section && typeof this.type === 'string')
			return MEMBER_ATTRIBUTE_ADDRESS_TYPES.includes(this.type as keyof memberAttributeAddressType)
		return false
	}
	public generateAddressRequired(required: boolean): boolean | Literal {
		if (!this.isAttributeTypeAddress()) throw new Error('Not address type')
		return required == false
			? false
			: literal(`CASE
	WHEN type = '${MEMBER_ATTRIBUTE_ADDRESS_TYPES[0]}' THEN '1'
	WHEN type = '${MEMBER_ATTRIBUTE_ADDRESS_TYPES[1]}' THEN '1'
	WHEN type = '${MEMBER_ATTRIBUTE_ADDRESS_TYPES[2]}' THEN '1'
	ELSE '0'
END`)
	}
	static listMemberAttributes = async (where: WhereAttributeHash<MemberAttribute> = {}, transaction?: Transaction) =>
		this.findAll({
			where,
			include: {
				association: this.associations.attributeChoices
			},
			order: [
				['showOrder', 'asc'],
				[this.associations.attributeChoices, col('showOrder'), 'asc']
			],
			transaction
		})
}
