module.exports = {
    '*.{ts,tsx,js,jsx}': [
        'eslint --cache --fix',
        'prettier --loglevel warn --write'
    ]
};
