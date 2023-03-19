module.exports = {
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            {ignoreRestSiblings: true}
        ],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                prefer: 'type-imports',
                disallowTypeAnnotations: true,
                fixStyle: 'separate-type-imports'
            }
        ],
        '@typescript-eslint/consistent-type-exports': [
            'warn',
            {fixMixedExportsWithInlineTypeSpecifier: false}
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: ['typeAlias', 'typeParameter'],
                format: ['PascalCase'],
                prefix: ['T']
            },
            {
                selector: 'interface',
                format: ['PascalCase'],
                prefix: ['I']
            }
        ]
    }
};
