const MESSAGE_MAX_LENGTH = 72;

const COMMIT_TASKS = [
    'feat',
    'chore',
    'docs',
    'fix',
    'tests',
    'refactor',
    'perf',
    'ci'
];

const DEPRECATED_COMMIT_TASKS = [];

module.exports = {
    MESSAGE_MAX_LENGTH,
    COMMIT_TASKS,
    DEPRECATED_COMMIT_TASKS
};
