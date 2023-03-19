import type {ComponentMeta, ComponentStory} from '@storybook/react';
import {prettifyPreset} from '../../plugins/presets';
import {lengthValidator} from '../../plugins/validators';

import {InputRenderer} from './input-renderer';

const Template: ComponentStory<typeof InputRenderer> = (args) => (
    <InputRenderer
        {...args}
        inputRenderFn={(inputProps, inputRendererAPI) => {
            return (
                <div>
                    <input
                        data-testid={'input'}
                        {...inputProps}
                        value={inputProps.value as string}
                    />
                    <div>{inputRendererAPI.status}</div>
                </div>
            );
        }}
    />
);

const Default = Template.bind({});
Default.args = {
    name: 'test'
};

const Optional = Template.bind({});
Optional.args = {
    name: 'test',
    mandatory: false
};

const Preset = Template.bind({});
Preset.args = {
    name: 'test',
    plugins: prettifyPreset
};

const Validator = Template.bind({});
Validator.args = {
    name: 'test',
    plugins: lengthValidator({
        minLength: 10,
        maxLength: 20
    })
};

export {Default, Optional, Preset, Validator};

export default {
    title: 'Components/InputRenderer',
    component: InputRenderer
} as ComponentMeta<typeof InputRenderer>;
