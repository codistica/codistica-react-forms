const {getDiffFiles} = require('../utils/get-diff-files.js');

(async () => {
    console.log('[VALIDATING DIFF STATUS]', '\n');

    const paths = await getDiffFiles();

    if (paths.length) {
        throw new Error(
            `There must not be any uncommitted changes at this point`
        );
    }

    console.log('[DIFF STATUS VALIDATION SUCCEEDED]', '\n');
})();
