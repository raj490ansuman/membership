import {
	Sequelize,
	Model,
	DataTypes,
	Association,
	NOW,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey
} from 'sequelize'
import type { Member } from './member.model'
import type { MemberVisit } from './memberVisit.model'
export class Point extends Model<
	InferAttributes<Point, { omit: 'Member' | 'Visit' }>,
	InferCreationAttributes<Point, { omit: 'Member' | 'Visit' }>
> {
	//ATTRIBUTES
	declare pointId: CreationOptional<number>
	declare memberId: ForeignKey<Member['memberId']>
	declare visitId: ForeignKey<MemberVisit['memberVisitId'] | null>
	declare point: number
	declare processedAt: CreationOptional<Date>
	declare source: CreationOptional<pointSource>
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	//ASSOCIATIONS
	declare Member?: NonAttribute<Member>
	declare Visit?: NonAttribute<MemberVisit | null>
	declare static associations: {
		Member: Association<Member, Point>
		Visit: Association<MemberVisit, Point>
	}
	static initClass = (sequelize: Sequelize) =>
		Point.init(
			{
				pointId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
				memberId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false },
				visitId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: true },
				point: { type: DataTypes.INTEGER, allowNull: false },
				processedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: NOW() },
				source: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE
			},
			{
				sequelize: sequelize,
				timestamps: false,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				tableName: 'points',
				modelName: 'Point',
				name: {
					singular: 'Point',
					plural: 'points'
				}
			}
		)
}
