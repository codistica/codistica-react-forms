import type {
    IValidator,
    IValidatorOutput
} from '../../../../defines/common.types';
import {ValidationUtils} from '../../../validation-utils/validation-utils';

function runValidator(
    stringValue: string,
    rawValue: unknown | undefined,
    validator: IValidator
): IValidatorOutput {
    let validatorOutput: IValidatorOutput = {
        result: true,
        report: {},
        messages: {},
        data: {},
        promises: {}
    };

    if (typeof validator.plugin === 'function') {
        const fnOutput = validator.plugin(stringValue, rawValue);

        if (typeof fnOutput === 'boolean' || fnOutput === null) {
            validatorOutput.result = fnOutput;
        } else {
            validatorOutput = fnOutput;
        }
    } else if (typeof validator.plugin === 'string') {
        validatorOutput.result = validator.plugin === stringValue;
    } else if (validator.plugin) {
        validatorOutput.result = validator.plugin.test(stringValue);
    }

    if (validatorOutput.result === false) {
        // ADD PLUGIN OBJECT ERROR MESSAGES
        if (validator.errorMessages) {
            for (const i in validator.errorMessages) {
                if (!Object.hasOwnProperty.call(validator.errorMessages, i)) {
                    continue;
                }
                if (validator.errorMessages[i]) {
                    validatorOutput.messages[i] =
                        ValidationUtils.createMessageObject(
                            validator.errorMessages[i],
                            undefined,
                            {
                                sortKey: -1
                            }
                        );
                }
            }
        }

        // ADD PLUGIN OBJECT GROUP ERROR MESSAGES
        if (validator.groupErrorMessages) {
            for (const i in validator.groupErrorMessages) {
                if (
                    !Object.hasOwnProperty.call(validator.groupErrorMessages, i)
                ) {
                    continue;
                }
                if (validator.groupErrorMessages[i]) {
                    validatorOutput.messages[i] =
                        ValidationUtils.createMessageObject(
                            validator.groupErrorMessages[i],
                            undefined,
                            {
                                sortKey: -1
                            }
                        );
                }
            }
        }
    }

    return validatorOutput;
}

export {runValidator};
