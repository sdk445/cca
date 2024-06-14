const { Linter } = require('eslint');
const airbnbBase = require('eslint-config-airbnb-base');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...airbnbBase.rules,
      // Override Airbnb rules or add your own here
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
