const {exec} = require('node:child_process');

async function getCommits(from, to) {
    return new Promise((resolve, reject) => {
        exec(
            `git log --pretty=format:"%H|%s|%b|%aN|%aE|%cN|%cE" ${from}..${to}`,
            (error, stdout, stderr) => {
                if (stderr) {
                    console.error(stderr);
                }

                if (error) {
                    reject(error);
                } else {
                    const lines = stdout.split('\n').filter((l) => l.length);

                    const commits = lines.map((line) => {
                        const [
                            hash,
                            message,
                            body,
                            authorName,
                            authorEmail,
                            committerName,
                            committerEmail
                        ] = line.split('|');

                        return {
                            hash,
                            message,
                            body,
                            authorName,
                            authorEmail,
                            committerName,
                            committerEmail
                        };
                    });

                    resolve(commits);
                }
            }
        );
    });
}

module.exports = {
    getCommits
};
