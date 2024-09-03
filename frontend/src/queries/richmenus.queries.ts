import { API } from '@/utils'
import { queries } from './index'

export const useRichMenuTemplatesQuery = () =>
	API.tsRestClient.richmenus.getRichMenuTemplates.useQuery(queries.richmenus.templates.queryKey)

export const useRichMenuTabGroupsQuery = () =>
	API.tsRestClient.richmenutabgroups.getRichMenuTabGroups.useQuery(queries.richmenus.tabGroups.queryKey)

export const useCreateRichMenuTabGroupMutation = () =>
	API.tsRestClient.richmenutabgroups.createRichMenuTabGroup.useMutation({
		mutationKey: queries.richmenus.tabGroups.queryKey
	})

export const useUpdateRichMenuTabGroupMutation = () =>
	API.tsRestClient.richmenutabgroups.updateRichmenuTabGroup.useMutation({
		mutationKey: queries.richmenus.tabGroups.queryKey
	})

export const useUploadRichMenuImageMutation = () => API.tsRestClient.richmenus.setRichMenuImage.useMutation

export const useDeleteRichMenuTabGroupMutation = () =>
	API.tsRestClient.richmenutabgroups.deleteRichMenuTabGroup.useMutation({
		mutationKey: queries.richmenus.tabGroups.queryKey
	})

export const usePublishRichMenuTabGroupMutation = () =>
	API.tsRestClient.richmenutabgroups.publishRichmenuTabGroup.useMutation({
		mutationKey: queries.richmenus.tabGroups.queryKey
	})

export const useUnpublishRichMenuTabGroupMutation = () =>
	API.tsRestClient.richmenutabgroups.unpublishRichmenuTabGroup.useMutation({
		mutationKey: queries.richmenus.tabGroups.queryKey
	})
