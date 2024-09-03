/**
 * Checks if two arrays are equal.
 *
 * @param {T[]} a - The first array to compare.
 * @param {T[]} b - The second array to compare.
 * @return {boolean} Returns true if the arrays are equal, false otherwise.
 */
function areArraysEqual<T>(a: T[], b: T[]): boolean {
	return a.length === b.length && [...a].every((value) => b.includes(value))
}
/**
 * Clamps a number or a string within a specified range.
 *
 * @param {number | string} value - The value to clamp.
 * @param {number} [min=0] - The minimum value allowed.
 * @param {number} [max=100] - The maximum value allowed.
 * @return {number} - The clamped value.
 */
function clampNumber(value: number | string, min = 0, max = 100): number {
	value = isNaN(value as number) ? parseInt(value as string) : 20
	return value < min ? min : value > max ? max : value
}
/**
 * Divides a string into segments of maximum length.
 *
 * @param {string} text - The string to be divided.
 * @param {number} maxLength - The maximum length of each segment.
 * @return {string[]} An array of segments.
 */
function divideString(text: string, maxLength: number): string[] {
	if (maxLength < 1) return [text]
	if (text.length <= maxLength) return [text]
	const result = []
	let startIndex = 0
	while (startIndex < text.length) {
		const segment = text.substring(startIndex, startIndex + maxLength)
		result.push(segment)
		startIndex += maxLength
	}
	return result
}
/**
 * Replaces keywords in a template string with corresponding values from a map.
 *
 * @param {string} template - The template string with keywords to be replaced.
 * @param {Object.<string, string>} map - The map of keywords and their corresponding values.
 * @return {string} The template string with keywords replaced by their corresponding values.
 */
function replaceKeywords(template: string, map: { [key: string]: string } = {}): string {
	const str = template
	// eslint-disable-next-line security/detect-non-literal-regexp, no-useless-escape
	const regex = new RegExp(`\\[(${Object.keys(map).join('|')})\\]`, 'gm')
	return str.replaceAll(regex, (_, index) => map[index as keyof typeof map] || '')
}
/**
 * Divide an array into multiple subarrays, each of which is at most of the given length.
 * If maxLength is less than 1, return the original array.
 * If the array is already shorter than or equal to maxLength, return a single-element array containing the array.
 * @param collection The array to divide
 * @param maxLength The maximum length of each subarray.
 * @returns An array of subarrays. The length of the returned array is always <= Math.ceil(collection.length / maxLength).
 */
function divideArray<T>(collection: T[], maxLength: number): T[][] {
	if (maxLength < 1) return [collection]
	if (collection.length <= maxLength) return [collection]
	const result = []
	let startIndex = 0
	while (startIndex < collection.length) {
		const segment = collection.slice(startIndex, startIndex + maxLength)
		result.push(segment)
		startIndex += maxLength
	}
	return result
}
/**
 * Splits a collection into smaller batches and applies a callback function to each batch asynchronously.
 *
 * @param {T[]} collection - The collection to be split into batches.
 * @param {(arg: T[]) => Promise<U>} cb - The callback function to be applied to each batch.
 * @param {number} [batchSize=50] - The size of each batch.
 * @return {Promise<(U | PromiseLike<U>)[]>} - A promise that resolves to an array of the results of the callback function applied to each batch.
 */
async function segmentizeOperation<T, U>(collection: T[], cb: (arg: T[]) => Promise<U>, batchSize = 50) {
	const operations = []
	for (let i = 0; i < collection.length; i += batchSize) {
		const batch = collection.slice(i, i + batchSize)
		operations.push(cb(batch))
	}
	return await Promise.allSettled(operations)
}
/**
 * Generates a random sample of elements from an array.
 *
 * @param {Array} arr - The array from which to generate the random sample.
 * @param {number} n - The number of elements to include in the sample. Default is 1.
 * @return {Array} - The randomly selected sample of elements from the array.
 */
function randomSample<T>([...arr]: Array<T>, n = 1): Array<T> {
	let m = arr.length
	while (m) {
		const i = Math.floor(Math.random() * m--)
		// eslint-disable-next-line security/detect-object-injection
		;[arr[m], arr[i]] = [arr[i], arr[m]]
	}
	return arr.slice(0, n)
}

/**
 *
 * @param args argument object [key]: value
 * @example [memberAttributeId123]: 'test'
 * @returns sanitized argument object [key]: value
 */
function sanitizeValidMemberAttributes(args: { [memberAttributeId: string]: unknown }) {
	const sanitizedAttributeValues = Object.keys(args).filter((key) => {
		if (!key.startsWith('memberAttributeId')) return false
		const keyId = key.slice('memberAttributeId'.length)
		if (isNaN(parseInt(keyId))) return false
		return true
	})
	return Object.fromEntries(sanitizedAttributeValues.map((key) => [key, args[key as keyof typeof args]]))
}

export default {
	sanitizeValidMemberAttributes,
	areArraysEqual,
	clampNumber,
	segmentizeOperation,
	divideString,
	randomSample,
	divideArray,
	replaceKeywords
}
