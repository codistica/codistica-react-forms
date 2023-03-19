import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import type {IValidator, TRawMessage} from '../../../defines/common.types';
import {REG_EXPS} from '../../../defines/reg-exps';

interface IPasswordValidatorOptions {
    minLength?: number;
    maxLength?: number;
    numbers?: number;
    lowercases?: number;
    uppercases?: number;
    specials?: number;
    errorMessages?: {
        generic?: TRawMessage;
        length?: TRawMessage;
        numbers?: TRawMessage;
        lowercases?: TRawMessage;
        uppercases?: TRawMessage;
        specials?: TRawMessage;
    };
}

function passwordValidator(
    options: IPasswordValidatorOptions = {}
): IValidator {
    const {
        minLength = 0,
        maxLength = Infinity,
        numbers = 1,
        lowercases = 1,
        uppercases = 1,
        specials = 1,
        errorMessages = {}
    } = options;

    const utils = new ValidationUtils({
        keys: ['length', 'numbers', 'lowercases', 'uppercases', 'specials']
    });

    return {
        type: 'validator',
        name: 'passwordValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value) {
            utils.init(value, true);

            let strength = 5;

            // CHECK LENGTH
            if (value.length < minLength || value.length > maxLength) {
                utils.invalidate('length', errorMessages.length, {
                    min: minLength,
                    max: maxLength,
                    current: value.length
                });
                strength--;
            }

            // CHECK NUMBERS
            const currentNumbers = (value.match(/\d/g) || []).length;
            if (currentNumbers < numbers) {
                utils.invalidate('numbers', errorMessages.numbers, {
                    min: numbers,
                    current: currentNumbers
                });
                strength--;
            }

            // CHECK LOWERCASES
            const currentLowercases = (value.match(/[a-z]/g) || []).length;
            if (currentLowercases < lowercases) {
                utils.invalidate('lowercases', errorMessages.lowercases, {
                    min: lowercases,
                    current: currentLowercases
                });
                strength--;
            }

            // CHECK UPPERCASES
            const currentUppercases = (value.match(/[A-Z]/g) || []).length;
            if (currentUppercases < uppercases) {
                utils.invalidate('uppercases', errorMessages.uppercases, {
                    min: uppercases,
                    current: currentUppercases
                });
                strength--;
            }

            // CHECK SPECIALS
            const currentSpecials = (value.match(REG_EXPS.SPECIALS) || [])
                .length;
            if (currentSpecials < specials) {
                utils.invalidate('specials', errorMessages.specials, {
                    min: specials,
                    current: currentSpecials
                });
                strength--;
            }

            utils.setData('strength', strength);

            return utils.getOutput();
        }
    };
}

export type {IPasswordValidatorOptions};
export {passwordValidator};
