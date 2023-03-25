import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import type {IValidator, TMessage} from '../../../defines/common.types';

interface IWordValidatorOptions {
    valid?: Array<string>;
    invalid?: Array<string>;
    errorMessages?: {
        generic?: TMessage;
    };
}

function wordValidator(options: IWordValidatorOptions = {}): IValidator {
    const {valid = [], invalid = [], errorMessages = {}} = options;

    const utils = new ValidationUtils();

    return {
        type: 'validator',
        name: 'wordValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value) {
            utils.init(value, null);

            if (invalid.length) {
                if (invalid.some((word) => value === word)) {
                    utils.invalidate();
                } else {
                    utils.validate();
                }
            }

            if (valid.length) {
                if (valid.some((word) => value === word)) {
                    utils.validate();
                } else {
                    utils.invalidate();
                }
            }

            return utils.getOutput();
        }
    };
}

export type {IWordValidatorOptions};
export {wordValidator};
