const {version, license} = require('../package.json');

const date = new Date();

const licenseBanner =
    [
        '/**',
        `@license ${license}`,
        `Copyright (c) ${date.getFullYear()}, Codistica and its affiliates.`,
        '',
        'This source code is licensed under the MIT license found in the',
        'LICENSE.md file in the root directory of this source tree.',
        '',
        `VERSION: ${version}`,
        `BUILD DATE: ${date.toString()}`,
        ''
    ]
        .join('\n * ')
        .trim() + '/';

// EXPECTED OUTPUT:
/**
 * @license <license>
 * Copyright (c) <year>, Codistica and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * VERSION: <version>
 * BUILD DATE: <date>
 * BUILD TYPE: <ESM|CommonJS>
 */

module.exports = {
    licenseBanner
};
