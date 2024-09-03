import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { API_TIMEOUT, TOO_MANY_REQUESTS } from '../config'

const client = axios.create()

axiosRetry(client, {
	retries: 5,
	retryDelay: (retryCount: number) => retryCount * 1000,
	retryCondition: (err) => err.response?.status == TOO_MANY_REQUESTS
})

const requestHttp = async <T = any, D = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T, D>> =>
	client.request({
		timeout: API_TIMEOUT,
		...config
	})

export default {
	requestHttp
}
