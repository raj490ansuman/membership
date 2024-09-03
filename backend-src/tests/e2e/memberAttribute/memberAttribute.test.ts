/* eslint-disable no-console */
import { initClient } from '@ts-rest/core'
import { ZodError } from 'zod'
import { MEMBER_ATTRIBUTE_ADDRESS_TYPES, systemConfig } from '../../../backend/config'
import { zCommonResponse, zCreateMemberAttributeResponse, zListMemberAttributesRequest } from '../../../schemas'
import { MemberAttributeAPI } from '../../../contracts/memberAttribute.contracts'

const memberAttributeClient = initClient(MemberAttributeAPI, {
	baseUrl: systemConfig.SITE_URI as string,
	baseHeaders: {}
})
// TODO: WIP - work in progress
describe('MemberAttribute e2e', () => {
	test('Should get member attribute list', async () => {
		console.log(systemConfig.SITE_URI)
		const response = await memberAttributeClient.listMemberAttributes()

		expect(response.status).toBe(200)
		expect(zListMemberAttributesRequest.parse(response.body)).not.toBeInstanceOf(ZodError)
	})
	test('Should update member attribute order', async () => {
		const listResponse = await memberAttributeClient.listMemberAttributes()
		expect(listResponse.status).toBe(200)
		if (listResponse.status === 200) {
			const memberAttributes = listResponse.body.data
			expect(memberAttributes.length).toBeGreaterThan(1)
			const reverseOrderAttributes: { showOrder: number; memberAttributeId: number }[] = memberAttributes
				.map((attribute) => ({
					memberAttributeId: attribute.memberAttributeId,
					showOrder: attribute.showOrder + 1
				}))
				.sort((a, b) => a.showOrder - b.showOrder)
				.reverse()

			const updateOrderResponse = await memberAttributeClient.updateMemberAttributeOrder({
				body: {
					memberAttributes: reverseOrderAttributes
				}
			})
			expect(updateOrderResponse.status).toBe(200)
			expect(zCommonResponse.parse(updateOrderResponse.body)).not.toBeInstanceOf(ZodError)
			//revert
			await memberAttributeClient.updateMemberAttributeOrder({
				body: {
					memberAttributes: reverseOrderAttributes.reverse()
				}
			})
		}
	})
	test('Should create & delete member attribute', async () => {
		const createResponse = await memberAttributeClient.createMemberAttribute({
			body: {
				required: true,
				isMemberDisplayed: true,
				isAdminDisplayed: true,
				label: 'test_address',
				type: 'address'
			}
		})
		const listResponse = await memberAttributeClient.listMemberAttributes()
		expect(createResponse.status).toBe(200)
		expect(zCreateMemberAttributeResponse.parse(createResponse.body)).not.toBeInstanceOf(ZodError)
		expect(listResponse.status).toBe(200)
		expect(zListMemberAttributesRequest.parse(listResponse.body)).not.toBeInstanceOf(ZodError)
		if (listResponse.status === 200) {
			const memberAttributes = listResponse.body.data
			// memberAttributes should include a member attribute with label 'test_address'
			const newAddressAttribute = memberAttributes.filter(
				(memberAttribute) => memberAttribute.label === 'test_address'
			)
			expect(newAddressAttribute.length).toBe(4)
			expect(
				newAddressAttribute.every((attribute) =>
					MEMBER_ATTRIBUTE_ADDRESS_TYPES.includes(
						attribute.type as (typeof MEMBER_ATTRIBUTE_ADDRESS_TYPES)[number]
					)
				)
			).toBe(true)

			const deleteResponse = await memberAttributeClient.deleteMemberAttribute({
				params: {
					memberAttributeId: newAddressAttribute[0].memberAttributeId
				}
			})
			expect(deleteResponse.status).toBe(200)
			expect(zCommonResponse.parse(deleteResponse.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should update member attribute', async () => {
		const listResponse = await memberAttributeClient.listMemberAttributes()
		expect(listResponse.status).toBe(200)
		if (listResponse.status === 200) {
			const memberAttributes = listResponse.body.data
			expect(memberAttributes.length).toBeGreaterThan(1)
			const updateResponse = await memberAttributeClient.updateMemberAttribute({
				params: {
					memberAttributeId: memberAttributes[0].memberAttributeId
				},
				body: {
					required: false,
					isMemberDisplayed: false,
					isAdminDisplayed: false,
					label: 'test update address'
				}
			})
			expect(updateResponse.status).toBe(200)
			expect(zCommonResponse.parse(updateResponse.body)).not.toBeInstanceOf(ZodError)
		}
	})
})
