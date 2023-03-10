const {MESSAGE_MAX_LENGTH} = require('../defines/commits.js');
const {
    COMMIT_TASKS,
    DEPRECATED_COMMIT_TASKS
} = require('../defines/commits.js');
const {COMMIT_MESSAGE} = require('../defines/reg-exps.js');

function verifyCommitMessage(hash, message, body, isMerged) {
    if (!COMMIT_MESSAGE.test(message)) {
        throw new Error(
            `Message (${message}) for commit ${hash} does not match the required pattern.`
        );
    }

    const match = message.match(COMMIT_MESSAGE);

    if (!match) {
        throw new Error(
            `Message "${message}" for commit ${hash} does not match the required pattern.`
        );
    }

    const tasks = isMerged
        ? COMMIT_TASKS.concat(DEPRECATED_COMMIT_TASKS)
        : COMMIT_TASKS;

    if (!tasks.some((t) => match.groups.task === t)) {
        throw new Error(
            `Message "${message}" for commit ${hash} does not match the required pattern. Type ${match.groups.task} is not allowed.`
        );
    }

    if (body.length) {
        throw new Error(`Body for commit ${hash} must be empty.`);
    }

    if (message.length > MESSAGE_MAX_LENGTH) {
        throw new Error(
            `Message "${message}" for commit ${hash} exceeds the maximum length (${MESSAGE_MAX_LENGTH}).`
        );
    }
}

module.exports = {
    verifyCommitMessage
};
