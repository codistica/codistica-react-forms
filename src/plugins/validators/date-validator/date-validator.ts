import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import type {IValidator, TMessage} from '../../../defines/common.types';
import {toFullYear} from '../../../utils/date-utils';
import {parseIntAll} from '../../../utils/number-utils';
import {escape} from '../../../utils/reg-exp-utils';

interface IDateValidatorOptions {
    minDate?: Date | null;
    maxDate?: Date | null;
    minAge?: number | null;
    format?: [number, number, number];
    separator?: string | null;
    errorMessages?: {
        generic?: TMessage;
        minDate?: TMessage;
        maxDate?: TMessage;
        minAge?: TMessage;
        format?: TMessage;
        separator?: TMessage;
    };
}

function dateValidator(options: IDateValidatorOptions = {}): IValidator {
    const {
        minDate = null,
        maxDate = null,
        minAge = null,
        format = [31, 12, 9999],
        separator = null,
        errorMessages = {}
    } = options;

    const utils = new ValidationUtils({
        keys: ['minDate', 'maxDate', 'minAge', 'format', 'separator']
    });

    return {
        type: 'validator',
        name: 'dateValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value) {
            utils.init(value, true);
            utils.setData('interpretation', null);

            const today = new Date();

            const formatOrder = format.map((val) => {
                if (val > 31) {
                    return 'year';
                } else if (val > 12) {
                    return 'date';
                } else {
                    return 'month';
                }
            });

            const dateArray = parseIntAll(value) || [];

            const dateElements: {
                date: number | null;
                month: number | null;
                year: number | null;
            } = {
                date: null,
                month: null,
                year: null
            };

            // CHECK FORMAT
            if (dateArray.length !== format.length) {
                utils.invalidate('format', errorMessages.format);
            } else {
                formatOrder.forEach((key, index) => {
                    if (dateArray[index] > format[index]) {
                        utils.invalidate('format', errorMessages.format);
                    }

                    dateElements[key] = dateArray[index];
                });

                dateElements.year = toFullYear(dateElements.year as number);
                (dateElements.month as number)--;
            }

            if (!utils.isValid('format')) {
                utils.disable('minDate');
                utils.disable('maxDate');
                utils.disable('minAge');
                utils.disable('exists');
                utils.disable('separator');
            } else {
                // CHECK SEPARATOR
                if (separator !== null) {
                    if (
                        (value.match(new RegExp(escape(separator), 'g')) || [])
                            .length !==
                            format.length - 1 ||
                        (value.match(/\D/g) || []).length !== format.length - 1
                    ) {
                        utils.invalidate('separator', errorMessages.separator);
                    }
                }

                // PARSE DATE
                const parsedDate = new Date(
                    dateElements.year as number,
                    dateElements.month as number,
                    dateElements.date as number
                );

                // CHECK EXISTENCE
                if (
                    parsedDate.getFullYear() !== dateElements.year ||
                    parsedDate.getMonth() !== dateElements.month ||
                    parsedDate.getDate() !== dateElements.date
                ) {
                    utils.invalidate('exists');
                    utils.disable('minDate');
                    utils.disable('maxDate');
                    utils.disable('minAge');
                } else {
                    // SAVE INTERPRETATION
                    utils.setData('interpretation', parsedDate.toString());

                    // CHECK MIN DATE
                    if (minDate !== null && parsedDate < minDate) {
                        utils.invalidate('minDate', errorMessages.minDate);
                    }

                    // CHECK MAX DATE
                    if (maxDate !== null && parsedDate > maxDate) {
                        utils.invalidate('maxDate', errorMessages.maxDate);
                    }

                    // CHECK MIN AGE
                    if (minAge !== null) {
                        const ahead = new Date(parsedDate.getTime());

                        ahead.setFullYear(parsedDate.getFullYear() + minAge);

                        if (ahead > today) {
                            utils.invalidate('minAge', errorMessages.minAge);
                        }
                    }
                }
            }

            return utils.getOutput();
        }
    };
}

export type {IDateValidatorOptions};
export {dateValidator};
