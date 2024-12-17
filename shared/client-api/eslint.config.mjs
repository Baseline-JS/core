import globals from 'globals';
import rootConfig from '../../eslint.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(...rootConfig, {
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
});
