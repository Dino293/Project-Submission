import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
// 1. IMPOR KONFIGURASI DICODING STYLE GUIDE
import daStyle from 'eslint-config-dicodingacademy';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig([
  // 2. GUNAKAN `daStyle` SEBAGAI KONFIGURASI DASAR
  daStyle,
  globalIgnores(['dist', 'node_modules']),
  {
    // 3. TAMBAHKAN KONFIGURASI KHUSUS UNTUK REACT
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Aturan khusus React (nonaktifkan yang tidak diperlukan)
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      // Aturan React Hooks
      ...reactHooks.configs.recommended.rules,
      // Aturan React Refresh
      'react-refresh/only-export-components': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);