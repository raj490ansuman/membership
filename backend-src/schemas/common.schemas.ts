import { z } from 'zod'

export const zCommonResponse = z.object({
	success: z.boolean(),
	message: z.string()
})

export const zSortBuilder = (keys: string[]) =>
	z.object({
		sortKey: z.string().refine((arg) => keys.includes(arg)),
		sort: z.enum(['asc', 'desc'] as const)
	})

export const zPaginationBuilder = (page = 1, limit = 10) =>
	z.object({
		page: z.number().min(1).default(page),
		limit: z.number().default(limit)
	})
