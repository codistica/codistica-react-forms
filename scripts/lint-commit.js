const {readFile} = require('node:fs/promises');
const {verifyCommitMessage} = require('../utils/verify-commit-message.js');
const {verifyContributor} = require('../utils/verify-contributor.js');

(async () => {
    console.log('[VALIDATING COMMIT]', '\n');

    const path = process.argv[2];

    if (!path) {
        throw new Error(
            'CANNOT FIND COMMIT MESSAGE. SCRIPT MUST BE EXECUTED BY commit-msg HOOK'
        );
    }

    const raw = await readFile(path, {encoding: 'utf-8'});

    const [message, ...body] = raw.split('\n');

    verifyCommitMessage('NEW-COMMIT', message, body.join('\n'), false);

    await verifyContributor(
        'Author',
        'NEW-COMMIT',
        process.env.GIT_AUTHOR_NAME,
        process.env.GIT_AUTHOR_EMAIL,
        null,
        false
    );

    if (process.env.GIT_COMMITTER_NAME || process.env.GIT_COMMITTER_EMAIL) {
        await verifyContributor(
            'Committer',
            'NEW-COMMIT',
            process.env.GIT_COMMITTER_NAME,
            process.env.GIT_COMMITTER_EMAIL,
            null,
            false
        );
    }

    console.log('[COMMIT VALIDATION SUCCEEDED]', '\n');
})();
