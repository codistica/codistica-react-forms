const {exec} = require('node:child_process');

async function verifyCommitSignature(hash) {
    return new Promise((resolve) => {
        exec(`git verify-commit ${hash}`, (error, stdout, stderr) => {
            if (error) {
                if (stderr) {
                    console.error(stderr);
                }

                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = {
    verifyCommitSignature
};
