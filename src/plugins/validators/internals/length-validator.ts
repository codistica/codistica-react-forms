import type {IValidator} from '../../../classes/plugin-manager/plugin-manager';
import type {TRawMessage} from '../../../classes/validation-utils/validation-utils';
import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';

interface ILengthValidatorOptions {
    minLength?: number;
    maxLength?: number;
    errorMessages?: {
        generic?: TRawMessage;
        minLength?: TRawMessage;
        maxLength?: TRawMessage;
    };
}

function lengthValidator({
    minLength = 0,
    maxLength = Infinity,
    errorMessages = {}
}: ILengthValidatorOptions): IValidator {
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
                utils.invalidate('minLength', errorMessages.minLength);
            }

            // CHECK MAX LENGTH
            if (value.length > maxLength) {
                utils.invalidate('maxLength', errorMessages.maxLength);
            }

            return utils.getValidatorOutput();
        }
    };
}

export type {ILengthValidatorOptions};
export {lengthValidator};
