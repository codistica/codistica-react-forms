const {oneLineRegex} = require('./reg-exps.js');

module.exports = function getCommentContent(input) {
    if (oneLineRegex.test(input)) {
        return input.replace(/^\/\//, '');
    } else {
        return input.replace(/^\/\*/, '').replace(/\*\/\n?$/, '');
    }
};
