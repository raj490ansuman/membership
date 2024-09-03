import {
	Sequelize,
	Model,
	Association,
	DataTypes,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	ForeignKey
} from 'sequelize'
import type { MemberAttribute } from './memberAttribute.model'
export class AttributeChoice extends Model<
	InferAttributes<AttributeChoice, { omit: 'MemberAttribute' }>,
	InferCreationAttributes<AttributeChoice, { omit: 'MemberAttribute' }>
> {
	//ATTRIBUTES
	declare attributeChoiceId: CreationOptional<number>
	declare memberAttributeId?: ForeignKey<MemberAttribute['memberAttributeId'] | null>

	declare contents: string
	declare showOrder: number

	//ASSOCIATIONS
	declare MemberAttribute?: NonAttribute<MemberAttribute>
	declare static associations: {
		MemberAttribute: Association<MemberAttribute, AttributeChoice>
	}
	static initClass = (sequelize: Sequelize) =>
		AttributeChoice.init(
			{
				attributeChoiceId: {
					type: DataTypes.INTEGER({ unsigned: true }),
					primaryKey: true,
					autoIncrement: true
				},
				contents: { type: DataTypes.STRING, allowNull: false },
				showOrder: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 }
			},
			{
				sequelize: sequelize,
				timestamps: false,
				tableName: 'attributeChoices',
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				name: {
					singular: 'AttributeChoice',
					plural: 'attributeChoices'
				}
			}
		)
}
