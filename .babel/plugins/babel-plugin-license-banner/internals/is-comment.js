const {oneLineRegex, multiLineRegex} = require('./reg-exps.js');

module.exports = function isComment(input) {
    return oneLineRegex.test(input) || multiLineRegex.test(input);
};
