import type {IPreset, TRawMessage} from '../../../defines/common.types';
import {spaceBlocker} from '../../blockers';
import {spaceFilter} from '../../filters';
import {passwordValidator} from '../../validators';

interface IPasswordPresetOptions {
    errorMessages?: {
        generic?: TRawMessage;
        length?: TRawMessage;
        numbers?: TRawMessage;
        lowercases?: TRawMessage;
        uppercases?: TRawMessage;
        specials?: TRawMessage;
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
