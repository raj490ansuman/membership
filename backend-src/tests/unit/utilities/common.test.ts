import CommonUtil from '../../../backend/utilities/common.util'

describe('Utilities Common module', () => {
	test.concurrent('divide string', async () => {
		const testString =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjU2MjM5MDIyfQ.rfXS6g6hRA7yWyo4MA8bWi7xNbANTVHhAFU3PPPcwQ8'
		const data = CommonUtil.divideString(testString, 10)
		expect(data).toContain('eyJhbGciOi')
		expect(data).toHaveLength(Math.ceil(testString.length / 10))
	})
	test.concurrent('divide array', () => {
		const stringArray = ['apple', 'banana', 'orange', 'grape', 'kiwi']
		const result = CommonUtil.divideArray(stringArray, 3)
		expect(result).toHaveLength(2)
		expect(result[0]).toHaveLength(3)
		expect(result[1]).toHaveLength(2)
		const result1 = CommonUtil.divideArray(stringArray, 2)
		expect(result1).toHaveLength(3)
		expect(result1[0]).toHaveLength(2)
		expect(result1[1]).toHaveLength(2)
		expect(result1[2]).toHaveLength(1)
	})
	test.concurrent('segmentize operation', async () => {
		const outOfContextNumber = 12
		async function timeout(text: string | string[], number: number) {
			return Promise.resolve([text, number] as [string, number])
		}
		const sample: string[] = []
		for (let i = 0; i < 200; i++) {
			sample.push('operation' + i)
		}
		const operations = await CommonUtil.segmentizeOperation<string, (string | number)[]>(
			sample,
			(text: string | string[]) => timeout(text, outOfContextNumber),
			50
		)
		expect(operations).toHaveLength(Math.ceil(sample.length / 50))
	})

	test.concurrent('random sample', async () => {
		const sample = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
		const randomSampleSize = Math.floor(Math.random() * sample.length)
		const random = CommonUtil.randomSample(sample, randomSampleSize)
		expect(random).toHaveLength(randomSampleSize)
	})
})
