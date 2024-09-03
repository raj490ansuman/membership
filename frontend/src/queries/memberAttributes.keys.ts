import { createQueryKeys } from '@lukemorales/query-key-factory'

export const memberAttributes = createQueryKeys('memberAttributes', {
	detail: (memberAttributeId: number) => ({
		queryKey: [memberAttributeId],
	}),
})
