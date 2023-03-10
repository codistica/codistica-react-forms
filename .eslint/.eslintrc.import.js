module.exports = {
    plugins: ['import'],
    extends: ['plugin:import/warnings'],
    rules: {
        'import/named': 'error',
        'import/namespace': 'error',
        'import/default': 'error',
        'import/no-named-as-default-member': 'error',
        'import/no-named-as-default': 'error',
        'import/no-cycle': 'error',
        'import/no-unused-modules': 'error',
        'import/no-deprecated': 'error',
        'import/no-unresolved': 'warn',
        'import/no-absolute-path': 'warn',
        'import/no-self-import': 'warn',
        'import/no-useless-path-segments': 'warn',
        'import/export': 'warn',
        'import/no-mutable-exports': 'warn',
        'import/extensions': [
            'warn',
            'always',
            {
                ignorePackages: true,
                pattern: {
                    ts: 'never',
                    tsx: 'never'
                }
            }
        ],
        'import/no-default-export': 'warn',
        'import/group-exports': 'warn',
        'import/order': [
            'warn',
            {
                groups: [
                    'builtin',
                    ['external', 'unknown'],
                    'internal',
                    'parent',
                    'sibling',
                    'index'
                ],
                alphabetize: {
                    order: 'asc'
                }
            }
        ],
        'import/newline-after-import': 'warn',
        'import/no-namespace': 'off',
        'import/no-duplicates': 'warn',
        'import/exports-last': 'warn',
        'import/first': 'error',
        'import/no-amd': 'error',
        'import/no-anonymous-default-export': 'warn',
        'import/no-webpack-loader-syntax': 'error'
    }
};
