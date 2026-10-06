import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      '.env*',
      'public/**/*',
      'dist/**',
      'coverage/**',
      'uploads/**',
      'logs/**',
      'test/**',
      'tests/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },

    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'no-console': 'off',

      'no-undef': 'error',

      'prefer-const': 'error',

      'no-var': 'error',
    },
  },

  prettier,
];
