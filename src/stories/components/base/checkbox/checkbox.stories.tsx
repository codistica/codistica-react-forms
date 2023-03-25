import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {Checkbox} from './checkbox';

const messages = ['Message A', 'Message B'];

const Template: ComponentStory<typeof Checkbox> = (args) => (
    <Checkbox {...args} />
);

const Highlight = Template.bind({});
Highlight.args = {
    label: 'Checkbox',
    status: 'highlight',
    messages
};

const Invalid = Template.bind({});
Invalid.args = {
    label: 'Checkbox',
    status: 'invalid',
    messages
};

const Missing = Template.bind({});
Missing.args = {
    label: 'Checkbox',
    status: 'missing',
    messages
};

const Null = Template.bind({});
Null.args = {
    label: 'Checkbox',
    status: null,
    messages
};

const StandBy = Template.bind({});
StandBy.args = {
    label: 'Checkbox',
    status: 'standBy',
    messages
};

const Valid = Template.bind({});
Valid.args = {
    label: 'Checkbox',
    status: 'valid',
    messages
};

const Warning = Template.bind({});
Warning.args = {
    label: 'Checkbox',
    status: 'warning',
    messages
};

export {Highlight, Invalid, Missing, Null, StandBy, Valid, Warning};

export default {
    title: 'Demo/Components (Base)/Checkbox',
    component: Checkbox,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof Checkbox>;
