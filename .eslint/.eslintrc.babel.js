module.exports = {
    plugins: ['@babel'],
    rules: {
        'new-cap': 'off',
        'no-invalid-this': 'off',
        'no-unused-expressions': 'off',
        'object-curly-spacing': 'off',
        semi: 'off',

        '@babel/new-cap': 'error',
        '@babel/no-invalid-this': 'error',
        '@babel/no-unused-expressions': 'error',
        '@babel/object-curly-spacing': 'error',
        '@babel/semi': 'error'
    }
};
