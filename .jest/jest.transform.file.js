const {basename} = require('node:path');

module.exports = {
    process(sourceText, sourcePath) {
        return {
            code: `module.exports = ${JSON.stringify(basename(sourcePath))};`
        };
    }
};
