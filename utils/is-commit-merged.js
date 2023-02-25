const {exec} = require('node:child_process');

async function isCommitMerged(hash) {
    return new Promise((resolve, reject) => {
        exec(
            `git branch --remotes --contains ${hash}`,
            (error, stdout, stderr) => {
                if (stderr) {
                    console.error(stderr);
                }

                if (error) {
                    reject(error);
                } else {
                    const matches = stdout
                        .split('\n')
                        .filter((v) => !!v)
                        .map((v) => v.trim());

                    resolve(matches.some((v) => v === 'origin/development'));
                }
            }
        );
    });
}

module.exports = {
    isCommitMerged
};
