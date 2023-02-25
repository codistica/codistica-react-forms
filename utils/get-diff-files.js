const {exec} = require('node:child_process');

async function getDiffFiles() {
    return new Promise((resolve, reject) => {
        exec('git diff --name-only HEAD', (error, stdout, stderr) => {
            if (stderr) {
                console.error(stderr);
            }

            if (error) {
                reject(error);
            } else {
                resolve(stdout.split('\n').filter((l) => !!l));
            }
        });
    });
}

module.exports = {
    getDiffFiles
};
