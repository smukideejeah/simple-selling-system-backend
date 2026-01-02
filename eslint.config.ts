// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
    {
        ignores: [
            'build/',
            'src/generated/**',
            'node_modules/',
            '**/*.js',
            '**/*.cjs',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    {
        files: ['src/**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
        },
    },

    prettier,
];
