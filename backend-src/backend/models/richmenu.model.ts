import {
	Sequelize,
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	Association,
	BelongsToSetAssociationMixin,
	CreationAttributes
} from 'sequelize'
import type { RichMenuTabGroup } from './richmenuTabGroup.model'
import type { RichMenuTemplateName, RichMenuArea, RichMenuSize } from '../../schemas'

export class Richmenu extends Model<
	InferAttributes<Richmenu, { omit: 'RichMenuTabGroup' }>,
	InferCreationAttributes<Richmenu, { omit: 'RichMenuTabGroup' }>
> {
	declare id: CreationOptional<number>
	declare groupId: RichMenuTabGroup['groupId']
	declare richMenuId: string | null
	declare richMenuAliasId: string | null

	declare name: CreationOptional<string>
	declare chatBarText: CreationOptional<string>
	declare selected: CreationOptional<boolean>
	declare size: RichMenuSize
	declare areas: CreationOptional<RichMenuArea[]>

	declare imageName: string | null
	declare templateType: RichMenuTemplateName | null
	declare tabIndex: number | null
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	declare deletedAt: CreationOptional<Date> | null

	// Since TS cannot determine model association at compile time
	// we have to declare them here purely virtually
	// these will not exist until `Model.init` was called.
	declare setRichMenuTabGroup: BelongsToSetAssociationMixin<RichMenuTabGroup, number>

	//ASSOCIATIONS
	declare RichMenuTabGroup?: NonAttribute<RichMenuTabGroup>

	declare static associations: {
		RichMenuTabGroup: Association<Richmenu, RichMenuTabGroup>
	}
	static initClass = (sequelize: Sequelize) =>
		Richmenu.init(
			{
				id: { type: DataTypes.INTEGER({ unsigned: true }), autoIncrement: true, primaryKey: true },
				groupId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false },
				richMenuId: { type: DataTypes.STRING(64), unique: true, allowNull: true, defaultValue: null },
				richMenuAliasId: { type: DataTypes.STRING(32), unique: true, allowNull: true, defaultValue: null },

				name: { type: DataTypes.STRING(300), allowNull: false },
				size: {
					type: DataTypes.STRING(100),
					allowNull: true,
					defaultValue: null,
					get() {
						const rawValue = this.getDataValue('size')
						if (typeof rawValue === 'string') return JSON.parse(rawValue)
						else if (typeof rawValue === 'object') return rawValue
						else throw new Error('unexpected richmenu size rawValue ' + typeof rawValue)
					},
					set(value: string | RichMenuArea[]) {
						if (typeof value === 'string') {
							this.setDataValue('size', value as unknown as RichMenuSize)
						} else if (typeof value === 'object') {
							this.setDataValue('size', JSON.stringify(value ?? []) as unknown as RichMenuSize)
						}
					}
				},
				chatBarText: { type: DataTypes.STRING(14), allowNull: false, defaultValue: 'メニュー' },
				selected: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				areas: {
					type: DataTypes.JSON(),
					allowNull: false,
					defaultValue: '[]',
					get() {
						const rawValue = this.getDataValue('areas')
						return rawValue ? JSON.parse(rawValue as unknown as string) : []
					},
					set(value: string | RichMenuArea[]) {
						if (typeof value === 'string') {
							this.setDataValue('areas', value as unknown as RichMenuArea[])
						} else if (typeof value === 'object') {
							this.setDataValue('areas', JSON.stringify(value ?? []) as unknown as RichMenuArea[])
						}
					}
				},
				imageName: { type: DataTypes.STRING(150), allowNull: true, defaultValue: null },
				templateType: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
				tabIndex: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: true, defaultValue: 0 },
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
				deletedAt: DataTypes.DATE
			},
			{
				sequelize: sequelize,
				timestamps: true,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
				tableName: 'richmenus',
				name: {
					singular: 'Richmenu',
					plural: 'richmenus'
				}
			}
		)
	public compareAndSetProperties({
		size,
		areas,
		chatBarText,
		name,
		selected,
		tabIndex,
		templateType
	}: CreationAttributes<Richmenu>) {
		if (name !== undefined) this.set({ name: name })
		if (chatBarText !== undefined) this.set({ chatBarText: chatBarText })
		if (tabIndex !== undefined) this.set({ tabIndex: tabIndex })
		if (selected !== undefined) this.set({ selected: selected })
		if (size !== undefined) this.set({ size: size })
		if (areas !== undefined) this.set({ areas: areas })
		if (templateType !== undefined) this.set({ templateType: templateType })
	}
	public addRichMenuTabSwitchAreas(aliases: { richMenuAliasId: string; tabIndex: number }[]) {
		const TAB_HEIGHT = 110
		const TAB_WIDTH = this.size.width / aliases.length
		const newTabs = aliases
			.filter((a) => a.tabIndex !== (this.tabIndex as number))
			.map((a) => ({
				action: {
					type: 'richmenuswitch',
					richMenuAliasId: a.richMenuAliasId,
					data: `aliasId=${a.richMenuAliasId}`
				},
				bounds: {
					height: TAB_HEIGHT,
					width: TAB_WIDTH,
					x: a.tabIndex * TAB_WIDTH,
					y: 0
				}
			})) as RichMenuArea[]
		this.set({ areas: newTabs.concat(this.areas) })
		return this
	}
}
