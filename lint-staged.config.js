module.exports = {
    '*.{ts,tsx,js}': ['prettier --loglevel warn --write', 'eslint'],
    '*.{json,md,yml}': ['prettier --loglevel warn --write']
};
