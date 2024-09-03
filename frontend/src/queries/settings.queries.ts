import { API } from '@/utils'
import { queries } from './index'

export const useLogoQuery = () => API.tsRestClient.root.getLogo.useQuery(queries.settings.logo.queryKey)

export const useFaviconQuery = () => API.tsRestClient.root.getFavicon.useQuery(queries.settings.favicon.queryKey)

export const useStorePicQuery = () => API.tsRestClient.root.getStorePic.useQuery(queries.settings.storePic.queryKey)

export const usePublicSettingsQuery = () =>
	API.tsRestClient.root.getPublicSettings.useQuery(queries.settings.publicSettings.queryKey)

export const useSetLogoMutation = () =>
	API.tsRestClient.root.setLogo.useMutation({
		mutationKey: queries.settings.logo.queryKey
	})

export const useSetFaviconMutation = () =>
	API.tsRestClient.root.setFavicon.useMutation({
		mutationKey: queries.settings.favicon.queryKey
	})

export const useSetPublicSettingsMutation = () =>
	API.tsRestClient.settings.setSystemSettings.useMutation({
		mutationKey: queries.settings.publicSettings.queryKey
	})

export const useSystemSettingsQuery = () =>
	API.tsRestClient.settings.getSystemSettings.useQuery(queries.settings.settings.queryKey)
