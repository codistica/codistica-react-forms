import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import type {IValidator, TMessage} from '../../../defines/common.types';

interface IAsyncValidatorOptions {
    executor?: (latestValue: string) => Promise<boolean | null>;
    enableDeferCache?: boolean;
    deferThrottlingDelay?: number | null;
    errorMessages?: {
        generic?: TMessage;
        executor?: TMessage;
    };
    successMessages?: {
        executor?: TMessage;
    };
    standByMessages?: {
        executor?: TMessage;
    };
}

function asyncValidator(options: IAsyncValidatorOptions = {}): IValidator {
    const {
        executor = null,
        enableDeferCache = true,
        deferThrottlingDelay = 1000,
        errorMessages = {},
        successMessages = {},
        standByMessages = {}
    } = options;

    const utils = new ValidationUtils({
        keys: ['executor'],
        enableDeferCache,
        deferThrottlingDelay
    });

    return {
        type: 'validator',
        name: 'asyncValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value: string) {
            utils.init(value, null);

            if (!executor) {
                utils.disable('executor');
            } else {
                utils.defer(
                    'executor',
                    standByMessages.executor || null,
                    {
                        standBy: true
                    },
                    async (latestValue, context) => {
                        const result = await executor(latestValue);

                        if (result) {
                            context.validate(successMessages.executor, {
                                standBy: false
                            });
                        } else if (result === false) {
                            context.invalidate(errorMessages.executor, {
                                standBy: false
                            });
                        } else {
                            context.disable(null, {
                                standBy: false
                            });
                        }
                    }
                );
            }

            return utils.getOutput();
        }
    };
}

export type {IAsyncValidatorOptions};
export {asyncValidator};
