import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {TextField} from './text-field';

const messages = ['Message A', 'Message B'];

const Template: ComponentStory<typeof TextField> = (args) => (
    <TextField {...args} />
);

const Highlight = Template.bind({});
Highlight.args = {
    label: 'TextField',
    status: 'highlight',
    messages
};

const Invalid = Template.bind({});
Invalid.args = {
    label: 'TextField',
    status: 'invalid',
    messages
};

const Missing = Template.bind({});
Missing.args = {
    label: 'TextField',
    status: 'missing',
    messages
};

const Null = Template.bind({});
Null.args = {
    label: 'TextField',
    status: null,
    messages
};

const StandBy = Template.bind({});
StandBy.args = {
    label: 'TextField',
    status: 'standBy',
    messages
};

const Valid = Template.bind({});
Valid.args = {
    label: 'TextField',
    status: 'valid',
    messages
};

const Warning = Template.bind({});
Warning.args = {
    label: 'TextField',
    status: 'warning',
    messages
};

export {Highlight, Invalid, Missing, Null, StandBy, Valid, Warning};

export default {
    title: 'Demo/Components (Base)/TextField',
    component: TextField,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof TextField>;
