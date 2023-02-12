const {exec} = require('node:child_process');

async function getCurrentBranch() {
    return new Promise((resolve, reject) => {
        exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
            if (stderr) {
                console.error(stderr);
            }

            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = {
    getCurrentBranch
};
