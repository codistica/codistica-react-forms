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
                selector: 'typeParameter',
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
