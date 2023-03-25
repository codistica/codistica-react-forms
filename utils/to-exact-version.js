function toExactVersion(ver) {
    return ver.replace(/[^0-9.]/g, '');
}

module.exports = {toExactVersion};
