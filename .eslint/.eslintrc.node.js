const {engines} = require('../package.json');

module.exports = {
    plugins: ['node'],
    extends: ['plugin:node/recommended'],
    env: {
        node: true
    },
    rules: {
        'node/shebang': [
            'error',
            {
                convertPath: {
                    'src/bin/**/*.js': ['^src/(.+?)\\.js$', 'cjs/$1.js']
                }
            }
        ],
        'node/no-unsupported-features/es-syntax': [
            'error',
            {
                version: engines.node,
                ignores: ['modules']
            }
        ],
        'node/no-unsupported-features/node-builtins': [
            'error',
            {
                version: engines.node
            }
        ]
    }
};
