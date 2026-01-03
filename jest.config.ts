import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },

    moduleNameMapper: {
        '^(\\.\\.?\\/.+)\\.js$': '$1',
    },
    testMatch: ['**/src/**/*.(spec|test).{js,ts}'],
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testTimeout: 30000,
    forceExit: false,
    detectOpenHandles: true,
};

export default config;
