module.exports = {
    '*.{ts,tsx,js,jsx}': ['prettier --loglevel warn --write', 'eslint'],
    '*.{json,md,yml}': ['prettier --loglevel warn --write']
};
