// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  ignorePatterns: [
    '.github',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.cache',
    '.storybook/*',
    'build',
    'dist',
    'node_modules',
    '*.mjs',
    '*.js'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2023,
        sourceType: 'module',
      },
    },
  ],
  plugins: ['effector'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:effector/recommended',
  ],
  rules: {
    /**
     * Base rules
     */
    'prettier/prettier': 'warn',
    'import/first': 'off',
    'require-await': 'off',
    /**
     * TypeScript rules
     */
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { destructuredArrayIgnorePattern: '^_' },
    ],
    '@typescript-eslint/require-await': 'off',

    /**
     * React rules
     */
    "react-hooks/rules-of-hooks": "off",
    'react/no-children-prop': 'off',
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/jsx-no-literals": "off",
    "react/react-in-jsx-scope": "off",

    /**
     * Vue rules
     * TODO remove after full migration to React
     */
    'vue/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/block-order': [
      'error',
      {
        order: [['template', 'script'], 'style'],
      },
    ],
  },
})
