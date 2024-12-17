import rootConfig from '../../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    files: ['*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {},
    rules: {},
  },
];
