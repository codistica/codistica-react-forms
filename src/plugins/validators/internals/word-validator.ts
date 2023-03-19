import type {IValidator} from '../../../classes/plugin-manager/plugin-manager';
import type {TRawMessage} from '../../../classes/validation-utils/validation-utils';
import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';

interface IWordValidatorOptions {
    valid?: Array<string>;
    invalid?: Array<string>;
    errorMessages?: {
        generic?: TRawMessage;
    };
}

function wordValidator({
    valid = [],
    invalid = [],
    errorMessages = {}
}: IWordValidatorOptions): IValidator {
    const utils = new ValidationUtils();

    return {
        type: 'validator',
        name: 'wordValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value) {
            utils.init(value, null);

            if (valid.some((word) => value === word)) {
                utils.validate();
            } else if (invalid.some((word) => value === word)) {
                utils.invalidate();
            }

            return utils.getValidatorOutput();
        }
    };
}

export type {IWordValidatorOptions};
export {wordValidator};
