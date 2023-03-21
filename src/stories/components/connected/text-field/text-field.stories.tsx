import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {spaceBlocker} from '../../../../plugins/blockers';
import {spaceFilter} from '../../../../plugins/filters';
import {emailValidator, lengthValidator} from '../../../../plugins/validators';
import {TextField} from './text-field';

const Template: ComponentStory<typeof TextField> = (args) => (
    <TextField {...args} />
);

interface IParams {
    min: number;
    max: number;
}

const MultiValidator = Template.bind({});
MultiValidator.args = {
    variant: 'outlined',
    label: 'Length Validator',
    required: true,
    errorMessages: {
        mandatory: 'This field is mandatory'
    },
    plugins: [
        lengthValidator({
            minLength: 5,
            maxLength: 20,
            errorMessages: {
                minLength: (params) =>
                    `Minimum length is ${(params as IParams).min}`,
                maxLength: (params) =>
                    `Maximum length is ${(params as IParams).max}`
            }
        }),
        emailValidator({
            errorMessages: {
                generic: 'Please check:',
                format: '- Email format'
            }
        }),
        spaceBlocker,
        spaceFilter
    ]
};

const Required = Template.bind({});
Required.args = {
    variant: 'outlined',
    label: 'Required',
    required: true,
    errorMessages: {
        mandatory: 'This field is mandatory!'
    }
};

export {MultiValidator, Required};

export default {
    title: 'Demo/Components (Connected)/Text Field',
    component: TextField,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof TextField>;
