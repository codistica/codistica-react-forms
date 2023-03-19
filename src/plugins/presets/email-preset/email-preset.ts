import type {IPreset} from '../../../classes/plugin-manager/plugin-manager';
import type {TRawMessage} from '../../../classes/validation-utils/validation-utils';
import {spaceBlocker} from '../../blockers';
import {spaceFilter, uppercaseFilter} from '../../filters';
import {emailValidator} from '../../validators';

interface IEmailPresetOptions {
    username?: RegExp | null;
    domains?: Array<string> | null;
    errorMessages?: {
        generic?: TRawMessage;
        format?: TRawMessage;
        username?: TRawMessage;
        domains?: TRawMessage;
    };
}

function emailPreset(options: IEmailPresetOptions = {}): IPreset {
    const {username = null, domains = null, errorMessages = {}} = options;

    const {generic, ...rest} = errorMessages;

    return {
        type: 'preset',
        name: 'emailPreset',
        groupErrorMessages: {
            generic: generic || null
        },
        plugin: [
            spaceBlocker,
            spaceFilter,
            uppercaseFilter,
            emailValidator({
                username,
                domains,
                errorMessages: rest
            })
        ]
    };
}

export type {IEmailPresetOptions};
export {emailPreset};
