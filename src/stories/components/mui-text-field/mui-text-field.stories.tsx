import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {emailValidator, lengthValidator} from '../../../plugins/validators';
import {MuiTextField} from './mui-text-field';

const Template: ComponentStory<typeof MuiTextField> = (args) => (
    <MuiTextField {...args} />
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
        })
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
    title: 'Components/MuiTextField',
    component: MuiTextField,
    argTypes: {
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof MuiTextField>;
