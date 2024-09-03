import path from 'path'
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize'
import { systemConfig, RICHMENU_TEMPLATES_COMPACT, RICHMENU_TEMPLATES_LARGE, BAD_REQUEST } from '../config'
import { db } from '../models'
import type { Richmenu as RichmenuModel } from '../models/richmenu.model'
import type { RichMenuTabGroup as RichMenuTabGroupModel } from '../models/richmenuTabGroup.model'
import { AppError, FileUtils, EncUtils, writeLog } from '../utilities'
import {
	RichMenuDisplayPriority,
	RichMenuTabGroupPostPublish,
	RichMenuTabGroupPostUnpublish,
	UpdateRichmenuTabGroupRequest,
	zRichMenuTabGroupPrePublish
} from '../../schemas'
import * as LineService from './line.service'
import { HTTPError } from '@line/bot-sdk'

/**
 * Returns an object of template types and their corresponding rich menu templates
 */
export const getRichMenuTemplates = () => {
	return {
		compact: Object.values(RICHMENU_TEMPLATES_COMPACT),
		large: Object.values(RICHMENU_TEMPLATES_LARGE)
	}
}
/**
 * Retrieves a rich menu by criteria
 */
export const getRichMenu = async (
	{ id, tabIndex, selected }: Pick<Partial<RichmenuModel>, 'id' | 'tabIndex' | 'selected'>,
	includeTabGroup = false
) => {
	const whereConditions: WhereOptions<RichmenuModel> = {}
	if (id) whereConditions.id = id
	if (tabIndex) whereConditions.tabIndex = tabIndex
	if (selected) whereConditions.selected = selected
	const inclusions: Includeable | undefined = includeTabGroup
		? {
				model: db.RichMenuTagGroup,
				as: 'richMenuTabGroup'
		  }
		: undefined
	const richMenu = await db.Richmenu.findOne({
		where: whereConditions,
		include: inclusions
	})
	return richMenu
}
/**
 * Update the image of a rich menu.
 *
 * @param {number} richMenuId - The ID of the rich menu db model to update.
 * @param {Express.Multer.File | null} imageFile - The image file to update the rich menu with.
 * @return {Promise<any>} The updated rich menu.
 */
export const updateRichMenuImage = async ({ id, imageFile }: { id: number; imageFile: Express.Multer.File | null }) => {
	const richMenu = await db.Richmenu.findByPk(id, {
		attributes: ['id', 'imageName'],
		include: { association: db.Richmenu.associations.RichMenuTabGroup, attributes: ['status'] }
	})
	let richMenuImageNewName: string | null = null
	if (richMenu == null) throw new Error(`richmenu ${id} not found`)
	else if (richMenu.RichMenuTabGroup && richMenu.RichMenuTabGroup.status === 'PUBLISHED')
		throw new Error(`richmenu ${id} tab group is already published`)
	if (richMenu.imageName)
		await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, richMenu.imageName))
	if (imageFile !== null) {
		richMenuImageNewName = EncUtils.generateToken(12) + path.extname(imageFile.originalname)
		await FileUtils.saveBufferToFile(
			imageFile.buffer,
			path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, richMenuImageNewName),
			richMenuImageNewName
		)
	}
	await richMenu.update({ imageName: richMenuImageNewName })
	return richMenu
}
/**
 * Retrieves all rich menu tab groups with their associated rich menus.
 *
 * @return {Promise<(RichMenuTabGroupModel & { richmenus: RichmenuModel[] })[]>}
 */
export const getRichMenuTabGroups = async () => {
	return db.RichMenuTagGroup.findAll({
		include: [
			{ association: db.RichMenuTagGroup.associations.richmenus, order: [['tabIndex', 'asc']], separate: true }
		],
		order: [['groupId', 'asc']]
	}) as Promise<(RichMenuTabGroupModel & { richmenus: RichmenuModel[] })[]>
}
/**
 * Retrieves a rich menu tab group from the database based on the provided tab group ID.
 *
 * @param {number} tabGroupId - The ID of the tab group to retrieve.
 * @return {Promise<RichMenuTabGroupModel & { richmenus: RichmenuModel[] }>} A promise that resolves to the retrieved rich menu tab group.
 */
export const getRichMenuTabGroup = db.RichMenuTagGroup.findOneWithRichMenus
/**
 * Creates a new rich menu tab group
 */
export const createRichMenuTabGroup = async (args: { name: string; displayPriority: RichMenuDisplayPriority }) =>
	db.RichMenuTagGroup.create(args)

