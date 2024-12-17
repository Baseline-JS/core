import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import rootConfig from '../../eslint.config.mjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(...rootConfig, {
  files: ['src/**/*.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
    },
    globals: {
      ...globals.node,
    },
  },
  plugins: {},
  rules: {
    ...js.configs.recommended.rules,
    ...tsPlugin.configs.recommended.rules,
    ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
  },
});
