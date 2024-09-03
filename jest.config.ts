/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	coverageDirectory: './backend-src/tests/coverage',
	setupFiles: ['./backend-src/tests/setEnvVars.ts'],
	verbose: true
}
