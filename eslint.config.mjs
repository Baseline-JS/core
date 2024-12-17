import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['eslint.config.mjs'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.es2021,
    },
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tsPlugin.configs.recommended.rules,
    ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
  },
});
