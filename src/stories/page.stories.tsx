import type {ComponentStory, ComponentMeta} from '@storybook/react';
import {within, userEvent} from '@storybook/testing-library';
import {Page} from './page';

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

const LoggedOut = Template.bind({});

const LoggedIn = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
LoggedIn.play = ({canvasElement}) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', {name: /Log in/i});
    userEvent.click(loginButton);
};

export {LoggedOut, LoggedIn};

export default {
    title: 'Example/Page',
    component: Page,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof Page>;
