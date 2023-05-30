module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'es-lint:recommended',
    'plugin-@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier ': 'error',
    'import/extensions': 'off',
    'no-console': 'off', 
    'import/order': [
      'error',
      {
        'newline-between': 'never',
        'group': [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
      },
    ],
  },
  settings: {
    'import/parser': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      alwaysTryTypes: true,
      project:'./tsconfig.json'
    },
  },
};
