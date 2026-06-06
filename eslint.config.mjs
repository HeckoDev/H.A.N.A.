// @ts-check
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Extra plugins: import sorting + unused imports
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',

      // General
      'no-unreachable': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Vue
      'vue/multi-word-component-names': ['warn', { ignores: ['index', 'default', 'error'] }],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/html-self-closing': ['warn', { html: { void: 'never' } }],
    },
  },
  // Test files overrides
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
).override('nuxt/typescript/rules', {
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
});
