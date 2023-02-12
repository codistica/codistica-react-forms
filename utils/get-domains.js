const {domains} = require('../package.json');

function getDomains() {
    return domains;
}

module.exports = {
    getDomains
};