export const publishRichMenuTabGroup = async (tabGroupId: number) => {
	// get tab group from db
	const tabGroup = await getRichMenuTabGroup(tabGroupId)
		.then(validateRichMenusLocally) // validate locally
		.then(setRichMenuAliasIdInDB) // assign alias id locally and save to db
		.then(addRichMenuTabSwitchAreasInDB) // add actions for tab switch and save to db
		.then(checkRichMenuImages) // check if each richmenu has image and image exists in the file system
		.then(validateRichMenusByAPI) // validate by API
		.then(createRichMenuInAPI) // create rich menu in LINE API
		.then(setRichMenuImageInAPI) // set rich menu image in LINE API
		.then(setAliasIdInAPI) // set rich menu alias id in LINE API
		.then(setRichmenuInAPI) // link richmenu to users (default OR per user)
	await tabGroup.update({ status: 'PUBLISHED' })
	return tabGroup as unknown as RichMenuTabGroupPostPublish
}
export const unpublishRichMenuTabGroup = async (tabGroupId: number) => {
	// get tab group from db
	const tabGroup = await getRichMenuTabGroup(tabGroupId)
		// Remove rich menu aliases from db because they'll be regenerated
		.then(unsetRichMenuAliasIdInDB)
		// Unlink richmenus
		.then(unsetRichmenuInAPI)
		// Delete richmenus
		.then(deleteRichMenuInAPI)
	await tabGroup.update({ status: 'DRAFT' })
	return tabGroup as unknown as RichMenuTabGroupPostUnpublish
}
/**
 * Update a rich menu tab group in the database along with its associated rich menus.
 *
 * @param {number} tabGroupId - The ID of the tab group to update.
 * @param {RichMenuTabGroupUpdateBody} args - The updated information for the tab group.
 * @return {Promise<RichMenuTabGroup>} The updated rich menu tab group.
 */
export const updateRichMenuTabGroup = async (tabGroupId: number, args: UpdateRichmenuTabGroupRequest) => {
	const transaction = await db.sequelize.transaction()
	try {
		const richmenuTabGroup = await getRichMenuTabGroup(tabGroupId, { transaction })
		if (richmenuTabGroup == null || richmenuTabGroup.richmenus === undefined)
			throw new AppError(BAD_REQUEST, `tab group ${tabGroupId} does not exist`)
		if (richmenuTabGroup.status === 'PUBLISHED')
			throw new AppError(BAD_REQUEST, `tab group ${tabGroupId} is already published`)
		const richmenuIdsToDelete: number[] = []
		const richmenuImagesToDelete: string[] = []
		const incomingRichmenuIds: number[] = []
		let selectedCount = 0
		args.richmenus.forEach((rm) => {
			if (rm.id) incomingRichmenuIds.push(rm.id)
			if (rm.selected) selectedCount++
		})
		if (richmenuTabGroup.richmenus.length > 0) {
			//	generate ids and
			richmenuTabGroup.richmenus.forEach((rm) => {
				if (incomingRichmenuIds.includes(rm.id)) return
				richmenuIdsToDelete.push(rm.id)
				if (rm.imageName) richmenuImagesToDelete.push(rm.imageName)
			})
		}
		if (selectedCount !== 1)
			throw new AppError(
				BAD_REQUEST,
				`tab group ${tabGroupId} must have one selected rich menu. selected ${selectedCount}`
			)
		if (args.name !== null) richmenuTabGroup.set({ name: args.name })
		if (args.displayPriority !== null) richmenuTabGroup.set({ displayPriority: args.displayPriority })
		if (richmenuTabGroup.changed('name') || richmenuTabGroup.changed('displayPriority'))
			await richmenuTabGroup.save({ transaction })

		let tabIndex = 0
		for await (const richMenu of args.richmenus) {
			if (richMenu.id) {
				// if richmenu has id, update richmenu
				const rmInDb = richmenuTabGroup.richmenus?.find((rm) => rm.id === richMenu.id)
				if (rmInDb === undefined) throw new AppError(BAD_REQUEST, `richmenu ${richMenu.id} does not exist`)
				rmInDb.compareAndSetProperties({
					...richMenu,
					tabIndex,
					name: richMenu.name ?? `${richmenuTabGroup.groupId}-tabIndex-${new Date().toISOString()}`
				})
				await rmInDb.save({ transaction })
			} else {
				// if richmenu has no id, create richmenu
				const newRichMenu = db.Richmenu.build({
					...richMenu,
					groupId: richmenuTabGroup.groupId,
					tabIndex,
					name: richMenu.name ?? `${richmenuTabGroup.groupId}-tabIndex-${new Date().toISOString()}`
				})
				await newRichMenu.save({ transaction })
			}
			tabIndex++
		}
		// delete old richmenus from db
		if (richmenuIdsToDelete.length > 0)
			await db.Richmenu.destroy({ where: { id: richmenuIdsToDelete }, transaction })
		// delete old richmenu images
		if (richmenuImagesToDelete.length > 0)
			await Promise.allSettled(
				richmenuImagesToDelete.map((imageName) =>
					FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, imageName))
				)
			)

		// Explicitly flag updatedAt to update for richmenuTabGroup since richmenu updates update the richmenu models
		richmenuTabGroup.changed('updatedAt', true)
		await richmenuTabGroup.update({ updatedAt: new Date() }, { transaction })
		await richmenuTabGroup.reload({ transaction })
		await transaction.commit()
		return richmenuTabGroup as RichMenuTabGroupModel & { richmenus: RichmenuModel[] }
	} catch (e) {
		await transaction.rollback()
		throw e
	}
}
/**
 * Deletes a rich menu tab group and its associated rich menus and image files.
 *
 * @param {number} tabGroupId - The ID of the tab group to be deleted.
 * @param {Transaction} [transaction] - The transaction to be used for the operation.
 * @return {void}
 */
