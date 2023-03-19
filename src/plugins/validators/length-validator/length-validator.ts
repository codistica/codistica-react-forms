import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import type {IValidator, TRawMessage} from '../../../defines/common.types';

interface ILengthValidatorOptions {
    minLength?: number;
    maxLength?: number;
    errorMessages?: {
        generic?: TRawMessage;
        minLength?: TRawMessage;
        maxLength?: TRawMessage;
    };
}

function lengthValidator(options: ILengthValidatorOptions = {}): IValidator {
    const {minLength = 0, maxLength = Infinity, errorMessages = {}} = options;

    const utils = new ValidationUtils({
        keys: ['minLength', 'maxLength']
    });

    return {
        type: 'validator',
        name: 'lengthValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value) {
            utils.init(value, true);

            // CHECK MIN LENGTH
            if (value.length < minLength) {
                utils.invalidate('minLength', errorMessages.minLength, {
                    min: minLength
                });
            }

            // CHECK MAX LENGTH
            if (value.length > maxLength) {
                utils.invalidate('maxLength', errorMessages.maxLength, {
                    max: maxLength
                });
            }

            return utils.getOutput();
        }
    };
}

export type {ILengthValidatorOptions};
export {lengthValidator};
