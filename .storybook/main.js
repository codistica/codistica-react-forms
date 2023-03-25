module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(ts|tsx|js|jsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions'
    ],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5',
        disableTelemetry: true
    },
    features: {
        babelModeV7: true
    }
};
