import ReactDOM from 'react-dom/client'
import '@fullcalendar/react/dist/vdom'

import { ConfigProvider, message } from 'antd'
import jaJP from 'antd/locale/ja_JP'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'moment/locale/ja'
import './utils/env'

import App from './App'
import { API } from './utils'

import dayjs from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false
		}
	},
	queryCache: new QueryCache({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: API.clientOnError
	}),
	mutationCache: new MutationCache({
		onError: API.clientOnError
	})
})

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<ConfigProvider
			locale={jaJP}
			theme={{
				token: {
					colorPrimary: '#99CA29',
					borderRadius: 4,
					colorText: 'rgba(0, 0, 0, 0.6)'
				}
			}}
		>
			<HelmetProvider>
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</HelmetProvider>
		</ConfigProvider>
	</QueryClientProvider>
	// </React.StrictMode>
)
