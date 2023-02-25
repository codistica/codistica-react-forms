const {getCommits} = require('../utils/get-commits.js');
const {getCurrentBranch} = require('../utils/get-current-branch.js');
const {isCommitMerged} = require('../utils/is-commit-merged.js');
const {verifyCommitMessage} = require('../utils/verify-commit-message.js');
const {verifyContributor} = require('../utils/verify-contributor.js');

(async () => {
    console.log('[VALIDATING COMMITS]', '\n');

    const currentBranch = await getCurrentBranch();

    const from =
        process.env.NPM_CONFIG_REF_BRANCH ||
        (currentBranch === 'development'
            ? 'origin/main'
            : 'origin/development');

    const commits = await getCommits(from, 'HEAD');

    if (!commits.length) {
        console.log('NO NEW COMMITS FOUND', '\n');
        return;
    }

    console.log(
        `${commits.length} NEW COMMIT${commits.length > 1 ? 'S' : ''} FOUND`,
        '\n'
    );

    for (const commit of commits) {
        const {
            hash,
            message,
            body,
            authorName,
            authorEmail,
            committerName,
            committerEmail,
            gpgKeyID
        } = commit;

        const isMerged = await isCommitMerged(hash);

        verifyCommitMessage(hash, message, body, isMerged);

        await verifyContributor(
            'Author',
            hash,
            authorName,
            authorEmail,
            gpgKeyID,
            isMerged
        );

        await verifyContributor(
            'Committer',
            hash,
            committerName,
            committerEmail,
            gpgKeyID,
            isMerged
        );
    }

    console.log('[COMMITS VALIDATION SUCCEEDED]', '\n');
})();
