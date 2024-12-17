import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import rootConfig from '../../eslint.config.mjs';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(...rootConfig, react.configs.flat.recommended, {
  files: ['src/**/*.{ts,tsx,jsx,js}'],
  ignores: ['src/vite-env.d.ts', 'src/react-app-env.d.ts'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
    },
    globals: {
      ...globals.browser,
      JSX: 'readonly',
      process: 'readonly',
    },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tsPlugin.configs.recommended.rules,
    ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
    ...reactHooks.configs.recommended.rules,
  },
});
