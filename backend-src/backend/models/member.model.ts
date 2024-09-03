import {
	Sequelize,
	Model,
	DataTypes,
	Association,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	HasManyCreateAssociationMixin
} from 'sequelize'
import type { Chat } from './chat.model'
import type { Reminder } from './reminder.model'
import type { Json } from 'sequelize/types/utils'
import type { Point } from './point.model'
import type { MemberVisit } from './memberVisit.model'
import type { MemberAttribute } from './memberAttribute.model'
export class Member extends Model<
	InferAttributes<Member, { omit: 'chats' | 'reminders' }>,
	InferCreationAttributes<Member, { omit: 'chats' | 'reminders' }>
> {
	//ATTRIBUTES
	declare memberId: CreationOptional<number>
	declare memberCode: string | null
	declare lineId: string | null
	declare displayName: string | null
	declare picUrl: string | null
	declare activeUntil: Date | null
	declare memberSince: Date | null
	declare curRM: richmenuType | null
	declare isCampaign: CreationOptional<boolean>
	declare candidateAt: Date | null
	declare isRegistered: CreationOptional<boolean>
	declare isFriends: CreationOptional<boolean>
	declare remarks: string | null
	declare unreadCount: CreationOptional<number>
	declare kakeruPoint: number | null

	declare memberInfo?: Json
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	//ASSOCIATIONS
	declare chats?: NonAttribute<Chat[]>
	declare reminders?: NonAttribute<Reminder[]>
	declare visits?: NonAttribute<MemberVisit[]>
	declare points?: NonAttribute<Point[]>
	declare memberAttributes?: NonAttribute<MemberAttribute[]>

	declare static associations: {
		chats: Association<Member, Chat>
		reminders: Association<Member, Reminder>
		visits: Association<Member, MemberVisit>
		points: Association<Member, Point>
		memberAttributes: Association<Member, MemberAttribute>
	}

	declare createVisit: HasManyCreateAssociationMixin<MemberVisit>
	declare createPoint: HasManyCreateAssociationMixin<Point>

	public addOrDeductPoint(newRelativePoint: number, pointIsAdd: boolean) {
		const addOrReduceMultiplier = pointIsAdd ? 1 : -1
		const previousPoint = this.kakeruPoint ?? 0
		return previousPoint + newRelativePoint * addOrReduceMultiplier
	}

	static initClass = (sequelize: Sequelize) =>
		Member.init(
			{
				memberId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
				memberCode: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				lineId: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				displayName: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				picUrl: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
				activeUntil: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: null },
				memberSince: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: null },
				curRM: { type: DataTypes.STRING(64), allowNull: true, defaultValue: null },
				isCampaign: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				candidateAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
				isRegistered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				isFriends: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				remarks: { type: DataTypes.STRING, allowNull: true },
				unreadCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
				kakeruPoint: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

				memberInfo: { type: DataTypes.JSON, allowNull: true, defaultValue: null },

				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE
			},
			{
				sequelize: sequelize,
				paranoid: false,
				tableName: 'members',
				modelName: 'Member',
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				name: {
					singular: 'Member',
					plural: 'members'
				}
			}
		)

	public getValueByMemberAttributeId = (
		memberAttributeId: number
	): memberAttributeTypeSymType[memberAttributeType] => {
		return this.getDataValue(`memberAttributeId${memberAttributeId}` as any)
		// return this[`memberAttributeId${memberAttributeId}` as keyof typeof Member]
	}
}
