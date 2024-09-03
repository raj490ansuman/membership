import { initContract } from '@ts-rest/core'
import {
	zCommonResponse,
	zGetRichMenuTabGroupResponse,
	zGetRichMenuTabGroupsRequest,
	zGetRichMenuTabGroupsResponse,
	zCreateRichMenuTabGroupRequest,
	zUpdateRichmenuTabGroupRequest,
	zUpdateRichmenuTabGroupResponse
} from '../schemas'
import { z } from 'zod'

const c = initContract()

export const RichMenuTabGroupAPI = c.router(
	{
		createRichMenuTabGroup: {
			description: 'Create a new rich menu tab group. It will always be created with status DRAFT',
			method: 'POST',
			path: '/',
			body: zCreateRichMenuTabGroupRequest,
			responses: {
				200: zGetRichMenuTabGroupResponse,
				500: zCommonResponse
			}
		},
		getRichMenuTabGroups: {
			description: 'Get all rich menu tab groups',
			method: 'GET',
			path: '/',
			query: zGetRichMenuTabGroupsRequest,
			responses: {
				200: zGetRichMenuTabGroupsResponse
			}
		},
		getRichMenuTabGroup: {
			description: 'Get a rich menu tab group by id',
			method: 'GET',
			path: '/:tabGroupId',
			pathParams: z.object({
				tabGroupId: z.coerce.number()
			}),
			responses: {
				200: zGetRichMenuTabGroupResponse,
				404: zCommonResponse
			}
		},
		publishRichmenuTabGroup: {
			description: 'Publish a rich menu tab group',
			method: 'PUT',
			path: '/:tabGroupId/publish',
			pathParams: z.object({
				tabGroupId: z.coerce.number()
			}),
			body: z.object({}),
			responses: {
				200: zCommonResponse
			}
		},
		unpublishRichmenuTabGroup: {
			description: 'Unpublish a rich menu tab group',
			method: 'PUT',
			path: '/:tabGroupId/unpublish',
			pathParams: z.object({
				tabGroupId: z.coerce.number()
			}),
			body: z.object({}),
			responses: {
				200: zCommonResponse
			}
		},
		updateRichmenuTabGroup: {
			description: 'Update a rich menu tab group along with rich menus in the tab group',
			method: 'PUT',
			path: '/:tabGroupId',
			pathParams: z.object({
				tabGroupId: z.coerce.number()
			}),
			body: zUpdateRichmenuTabGroupRequest,
			responses: {
				200: zUpdateRichmenuTabGroupResponse
			}
		},
		deleteRichMenuTabGroup: {
			description: 'Delete a rich menu tab group by id',
			method: 'DELETE',
			path: '/:tabGroupId',
			pathParams: z.object({
				tabGroupId: z.coerce.number()
			}),
			body: z.object({}),
			responses: {
				200: zCommonResponse
			}
		}
	},
	{
		pathPrefix: '/m/richmenu-tab-groups'
	}
)
