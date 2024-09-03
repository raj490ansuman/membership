import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
	zListAudiencesRequest,
	zListAudiencesResponse,
	zCreateAudienceRequest,
	zCreateAudienceResponse,
	zDeleteAudiencePathParams,
	zDeleteAudienceResponse,
	zSearchAudienceResponse,
	zSearchAudienceRequest
} from '../schemas'

const c = initContract()

export const AudienceAPI = c.router({
	listAudiences: {
		description: 'list audiences',
		method: 'GET',
		path: '/',
		query: zListAudiencesRequest,
		responses: {
			200: zListAudiencesResponse
		}
	},
	searchAudience: {
		description: 'search audience',
		method: 'POST',
		path: '/find',
		body: zSearchAudienceRequest,
		responses: {
			200: zSearchAudienceResponse
		}
	},
	createAudience: {
		description: 'create audience',
		method: 'POST',
		path: '/',
		body: zCreateAudienceRequest,
		responses: {
			201: zCreateAudienceResponse
		},
	},
	deleteAudience: {
		description: 'delete audience',
		method: 'DELETE',
		path: '/:audienceGroupId',
		pathParams: zDeleteAudiencePathParams,
		body: z.object({}),
		responses: {
			200: zDeleteAudienceResponse
		}
	}
},
{
	pathPrefix: '/m/audiences'
}
)
