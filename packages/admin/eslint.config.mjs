import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import rootConfig from '../../eslint.config.mjs';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...rootConfig,
  {
    files: ['src/**/*.{ts,tsx,jsx,js}'],
    ignores: ['src/vite-env.d.ts', 'src/react-app-env.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        JSX: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      react,
      reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
    },
  },
];
