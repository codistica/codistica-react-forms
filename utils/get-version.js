const {findVersion} = require('./find-version.js');
const {toExactVersion} = require('./to-exact-version.js');

function getVersion(name, exact) {
    const ver = findVersion(name);

    if (!ver) {
        return undefined;
    }

    return exact ? toExactVersion(ver) : ver;
}

module.exports = {getVersion};
