import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';
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

export {LoggedIn, LoggedOut};

export default {
    title: 'Example/Page',
    component: Page,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof Page>;
