const MESSAGE_MAX_LENGTH = 72;

const COMMIT_TASKS = [
    'chore',
    'ci',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'style',
    'test'
];

const DEPRECATED_COMMIT_TASKS = [];

module.exports = {
    MESSAGE_MAX_LENGTH,
    COMMIT_TASKS,
    DEPRECATED_COMMIT_TASKS
};
