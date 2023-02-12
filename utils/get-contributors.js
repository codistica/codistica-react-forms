const {contributors} = require('../package.json');

function getContributors() {
    return contributors.reduce((map, entry) => {
        map.set(entry.email, entry);
        return map;
    }, new Map());
}

module.exports = {
    getContributors
};
