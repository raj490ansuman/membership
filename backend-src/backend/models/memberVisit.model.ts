import {
	Sequelize,
	Model,
	DataTypes,
	Association,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	ForeignKey
} from 'sequelize'
import type { Member } from './member.model'
import type { Point } from './point.model'
export class MemberVisit extends Model<
	InferAttributes<MemberVisit, { omit: 'Member' | 'Point' }>,
	InferCreationAttributes<MemberVisit, { omit: 'Member' | 'Point' }>
> {
	//ATTRIBUTES
	declare memberVisitId: CreationOptional<number>
	declare memberId: ForeignKey<Member['memberId']>
	declare visitDate: Date
	//ASSOCIATIONS
	declare Member?: NonAttribute<Member>
	declare Point?: NonAttribute<Point>
	declare static associations: {
		Member: Association<MemberVisit, Member>
		Point: Association<MemberVisit, Point>
	}
	static initClass = (sequelize: Sequelize) =>
		MemberVisit.init(
			{
				memberVisitId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
				memberId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false },
				visitDate: { type: DataTypes.DATE, allowNull: false }
			},
			{
				sequelize: sequelize,
				paranoid: true,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				tableName: 'memberVisits',
				modelName: 'MemberVisit',
				name: {
					singular: 'MemberVisit',
					plural: 'memberVisits'
				}
			}
		)
}
