/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_API_URL: string
	readonly VITE_APP_CATEGORY_VERSION: string
	readonly VITE_APP_ENV: string
	readonly VITE_APP_LINE_ADD_FRIEND_URL: string
	readonly VITE_APP_LINE_QR_URL: string
	readonly VITE_APP_SYSTEM_TITLE: string
	readonly VITE_APP_TEST_USER_PASSWORD: string
	readonly VITE_APP_TEST_USER: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
