import { message } from 'antd'
import { API, COMMONS } from '@/utils'
import { queries } from './index'
import { useQueryClient } from '@tanstack/react-query'

export const useListMemberAttributes = (options?: any) =>
	API.tsRestClient.memberAttributes.listMemberAttributes.useQuery(
		queries.memberAttributes._def,
		{},
		options,
	)

export const useCreateMemberAttribute = () => {
	const queryClient = useQueryClient()
	return API.tsRestClient.memberAttributes.createMemberAttribute.useMutation({
		mutationKey: queries.memberAttributes._def,
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_CREATE_MSG)
			queryClient.invalidateQueries({
				queryKey: queries.memberAttributes._def,
			})
		},
	})
}

export const useUpdateMemberAttributes = (memberAttributeId?: number) => {
	const queryClient = useQueryClient()
	return API.tsRestClient.memberAttributes.updateMemberAttribute.useMutation({
		// mutationKey: queries.memberAttributes.detail(memberAttributeId).queryKey,
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			queryClient.invalidateQueries({
				queryKey: queries.memberAttributes._def,
			})
		},
	})
}

export const useUpdateMemberAttributesOrder = () => {
	const queryClient = useQueryClient()
	return API.tsRestClient.memberAttributes.updateMemberAttributeOrder.useMutation({
		mutationKey: queries.memberAttributes._def,
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_UPDATE_MSG)
			queryClient.invalidateQueries({
				queryKey: queries.memberAttributes._def,
			})
		},
	})
}

export const useDeleteMemberAttribute = (memberAttributeId: number) => {
	const queryClient = useQueryClient()
	return API.tsRestClient.memberAttributes.deleteMemberAttribute.useMutation({
		mutationKey: queries.memberAttributes.detail(memberAttributeId).queryKey,
		onSuccess: () => {
			message.success(COMMONS.SUCCESS_DELETE_MSG)
			queryClient.invalidateQueries({
				queryKey: queries.memberAttributes._def,
			})
		},
	})
}
