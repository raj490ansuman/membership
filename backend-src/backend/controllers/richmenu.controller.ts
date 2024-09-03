import { RESPONSE_SUCCESS, SYSTEM_ERROR } from '../config'
import { RichmenuService } from '../services'
import { AppError } from '../utilities'
import { AppRouteOptions } from '@ts-rest/express'
import { ContractAPI } from '../../contracts'

export const getRichMenuTemplates: AppRouteOptions<
	typeof ContractAPI.richmenus.getRichMenuTemplates
>['handler'] = async () => {
	const richMenuTemplates = RichmenuService.getRichMenuTemplates()
	return {
		status: 200,
		body: {
			data: richMenuTemplates,
			message: 'Successfully retrieved rich menu templates',
			success: true
		}
	}
}

export const getRichMenu: AppRouteOptions<typeof ContractAPI.richmenus.getRichMenu>['handler'] = async ({ params }) => {
	const richMenu = await RichmenuService.getRichMenu({ id: params.id })
	if (richMenu === null)
		return {
			status: 404,
			body: {
				message: `Rich menu ${params.id} found`,
				success: true
			}
		}
	return {
		status: 200,
		body: {
			data: richMenu.toJSON(),
			message: 'Successfully retrieved rich menu',
			success: true
		}
	}
}

export const setRichMenuImage: AppRouteOptions<typeof ContractAPI.richmenus.setRichMenuImage>['handler'] = async ({
	params,
	file
}) => {
	const image = file as Express.Multer.File | null
	if (image === undefined) throw new AppError(SYSTEM_ERROR, 'Missing image', false)
	const richMenu = await RichmenuService.updateRichMenuImage({ id: params.id, imageFile: image })
	if (richMenu === null)
		return {
			status: 404,
			body: {
				message: `Rich menu ${params.id} found`,
				success: true
			}
		}

	return {
		status: 200,
		body: {
			data: richMenu.toJSON(),
			message: 'Successfully set rich menu image',
			success: true
		}
	}
}

export const createRichMenuTabGroup: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.createRichMenuTabGroup
>['handler'] = async ({ body }) => {
	try {
		const tabGroup = await RichmenuService.createRichMenuTabGroup({
			name: body.name,
			displayPriority: body.displayPriority
		})
		return {
			status: 200,
			body: {
				data: { ...tabGroup.toJSON(), richmenus: [] },
				message: 'Successfully created rich menu tab group',
				success: true
			}
		}
	} catch (error) {
		return {
			status: 500,
			body: {
				message: 'Something went wrong: ' + (error as Error).message,
				success: false
			}
		}
	}
}

export const getRichMenuTabGroups: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.getRichMenuTabGroups
>['handler'] = async () => {
	try {
		const tabGroups = await RichmenuService.getRichMenuTabGroups()
		return {
			status: 200,
			body: {
				data: tabGroups,
				message: 'Successfully retrieved rich menu tab groups',
				success: true
			}
		}
	} catch (error) {
		return {
			status: 500,
			body: {
				message: 'Something went wrong: ' + (error as Error).message,
				success: false
			}
		}
	}
}
export const getRichMenuTabGroup: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.getRichMenuTabGroup
>['handler'] = async ({ params }) => {
	const { tabGroupId } = params
	const tabGroup = await RichmenuService.getRichMenuTabGroup(Number(tabGroupId))

	if (tabGroup === null)
		return {
			status: 404,
			body: {
				message: 'No rich menu tab group found',
				success: true
			}
		}
	return {
		status: 200,
		body: {
			data: tabGroup,
			message: 'Successfully retrieved rich menu tab group',
			success: true
		}
	}
}
export const publishRichmenuTabGroup: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.publishRichmenuTabGroup
>['handler'] = async ({ params }) => {
	const tabGroupId = params.tabGroupId
	// TODO: rollback on various errors
	const tabGroup = await RichmenuService.publishRichMenuTabGroup(tabGroupId)
	return {
		status: RESPONSE_SUCCESS,
		body: {
			data: tabGroup,
			message: 'Successfully published rich menu tab group',
			success: true
		}
	}
}
export const unpublishRichmenuTabGroup: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.unpublishRichmenuTabGroup
>['handler'] = async ({ params }) => {
	const tabGroupId = params.tabGroupId
	// TODO: rollback on various errors
	const tabGroup = await RichmenuService.unpublishRichMenuTabGroup(tabGroupId)
	return {
		status: RESPONSE_SUCCESS,
		body: {
			data: tabGroup,
			message: 'Successfully unpublished rich menu tab group',
			success: true
		}
	}
}
export const updateRichmenuTabGroup: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.updateRichmenuTabGroup
>['handler'] = async ({ params, body }) => {
	const tabGroupId = params.tabGroupId
	const tabGroup = await RichmenuService.updateRichMenuTabGroup(tabGroupId, body)
	if (tabGroup === null || tabGroup.richmenus === undefined)
		throw new AppError(SYSTEM_ERROR, 'No rich menu tab group found', false)
	return {
		status: RESPONSE_SUCCESS,
		body: {
			data: tabGroup,
			message: 'Successfully updated rich menu tab group',
			success: true
		}
	}
}
export const deleteRichMenuTabGroup: AppRouteOptions<
	typeof ContractAPI.richmenutabgroups.deleteRichMenuTabGroup
>['handler'] = async ({ params }) => {
	if (isNaN(params.tabGroupId)) throw new AppError(SYSTEM_ERROR, 'tabGroupId is invalid')
	await RichmenuService.deleteRichMenuTabGroup(params.tabGroupId)
	return {
		status: RESPONSE_SUCCESS,
		body: {
			message: 'Successfully deleted rich menu tab group',
			success: true
		}
	}
}
