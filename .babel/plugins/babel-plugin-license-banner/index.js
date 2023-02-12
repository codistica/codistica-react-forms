const getCommentContent = require('./internals/get-comment-content.js');
const isComment = require('./internals/is-comment.js');

module.exports = function babelPluginLicenseBanner() {
    return {
        visitor: {
            Program(path, {opts}) {
                const {licenseBanner} = opts;

                if (
                    typeof licenseBanner !== 'string' ||
                    !isComment(licenseBanner)
                ) {
                    throw new TypeError('Banner must be a valid comment.');
                }

                const content = getCommentContent(licenseBanner);

                path.addComment('leading', content);
            }
        }
    };
};