export const deleteRichMenuTabGroup = async (tabGroupId: number, transaction?: Transaction) => {
	const richMenuTabGroup = await db.RichMenuTagGroup.findOne({
		where: { groupId: tabGroupId },
		include: db.Richmenu
	})
	if (richMenuTabGroup === null) return
	if (richMenuTabGroup.richmenus === undefined) return
	const richMenuImageFileNames: string[] = []
	await Promise.allSettled(
		richMenuTabGroup.richmenus.map(async (r) => {
			if (r.imageName) richMenuImageFileNames.push(r.imageName)
			// Delete the richmenu from the LINE API if they exist
			if (r.richMenuId) await LineService.deleteRichMenu({ richmenuId: r.richMenuId })
			if (r.richMenuAliasId) await LineService.deleteRichMenuAlias(r.richMenuAliasId)
		})
	).then((results) =>
		results.forEach((r, index) => {
			if (r.status === 'fulfilled') return
			writeLog(
				`deleteRichMenuTabGroup failed to delete richmenu from LINE API\n${
					(richMenuTabGroup.richmenus![index] as RichmenuModel).richMenuId
				}\n${(richMenuTabGroup.richmenus![index] as RichmenuModel).richMenuAliasId}: ${r.reason}.`,
				'crit'
			)
			// TODO: Alert engineer, delete via postman, etc
		})
	)

	await db.Richmenu.destroy({ where: { groupId: tabGroupId }, transaction })
	if (richMenuImageFileNames.length > 0)
		await Promise.allSettled(
			richMenuImageFileNames.map((fileName) =>
				FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, fileName))
			)
		)

	await richMenuTabGroup.destroy({ transaction })
}

function validateRichMenusLocally(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	zRichMenuTabGroupPrePublish.parse(tabGroup.toJSON())
	return tabGroup
}

async function setRichMenuAliasIdInDB(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	// there is no need to set alias id if there is only one rich menu
	if (tabGroup.richmenus.length < 2) {
		return tabGroup
	}
	await Promise.all(tabGroup.richmenus.map((rm) => rm.update({ richMenuAliasId: `${rm.groupId}-${rm.id}` })))
	return tabGroup
}
async function unsetRichMenuAliasIdInDB(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	await Promise.all(
		tabGroup.richmenus.map(async (richMenu) => {
			try {
				await LineService.deleteRichMenuAlias(richMenu.richMenuAliasId as string)
			} catch (error) {
				if ((error as HTTPError).originalError.response.data.message !== 'richmenu alias not found') {
					throw error
				}
			}
			await richMenu.update({ richMenuAliasId: null })
		})
	)
	return tabGroup
}

