module.exports = {
  extends: [
    '../../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
