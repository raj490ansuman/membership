import { createQueryKeys } from '@lukemorales/query-key-factory'

// TODO: Create separate for tabgroups

export const richmenus = createQueryKeys('richmenus', {
	templates: null,
	tabGroups: null,
	detail: (richMenuId: number) => ({
		queryKey: [richMenuId]
	})
})
