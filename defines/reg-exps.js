const COMMIT_MESSAGE = /^(?<task>[a-z]+): ([a-z][ \w\-,%]*[\w%])$/;

const FULL_NAME = /^[A-Z][a-z]+ [A-Z][a-z]+$/;

const EMAIL =
    /^(?:([^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(?:(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|((?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
    COMMIT_MESSAGE,
    FULL_NAME,
    EMAIL
};
