const {EMAIL, FULL_NAME} = require('../defines/reg-exps.js');
const {getContributors} = require('./get-contributors.js');
const {getDomains} = require('./get-domains.js');
const {verifyCommitSignature} = require('./verify-commit-signature.js');

const contributors = getContributors();
const domains = getDomains();

async function verifyContributor(type, hash, name, email) {
    const pretty = name + ' <' + email + '>';

    if (!FULL_NAME.test(name)) {
        throw new Error(
            `${type} name (${name}) for commit ${hash} does not match the required format.`
        );
    }

    if (!EMAIL.test(email)) {
        throw new Error(
            `${type} email (${email}) for commit ${hash} is not valid.`
        );
    }

    if (email !== email.toLowerCase()) {
        throw new Error(
            `${type} email (${email}) for commit ${hash} needs to be in lowercase.`
        );
    }

    const domain = email.slice(email.indexOf('@') + 1);

    if (!domains.some((d) => d === domain)) {
        throw new Error(
            `${type} email domain (${domain}) for commit ${hash} is not allowed.`
        );
    }

    const match = contributors.get(email);

    if (!match || match.name !== name) {
        throw new Error(
            `${type} (${pretty}) of commit ${hash} is not in the list of allowed contributors.`
        );
    }

    if (type === 'Committer' && 'gpg' in match && match.gpg) {
        const isSigned = await verifyCommitSignature(hash);

        if (!isSigned) {
            throw new Error(
                `GPG signature is required for committer (${pretty}) on commit ${hash}.`
            );
        }
    }

    return match;
}

module.exports = {
    verifyContributor
};
