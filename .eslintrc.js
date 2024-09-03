module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:prettier/recommended',
		'plugin:promise/recommended',
		'plugin:security/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended'
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['import', 'prettier', 'promise', 'security', '@typescript-eslint'],
	rules: {
		quotes: ['error', 'single'],
		'@typescript-eslint/no-empty-interface': 'off',
		// "eqeqeq": "error",
		'import/no-unresolved': 'error',
		'import/no-cycle': 'error',
		'no-console': 'warn',
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'promise/always-return': 'error',
		'promise/no-return-wrap': 'error',
		'promise/param-names': 'error',
		'promise/catch-or-return': 'error',
		'promise/no-native': 'off',
		'promise/no-nesting': 'warn',
		'promise/no-promise-in-callback': 'warn',
		'promise/no-callback-in-promise': 'warn',
		'promise/avoid-new': 'warn',
		'promise/no-new-statics': 'error',
		'promise/no-return-in-finally': 'warn',
		'promise/valid-params': 'warn',
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto'
			}
		]
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.d.ts']
		},
		'import/resolver': {
			node: {
				extensions: ['.ts', '.d.ts']
			},
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json'
			}
		}
	},
	ignorePatterns: ['node_modules', 'frontend', 'logs', 'public']
}
