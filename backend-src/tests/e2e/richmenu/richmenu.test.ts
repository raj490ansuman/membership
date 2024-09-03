/* eslint-disable no-console */
import { initClient } from '@ts-rest/core'
import fs from 'fs'
import path from 'path'
import { ZodError } from 'zod'
import { zCommonResponse, zGetRichMenuResponse, zGetRichMenuTemplatesResponse } from '../../../schemas'
import { RichMenuAPI } from '../../../contracts/richmenu.contracts'

const richMenuClient = initClient(RichMenuAPI, {
	baseUrl: ('http://' + process.env.SITE_URI + '/api') as string,
	baseHeaders: {}
})
let authToken = ''
describe('Richmenu e2e', () => {
	beforeAll(async () => {
		const loginResponse = await fetch('http://' + process.env.SITE_URI + '/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: authToken
			},
			body: JSON.stringify({
				username: process.env.INIT_MANAGER_USERNAME,
				password: process.env.INIT_MANAGER_PW
			})
		})
		if (loginResponse.status !== 200) throw new Error('Login failed')
		if (!loginResponse.headers.get('set-cookie')) throw new Error('Login failed')
		authToken = loginResponse.headers.get('set-cookie') as string
	})
	afterAll(async () => {
		if (!authToken) return
		const logoutResponse = await fetch('http://' + process.env.SITE_URI + '/api/logout', {
			method: 'GET',
			headers: {
				Cookie: authToken
			}
		})
		if (logoutResponse.status !== 200) throw new Error('Logout failed')
		authToken = ''
	})
	test('Should get rich menu by id', async () => {
		const response = await richMenuClient.getRichMenu({
			extraHeaders: {
				Cookie: authToken
			},
			params: {
				id: 1
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zGetRichMenuResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should get rich menu templates', async () => {
		const response = await richMenuClient.getRichMenuTemplates({
			extraHeaders: {
				Cookie: authToken
			}
		})

		if (response.status !== 200) console.log(response)

		expect(response.status).toBe(200)
		if (response.status === 200) {
			expect(zGetRichMenuTemplatesResponse.parse(response.body)).not.toBeInstanceOf(ZodError)
		}
	})
	test('Should set rich menu image', async () => {
		const fileName = 'richmenu_sample_large.jpg'
		const mockFile = fs.readFileSync(path.join(__dirname, fileName))
		if (!mockFile) throw new Error('Mock file is null')
		const blob = new Blob([mockFile], { type: 'image/jpg' })
		const formData = new FormData()
		formData.append('richmenuImage', blob, fileName)
		const response = await fetch(
			'http://' + process.env.SITE_URI + '/api' + RichMenuAPI.setRichMenuImage.path.replace(':id', '1'),
			{
				method: 'PUT',
				headers: {
					contentType: 'image/jpg',
					Cookie: authToken
				},
				body: formData
			}
		)

		if (response.status !== 200) console.log(response)
		const responseJSON = await response.json()
		expect(zCommonResponse.parse(responseJSON)).not.toBeInstanceOf(ZodError)
	})
	test('Should set rich menu image with japanese file name', async () => {
		const fileName = '会員証＿❓.jpg'
		const mockFile = fs.readFileSync(path.join(__dirname, fileName))
		if (!mockFile) throw new Error('Mock file is null')
		const blob = new Blob([mockFile], { type: 'image/jpg' })
		const formData = new FormData()
		formData.append('richmenuImage', blob, fileName)
		const response = await fetch(
			'http://' + process.env.SITE_URI + '/api' + RichMenuAPI.setRichMenuImage.path.replace(':id', '1'),
			{
				method: 'PUT',
				headers: {
					contentType: 'image/jpg',
					Cookie: authToken
				},
				body: formData
			}
		)

		if (response.status !== 200) console.log(response)
	})
	test('Should not set rich menu image', async () => {
		const fileName = 'richmenu_sample_wrong_aspect.png'
		const mockFile = fs.readFileSync(path.join(__dirname, fileName))
		if (!mockFile) throw new Error('Mock file is null')
		const blob = new Blob([mockFile], { type: 'image/png' })
		const formData = new FormData()
		formData.append('richmenuImage', blob, fileName)
		const response = await fetch(
			'http://' + process.env.SITE_URI + '/api' + RichMenuAPI.setRichMenuImage.path.replace(':id', '1'),
			{
				method: 'PUT',
				headers: {
					contentType: 'image/jpg',
					Cookie: authToken
				},
				body: formData
			}
		)
		expect(response.status).toBe(500)
	})
})
