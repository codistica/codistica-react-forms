const {findVersion} = require('../utils/find-version.js');

module.exports = {
    plugins: ['jest'],
    extends: ['plugin:jest/all'],
    env: {
        jest: true
    },
    settings: {
        jest: {
            version: findVersion('jest')
        }
    },
    rules: {
        'jest/max-expects': 'warn'
    }
};
