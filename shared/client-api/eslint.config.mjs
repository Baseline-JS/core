import globals from 'globals';
import rootConfig from '../../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    files: ['*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        process: 'readonly',
      },
    },
    plugins: {},
    rules: {},
  },
];
