module.exports = {
	"extends": "airbnb",
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    rules: {
		'no-else-return': 1,
		'prefer-template': 0,
		'object-curly-spacing': ['error', 'always'],
		'max-len': ['error', { 'code': 170, 'ignoreComments': true, }],
		'no-dupe-keys': 2,
		'semi': 2,
		'no-unused-vars': 2,
		'no-trailing-spaces': 0,
		'no-multi-spaces': 1,
		'space-in-parens': 1,
		'no-multiple-empty-lines': 1,
		'linebreak-style': 0,
		'no-tabs': 0,
		'indent': 0,
		'no-console': 1,
		'no-alert': 2,
		'comma-dangle': ['error', 'always-multiline'],
		'guard-for-in': 2,
		'no-restricted-syntax': 1,
		'no-param-reassign': 0,
		'import/prefer-default-export': 0,
		'no-use-before-define': 0,
		'quote-props': 0,
		'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
	},
};
