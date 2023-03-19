import type {IValidator} from '../../../classes/plugin-manager/plugin-manager';
import type {TRawMessage} from '../../../classes/validation-utils/validation-utils';
import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';

interface IAsyncValidatorOptions {
    executor: (latestValue: string) => Promise<boolean | null>;
    enableDeferCache?: boolean;
    deferThrottlingDelay?: number | null;
    errorMessages?: {
        generic?: TRawMessage;
        executor?: TRawMessage;
    };
    successMessages?: {
        executor?: TRawMessage;
    };
    standByMessages?: {
        executor?: TRawMessage;
    };
}

function asyncValidator({
    executor,
    enableDeferCache = true,
    deferThrottlingDelay = 1000,
    errorMessages = {},
    successMessages = {},
    standByMessages = {}
}: IAsyncValidatorOptions): IValidator {
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

            return utils.getValidatorOutput();
        }
    };
}

export type {IAsyncValidatorOptions};
export {asyncValidator};
