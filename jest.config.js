const {join} = require('node:path');
const escape = require('escape-string-regexp');

const TARGETS = {
    BABEL_FILES: '^.+\\.[jt]sx?$',
    UNSUPPORTED_FILES: '^(?!.*\\.(js|jsx|ts|tsx|json)$)',
    CSS_MODULES: '\\.module\\.css$'
};

const getPath = (p) => join(__dirname, p);

const OUTPUT_DIRNAME = '.test';

/*
 * Useful Resources:
 * https://jestjs.io/docs/configuration
 * https://jestjs.io/docs/webpack
 * https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/utils/createJestConfig.js
 */

/*
 * Issues:
 * https://github.com/facebook/jest/issues/7331
 */

module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],

    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,

    slowTestThreshold: 2,
    testLocationInResults: true,
    errorOnDeprecated: true,

    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'https://localhost'
    },

    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}',
        '!<rootDir>/src/stories/**/*.{ts,tsx}',
        '!<rootDir>/src/**/*.stories.{ts,tsx}',
        '!<rootDir>/src/**/index.{ts,tsx}'
    ],
    coveragePathIgnorePatterns: ['/node_modules/', escape('/.yarn/')],
    coverageDirectory: `<rootDir>/${OUTPUT_DIRNAME}/coverage`,
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },

    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: `<rootDir>/${OUTPUT_DIRNAME}/reports`,
                outputName: 'junit',
                uniqueOutputName: 'true'
            }
        ]
    ],

    moduleNameMapper: {
        [TARGETS.CSS_MODULES]: 'identity-obj-proxy'
    },

    transform: {
        [TARGETS.BABEL_FILES]: [
            'babel-jest',
            {configFile: getPath('./babel.config.js')}
        ],
        [TARGETS.UNSUPPORTED_FILES]: getPath('./.jest/jest.transform.file.js')
    },

    verbose: true
};
