import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {Checkbox} from './checkbox';

const Template: ComponentStory<typeof Checkbox> = (args) => (
    <Checkbox {...args} />
);

const Required = Template.bind({});
Required.args = {
    label: 'Required',
    required: true,
    errorMessages: {
        mandatory: 'This field is mandatory!'
    }
};

export {Required};

export default {
    title: 'Demo/Components (Connected)/Checkbox',
    component: Checkbox,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof Checkbox>;
