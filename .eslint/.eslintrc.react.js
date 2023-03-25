module.exports = {
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            jsxPragma: null
        }
    },
    plugins: ['react'],
    extends: ['./.eslintrc.jsx.js', './.eslintrc.react-hooks.js'],
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        'react/jsx-uses-vars': 'warn',
        'react/jsx-uses-react': 'off',
        'react/forbid-foreign-prop-types': ['warn', {allowInPropTypes: true}],
        'react/jsx-no-comment-textnodes': 'warn',
        'react/jsx-no-duplicate-props': 'warn',
        'react/jsx-no-target-blank': 'warn',
        'react/jsx-no-undef': 'error',
        'react/jsx-pascal-case': [
            'warn',
            {
                allowAllCaps: true,
                ignore: []
            }
        ],
        'react/no-danger-with-children': 'warn',
        'react/no-direct-mutation-state': 'warn',
        'react/no-is-mounted': 'warn',
        'react/no-typos': 'error',
        'react/require-render-return': 'error',
        'react/style-prop-object': 'warn',
        'react/display-name': 'error',
        'react/jsx-curly-brace-presence': ['error', 'always'],
        'react/jsx-key': 'error',
        'react/no-children-prop': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [
            'error',
            {extensions: ['.tsx', '.jsx']}
        ]
    }
};
