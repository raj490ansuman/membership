/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { initClient } from '@ts-rest/core'
import { ZodError } from 'zod'
import { RichMenuTabGroupAPI } from '../../../contracts/richmenuTabGroup.contracts'
import {
	zCommonResponse,
	zCreateRichMenuTabGroupResponse,
	zGetRichMenuTabGroupResponse,
	zGetRichMenuTabGroupsResponse,
	zRichMenuTabGroupPrePublish,
	zUpdateRichmenuTabGroupResponse
} from '../../../schemas'
import { systemConfig } from '../../../backend/config'

const richMenuGroupClient = initClient(RichMenuTabGroupAPI, {
	baseUrl: systemConfig.SITE_URI as string,
	baseHeaders: {}
})

describe('Richmenu Group e2e', () => {
	test('Should get rich menu groups', async () => {
		const response = await richMenuGroupClient.getRichMenuTabGroups({
			query: {
				includeDeleted: true
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zGetRichMenuTabGroupsResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should get rich menu group by id', async () => {
		const response = await richMenuGroupClient.getRichMenuTabGroup({
			params: {
				tabGroupId: 2
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zGetRichMenuTabGroupResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should create rich menu group', async () => {
		const response = await richMenuGroupClient.createRichMenuTabGroup({
			body: {}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zCreateRichMenuTabGroupResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should update rich menu group by id', async () => {
		const response = await richMenuGroupClient.updateRichmenuTabGroup({
			params: {
				tabGroupId: 4
			},
			body: {
				richmenus: [
					{ id: 2, size: { width: 2500, height: 1200 }, areas: [] },
					{ size: { width: 2500, height: 1200 }, areas: [] }
				],
				displayPriority: 'DEFAULT',
				name: 'test1'
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zUpdateRichmenuTabGroupResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should publish rich menu group by id', async () => {
		const response = await richMenuGroupClient.publishRichmenuTabGroup({
			params: {
				tabGroupId: 4
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zCommonResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should pre publish data parse correctly', () => {
		const sampleAreas = [
			{ bounds: { x: 0, y: 0, width: 400, height: 405 }, action: { type: 'message', text: 'メッセージ' } },
			{ bounds: { x: 400, y: 0, width: 400, height: 405 }, action: { type: 'message', text: 'メッセージ' } },
			{ bounds: { x: 800, y: 0, width: 400, height: 405 }, action: { type: 'message', text: 'メッセージ' } },
			{ bounds: { x: 0, y: 405, width: 400, height: 405 }, action: { type: 'message', text: 'メッセージ' } },
			{ bounds: { x: 400, y: 405, width: 400, height: 405 }, action: { type: 'message', text: 'メッセージ' } },
			{ bounds: { x: 800, y: 405, width: 400, height: 405 }, action: { type: 'message', text: 'メッセージ' } }
		]
		const prePublishData = {
			groupId: 1,
			displayPriority: 'DEFAULT',
			status: 'DRAFT',
			createdAt: '2024-03-22T00:58:02.000Z',
			updatedAt: '2024-03-22T00:58:02.000Z',
			deletedAt: null,
			richmenus: [
				{
					size: { width: 1200, height: 810 },
					areas: sampleAreas,
					id: 3,
					groupId: 1,
					richMenuId: null,
					richMenuAliasId: null,
					name: 'test1',
					chatBarText: 'Test1',
					selected: true,
					imageName: 'IHZa3hDIaGU0.jpg',
					templateType: 'RICH_MENU_TEMPLATE_201',
					tabIndex: 0,
					createdAt: '2024-03-22T09:11:08.000Z',
					updatedAt: '2024-03-22T09:22:43.000Z',
					deletedAt: null
				},
				{
					size: { width: 1200, height: 810 },
					areas: sampleAreas,
					id: 4,
					groupId: 1,
					richMenuId: null,
					richMenuAliasId: null,
					name: 'test1',
					chatBarText: 'Test2',
					selected: false,
					imageName: 'ZpMqB7XyKkYm.jpg',
					templateType: 'RICH_MENU_TEMPLATE_201',
					tabIndex: 1,
					createdAt: '2024-03-22T09:11:08.000Z',
					updatedAt: '2024-03-22T09:22:43.000Z',
					deletedAt: null
				}
			]
		}
		expect(zRichMenuTabGroupPrePublish.parse(prePublishData)).not.toBeInstanceOf(ZodError)
	})
	test('Should delete rich menu group by id', async () => {
		const response = await richMenuGroupClient.deleteRichMenuTabGroup({
			params: {
				tabGroupId: 4
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zCommonResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
})
