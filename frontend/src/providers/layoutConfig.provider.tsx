import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import {
	useFaviconQuery,
	useLogoQuery,
	usePublicSettingsQuery,
	useStorePicQuery,
	useSystemSettingsQuery
} from '@/queries'
import { deepCopy, initialPublicSettings, transformPublicSettings } from '@/utils/common'

const LayoutConfigContext = createContext<LayoutConfigCtx>({
	logo: undefined,
	favicon: undefined,
	storePic: undefined,
	publicSettings: undefined
})

export const useLayoutConfigContext = () => {
	const layoutConfig = useContext(LayoutConfigContext)
	if (!layoutConfig) {
		throw new Error('LayoutConfigContext: No value provided')
	}

	return layoutConfig
}

export const LayoutConfigProvider = ({ children }: { children: ReactNode }) => {
	const logoQuery = useLogoQuery()
	const faviconQuery = useFaviconQuery()
	const storePicQuery = useStorePicQuery()
	const publicSettingsQuery = usePublicSettingsQuery()
	// TODO: We need to get system settings for client
	const systemSettingsQuery = useSystemSettingsQuery()

	const layoutConfig = useMemo(() => {
		// Note invalidating publicSettings will still be overwritten with cached system settings
		const latestPublicSettings = {
			...deepCopy(initialPublicSettings),
			...transformPublicSettings(publicSettingsQuery?.data?.body.data), // Used for client
			...transformPublicSettings(systemSettingsQuery?.data?.body.data) // Used for admin
		}
		return {
			logo: logoQuery?.data?.body.data,
			favicon: faviconQuery?.data?.body.data,
			storePic: storePicQuery?.data?.body.data,
			publicSettings: latestPublicSettings
		}
	}, [
		logoQuery?.data?.body.data,
		faviconQuery?.data?.body.data,
		storePicQuery?.data?.body.data,
		publicSettingsQuery?.data?.body.data,
		systemSettingsQuery?.data?.body.data
	])

	return <LayoutConfigContext.Provider value={layoutConfig}>{children}</LayoutConfigContext.Provider>
}