async function addRichMenuTabSwitchAreasInDB(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	// there is no need to set alias id if there is only one rich menu
	if (tabGroup.richmenus.length < 2) {
		return tabGroup
	}

	const aliases: { richMenuAliasId: string; tabIndex: number }[] = tabGroup.richmenus.map((rm) => ({
		richMenuAliasId: rm.richMenuAliasId as string,
		tabIndex: rm.tabIndex as number
	}))
	tabGroup.richmenus.forEach((rm) => rm.addRichMenuTabSwitchAreas(aliases))
	await Promise.all(tabGroup.richmenus.map((rm) => rm.update({ areas: rm.areas })))
	return tabGroup
}
async function checkRichMenuImages(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	await Promise.all(
		tabGroup.richmenus.map((rm) =>
			FileUtils.checkFileExists(path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, rm.imageName as string))
		)
	)
	return tabGroup
}
async function validateRichMenusByAPI(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	await Promise.all(
		tabGroup.richmenus.map((rm) =>
			LineService.validateRichMenu({
				areas: rm.areas,
				chatBarText: rm.chatBarText,
				name: rm.name,
				selected: rm.selected,
				size: rm.size
			})
		)
	)
	return tabGroup
}

async function createRichMenuInAPI(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	await Promise.all(
		tabGroup.richmenus.map(async (rm) => {
			const newRichMenuId = await LineService.createRichMenu({
				areas: rm.areas,
				chatBarText: rm.chatBarText,
				name: rm.name,
				selected: rm.selected,
				size: rm.size
			})
			await rm.update({ richMenuId: newRichMenuId })
		})
	)
	return tabGroup
}
async function deleteRichMenuInAPI(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	await Promise.all(
		tabGroup.richmenus.map(async (rm) => {
			if (rm.richMenuId) {
				await LineService.deleteRichMenu({
					richmenuId: rm.richMenuId
				})
				await rm.update({ richMenuId: null })
			}
		})
	)
	return tabGroup
}
async function setRichMenuImageInAPI(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	await Promise.all(
		tabGroup.richmenus.map(async (rm) => {
			const bufferData = await FileUtils.readBufferFromFile(
				path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, rm.imageName as string)
			)
			await LineService.setRichMenuImage({
				richmenuId: rm.richMenuId as string,
				data: bufferData
			})
		})
	)
	return tabGroup
}
async function setAliasIdInAPI(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	// there is no need to create alias id if there is only one rich menu
	if (tabGroup.richmenus.length < 2) {
		return tabGroup
	}
	await Promise.all(
		tabGroup.richmenus.map(async (rm) =>
			LineService.createRichMenuAlias(rm.richMenuId as string, rm.richMenuAliasId as string)
		)
	)
	return tabGroup
}
async function setRichmenuInAPI(tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) {
	const defaultRichMenuId = tabGroup.richmenus.find((rm) => rm.selected)?.richMenuId
	const canSetDefaultRichMenu = tabGroup.displayPriority === 'DEFAULT' && defaultRichMenuId
	const canSetPerUseRichMenu = tabGroup.displayPriority === 'USER' && defaultRichMenuId
	if (canSetDefaultRichMenu) await LineService.setDefaultRichMenu({ richmenuId: defaultRichMenuId })
	if (canSetPerUseRichMenu) {
		const existingMembers = await db.Member.findAll({
			attributes: ['lineId'],
			where: { lineId: { [Op.not]: null }, curRM: 'memberRM' }
		})
		if (existingMembers.length > 0)
			await LineService.linkRichMenuToMultipleUsers({
				richmenuId: defaultRichMenuId,
				userIds: existingMembers.map((eM) => eM.lineId as string)
			})
	}
	return tabGroup
}
export const unsetRichmenuInAPI = async (tabGroup: RichMenuTabGroupModel & { richmenus: RichmenuModel[] }) => {
	const canUnpublishTabGroup = tabGroup.status === 'PUBLISHED'
	if (!canUnpublishTabGroup) throw new AppError(BAD_REQUEST, `tab group ${tabGroup.groupId} is cannot be unpublished`)

	const defaultRichMenuId = tabGroup.richmenus.find((rm) => rm.selected)?.richMenuId
	const canUnsetDefaultRichMenu = tabGroup.displayPriority === 'DEFAULT' && defaultRichMenuId
	const canUnlinkPerUseRichMenu = tabGroup.displayPriority === 'USER' && defaultRichMenuId
	if (canUnsetDefaultRichMenu) await LineService.deleteDefaultRichMenu()
	if (canUnlinkPerUseRichMenu) {
		const existingMembers = await db.Member.findAll({
			attributes: ['lineId'],
			where: { lineId: { [Op.not]: null }, curRM: 'memberRM' }
		})
		if (existingMembers.length > 0)
			await LineService.unlinkRichMenusFromMultipleUsers({
				userIds: existingMembers.map((eM) => eM.lineId as string)
			})
	}
	return tabGroup
}
