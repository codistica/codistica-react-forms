import type {IResolvedMessage, TMessage} from '../../defines/common.types';

function createResolvedMessage(
    rawMessage: TMessage,
    params?: {[k: string]: unknown},
    options?: {sortIndex?: number}
): IResolvedMessage {
    let messageSource = null;
    let messageParams = {};
    let messageOptions = {};
    let outputMessage = null;
    let outputParams = {};
    let outputOptions = {};

    if (typeof rawMessage === 'string') {
        return {
            message: rawMessage,
            params: params || {},
            options: options || {}
        };
    }

    if (typeof rawMessage === 'object' && rawMessage !== null) {
        messageSource = rawMessage.message || null;
        messageParams = rawMessage.params || {};
        messageOptions = rawMessage.options || {};
    } else {
        messageSource = rawMessage;
    }

    outputParams = {
        ...(params || ({} as {[k: string]: unknown})),
        ...(messageParams as {[k: string]: unknown})
    };

    outputOptions = {
        ...(options || ({} as {[k: string]: unknown})),
        ...(messageOptions as {[k: string]: unknown})
    };

    if (typeof messageSource === 'function') {
        outputMessage = messageSource(outputParams);
    } else {
        outputMessage = messageSource;
    }

    return {
        message: outputMessage || '',
        params: outputParams,
        options: outputOptions
    };
}

export {createResolvedMessage};
