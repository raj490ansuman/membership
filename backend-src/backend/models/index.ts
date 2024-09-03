import { AUTH_LEVELS, dbConfig } from '../config'
import { Sequelize } from 'sequelize'
import { Audience } from './audience.model'
import { Member } from './member.model'
import { Manager } from './manager.model'
import { Richmenu } from './richmenu.model'
import { RichMenuTabGroup } from './richmenuTabGroup.model'
import { SystemSetting } from './systemSetting.model'
import { Chat } from './chat.model'
import { Template } from './template.model'
import { Reminder } from './reminder.model'
import { Spectator } from './spectator.model'
import { Session } from './session.model'
import { MemberAttribute } from './memberAttribute.model'
import { AttributeChoice } from './attributeChoice.model'
import { Point } from './point.model'
import { MemberVisit } from './memberVisit.model'

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | undefined,
	port: dbConfig.PORT,
	pool: {
		max: dbConfig.POOL.max,
		min: dbConfig.POOL.min,
		acquire: dbConfig.POOL.acquire,
		idle: dbConfig.POOL.idle
	},
	timezone: '+09:00',
	logging: dbConfig.LOGGING
})

Audience.initClass(sequelize)
Manager.initClass(sequelize, { defaultAuthLevel: AUTH_LEVELS.manager })
Member.initClass(sequelize)
Chat.initClass(sequelize)
Reminder.initClass(sequelize)
Richmenu.initClass(sequelize)
Session.initClass(sequelize)
SystemSetting.initClass(sequelize)
Template.initClass(sequelize)
Spectator.initClass(sequelize)
MemberAttribute.initClass(sequelize)
AttributeChoice.initClass(sequelize)
RichMenuTabGroup.initClass(sequelize)
Point.initClass(sequelize)
MemberVisit.initClass(sequelize)

MemberAttribute.hasMany(AttributeChoice, { foreignKey: 'memberAttributeId' })
AttributeChoice.belongsTo(MemberAttribute, { foreignKey: 'memberAttributeId' })

Reminder.belongsTo(Member, {
	foreignKey: 'memberId',
	onDelete: 'SET NULL',
	constraints: false,
	foreignKeyConstraint: false
})
Chat.belongsTo(Member, { foreignKey: 'memberId', onDelete: 'CASCADE' })
Spectator.belongsTo(Member, { foreignKey: 'memberId', onDelete: 'CASCADE' })
Member.hasMany(Chat, { foreignKey: 'memberId' })
Member.hasMany(Reminder, { foreignKey: 'memberId' })
Member.hasOne(Spectator, { foreignKey: 'memberId' })

Richmenu.belongsTo(RichMenuTabGroup, { foreignKey: 'groupId' })
RichMenuTabGroup.hasMany(Richmenu, { foreignKey: 'groupId' })

Session.belongsTo(Manager, { foreignKey: 'managerId', onDelete: 'CASCADE' })

MemberVisit.belongsTo(Member, { foreignKey: 'memberId', onDelete: 'CASCADE' })
Member.hasMany(MemberVisit, { as: 'visits', foreignKey: 'memberId' })
Point.belongsTo(Member, { foreignKey: 'memberId', onDelete: 'CASCADE' })
Member.hasMany(Point, { as: 'points', foreignKey: 'memberId' })
Point.belongsTo(MemberVisit, { as: 'Visit', foreignKey: 'visitId', onDelete: 'CASCADE' })
MemberVisit.hasOne(Point, { as: 'Point', foreignKey: 'visitId' })

const db = Object.freeze({
	sequelize: sequelize,
	Audience: Audience,
	Chat: Chat,
	Manager: Manager,
	Member: Member,
	Point: Point,
	Reminder: Reminder,
	Richmenu: Richmenu,
	RichMenuTagGroup: RichMenuTabGroup,
	Session: Session,
	Spectator: Spectator,
	SystemSetting: SystemSetting,
	Template: Template,
	MemberAttribute: MemberAttribute,
	AttributeChoice: AttributeChoice,
	MemberVisit: MemberVisit
})

export { db }
