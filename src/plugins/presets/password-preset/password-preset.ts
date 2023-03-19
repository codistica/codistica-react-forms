import type {IPreset, TMessage} from '../../../defines/common.types';
import {spaceBlocker} from '../../blockers';
import {spaceFilter} from '../../filters';
import {passwordValidator} from '../../validators';

interface IPasswordPresetOptions {
    errorMessages?: {
        generic?: TMessage;
        length?: TMessage;
        numbers?: TMessage;
        lowercases?: TMessage;
        uppercases?: TMessage;
        specials?: TMessage;
    };
}

function passwordPreset(options: IPasswordPresetOptions = {}): IPreset {
    const {errorMessages = {}} = options;

    const {generic, ...rest} = errorMessages;

    return {
        type: 'preset',
        name: 'passwordPreset',
        groupErrorMessages: {
            generic: generic || null
        },
        plugin: [
            spaceBlocker,
            spaceFilter,
            passwordValidator({
                minLength: 8,
                maxLength: 30,
                errorMessages: rest
            })
        ]
    };
}

export type {IPasswordPresetOptions};
export {passwordPreset};
