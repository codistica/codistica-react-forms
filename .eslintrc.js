const SRC_GLOB = '{src,.storybook}/**';

module.exports = {
    root: true,
    extends: ['./.eslint/.eslintrc.base.js'],
    overrides: [
        // *** PARSERS ***

        {
            // NODE
            files: ['**/*'],
            excludedFiles: [`${SRC_GLOB}/*`],
            parser: 'espree',
            extends: ['./.eslint/.eslintrc.node-cjs.js']
        },

        {
            // TYPESCRIPT
            files: [`${SRC_GLOB}/*.{ts,tsx}`],
            extends: ['./.eslint/.eslintrc.typescript.js'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
                tsconfigRootDir: __dirname,
                project: './tsconfig.lint.json'
            },
            settings: {
                'import/resolver': {
                    typescript: {
                        alwaysTryTypes: true,
                        project: './tsconfig.lint.json'
                    }
                }
            }
        },

        {
            // JAVASCRIPT
            files: [`${SRC_GLOB}/*.{js,jsx}`],
            excludedFiles: ['./.storybook/main.js'],
            extends: ['./.eslint/.eslintrc.babel.js'],
            parser: '@babel/eslint-parser',
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
                babelOptions: {
                    root: __dirname
                }
            }
        },

        // *** CONFIGS ***

        {
            // SOURCE - REACT
            files: `${SRC_GLOB}/*.{ts,tsx,js,jsx}`,
            extends: [
                './.eslint/.eslintrc.import.js',
                './.eslint/.eslintrc.dom.js',
                './.eslint/.eslintrc.react.js'
            ]
        },
        {
            // JEST - SETUP
            files: ['**/jest.setup.*'],
            extends: ['./.eslint/.eslintrc.node-esm.js']
        },
        {
            // JEST - TESTS - JS
            files: ['**/*.test.{ts,js}'],
            extends: ['./.eslint/.eslintrc.jest.js']
        },
        {
            // JEST - TESTS - REACT
            files: ['**/*.test.{tsx,jsx}'],
            extends: [
                './.eslint/.eslintrc.jest.js',
                './.eslint/.eslintrc.jest-dom.js',
                './.eslint/.eslintrc.testing-library.js'
            ]
        },
        {
            // STORYBOOK - MAIN
            files: ['./.storybook/main.js'],
            parser: 'espree',
            extends: ['./.eslint/.eslintrc.node-cjs.js']
        },
        {
            // STORYBOOK - STORIES
            files: ['**/*.stories.*'],
            extends: ['./.eslint/.eslintrc.storybook.js']
        },
        {
            // PRETTIER (THIS SHOULD BE ALWAYS LAST)
            files: ['**/*'],
            extends: ['prettier']
        }
    ]
};
