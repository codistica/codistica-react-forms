const {readFile} = require('node:fs/promises');
const {EOL} = require('node:os');
const {verifyCommitMessage} = require('../utils/verify-commit-message.js');

(async () => {
    console.log('[VALIDATING COMMIT MESSAGE]', '\n');

    const path = process.argv[2];

    if (!path) {
        throw new Error(
            'CANNOT FIND COMMIT MESSAGE. SCRIPT MUST BE EXECUTED BY commit-msg HOOK'
        );
    }

    const raw = await readFile(path, {encoding: 'utf-8'});

    const [message, ...body] = raw.split(EOL);

    verifyCommitMessage('NEW COMMIT', message, body.join('\n'));

    console.log('[COMMIT MESSAGE VALIDATION SUCCEEDED]', '\n');
})();
