import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
	zCreateMemberAttributeRequest,
	zCreateMemberAttributeResponse,
	zDeleteMemberAttributePathParams,
	zDeleteMemberAttributeResponse,
	zListMemberAttributesRequest,
	zListMemberAttributesResponse,
	zUpdateMemberAttributeOrderRequest,
	zUpdateMemberAttributeOrderResponse,
	zUpdateMemberAttributePathParams,
	zUpdateMemberAttributeRequestBody,
	zUpdateMemberAttributeResponse
} from '../schemas'

const c = initContract()

export const MemberAttributeAPI = c.router(
	{
		createMemberAttribute: {
			description: 'Create a new member attribute',
			method: 'POST',
			path: '/',
			body: zCreateMemberAttributeRequest,
			responses: {
				200: zCreateMemberAttributeResponse
			}
		},
		listMemberAttributes: {
			description: 'Get a list of member attributes',
			method: 'GET',
			path: '/',
			query: zListMemberAttributesRequest,
			responses: {
				200: zListMemberAttributesResponse
			}
		},
		updateMemberAttributeOrder: {
			description: 'Update member attribute order',
			method: 'PUT',
			path: '/order',
			body: zUpdateMemberAttributeOrderRequest,
			responses: {
				200: zUpdateMemberAttributeOrderResponse
			}
		},
		updateMemberAttribute: {
			description: 'Update member attribute',
			method: 'PUT',
			path: '/:memberAttributeId',
			pathParams: zUpdateMemberAttributePathParams,
			body: zUpdateMemberAttributeRequestBody,
			responses: {
				200: zUpdateMemberAttributeResponse
			}
		},
		deleteMemberAttribute: {
			description: 'Delete member attribute',
			method: 'DELETE',
			path: '/:memberAttributeId',
			pathParams: zDeleteMemberAttributePathParams,
			body: z.object({}),
			responses: {
				200: zDeleteMemberAttributeResponse
			}
		}
	},
	{
		pathPrefix: '/m/member-attributes'
	}
)
