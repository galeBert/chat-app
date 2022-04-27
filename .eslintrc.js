module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: ['eslint-config-kdnj/react'],
  rules: {
    'no-unused-private-class-members': 'off',
    'prefer-object-has-own': 'off',
    'import/newline-after-import': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/order': 'off',
    'sort-imports': 'off',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^.+\\.s?css$'],
          ['^\\u0000'],
          ['^react$', '^react-dom$'],
          ['^~', '^@/'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
};
