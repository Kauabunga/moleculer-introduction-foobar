module.exports = {
	root: true,
	env: {
		node: true,
		commonjs: true,
		es6: true,
		jest: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: '2020',
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
		'no-var': ['error'],
		'no-console': ['off'],
		'no-unused-vars': ['warn'],
		'no-mixed-spaces-and-tabs': ['warn'],
	},
};
