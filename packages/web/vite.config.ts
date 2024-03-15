import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// // https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin([
      'REACT_APP_APP_NAME',
      'REACT_APP_AWS_PROFILE',
      'REACT_APP_API_URL',
      'REACT_APP_COGNITO_IDENTITY_POOL_ID',
      'REACT_APP_COGNITO_USER_POOL_ID',
      'REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID',
    ]),
  ],
  envPrefix: 'REACT_APP_',
  define: {},
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  esbuild: {
    minifyWhitespace: true,
    treeShaking: true,
  },
  build: {
    outDir: '.dist',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1500,
  },
});
