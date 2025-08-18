module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	extends: ['@n8n/eslint-config/node'],

	rules: {
		// TODO: Remove this
		'import/no-cycle': 'warn',
		'import/order': 'off',
		'import/extensions': 'warn',

		// TODO: Remove this
		'@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': true }],
		'@typescript-eslint/no-duplicate-imports': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/no-unsafe-argument': 'warn',
		'@typescript-eslint/no-unsafe-assignment': 'warn',
		'@typescript-eslint/no-unsafe-call': 'warn',
		'@typescript-eslint/no-unsafe-member-access': 'warn',
		'@typescript-eslint/no-unsafe-return': 'warn',
		'@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
		'@typescript-eslint/prefer-nullish-coalescing': 'warn',
		'@typescript-eslint/prefer-optional-chain': 'warn',
	},
};


