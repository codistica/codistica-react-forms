const {
    dependencies,
    devDependencies,
    peerDependencies
} = require('../package.json');

function findVersion(name) {
    const sources = [dependencies, devDependencies, peerDependencies];

    for (const source of sources) {
        if (!source) {
            continue;
        }

        const keys = Object.keys(source);

        for (const key of keys) {
            if (name instanceof RegExp) {
                if (name.test(key)) {
                    return source[key];
                }
            } else if (key === name) {
                return source[key];
            }
        }
    }

    return null;
}

module.exports = {findVersion};
