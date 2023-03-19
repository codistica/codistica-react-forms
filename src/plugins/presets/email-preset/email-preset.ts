import type {IPreset, TMessage} from '../../../defines/common.types';
import {spaceBlocker} from '../../blockers';
import {spaceFilter, uppercaseFilter} from '../../filters';
import {emailValidator} from '../../validators';

interface IEmailPresetOptions {
    username?: RegExp | null;
    domains?: Array<string> | null;
    errorMessages?: {
        generic?: TMessage;
        format?: TMessage;
        username?: TMessage;
        domains?: TMessage;
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
