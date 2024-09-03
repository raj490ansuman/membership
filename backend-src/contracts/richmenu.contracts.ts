import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { zGetRichMenuResponse, zGetRichMenuTemplatesResponse, zUpdateRichMenuImageResponse } from '../schemas'

const c = initContract()

export const RichMenuAPI = c.router(
	{
		getRichMenuTemplates: {
			description: 'Get a list of rich menus templates',
			method: 'GET',
			path: '/templates',
			responses: {
				200: zGetRichMenuTemplatesResponse
			}
		},
		getRichMenu: {
			description: 'Get a rich menus by id',
			method: 'GET',
			path: '/:id',
			pathParams: z.object({
				id: z.coerce.number()
			}),
			responses: {
				200: zGetRichMenuResponse
			}
		},
		setRichMenuImage: {
			description: 'Set rich menu image by id using multer',
			method: 'PUT',
			path: '/:id/image',
			pathParams: z.object({
				id: z.coerce.number()
			}),
			contentType: 'multipart/form-data',
			body: c.type<{ richmenuImage: File }>(), // <- Use File type in here
			responses: {
				200: zUpdateRichMenuImageResponse
			}
		}
	},
	{
		pathPrefix: '/m/richmenus'
	}
)
