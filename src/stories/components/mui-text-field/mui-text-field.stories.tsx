import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {emailValidator, lengthValidator} from '../../../plugins/validators';
import {MuiTextField} from './mui-text-field';

const Template: ComponentStory<typeof MuiTextField> = (args) => (
    <MuiTextField {...args} />
);

interface IData {
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
                minLength: (data) => `Minimum length is ${(data as IData).min}`,
                maxLength: (data) => `Maximum length is ${(data as IData).max}`
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
