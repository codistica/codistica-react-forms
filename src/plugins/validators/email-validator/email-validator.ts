import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import type {IValidator, TMessage} from '../../../defines/common.types';
import {REG_EXPS} from '../../../defines/reg-exps';

interface IEmailValidatorOptions {
    username?: RegExp | null;
    domains?: Array<string | RegExp> | null;
    errorMessages?: {
        generic?: TMessage;
        format?: TMessage;
        username?: TMessage;
        domains?: TMessage;
    };
}

function emailValidator(options: IEmailValidatorOptions = {}): IValidator {
    const {username = null, domains = null, errorMessages = {}} = options;

    const utils = new ValidationUtils({
        keys: ['format', 'username', 'domain']
    });

    return {
        type: 'validator',
        name: 'emailValidator',
        errorMessages: {
            generic: errorMessages.generic || null
        },
        plugin(value) {
            utils.init(value, true);

            if (!REG_EXPS.IS_EMAIL.test(value)) {
                utils.invalidate('format', errorMessages.format);
                utils.disable('username');
                utils.disable('domain');
            } else {
                const usernameMatch = (value.match(/.+(?=@)/) || [])[0] || null;
                const domainMatch = (value.match(/[^@]+$/) || [])[0] || null;

                if (username) {
                    if (!usernameMatch || !username.test(usernameMatch)) {
                        utils.invalidate('username', errorMessages.username);
                    }
                }

                if (domains) {
                    if (!domainMatch) {
                        utils.invalidate('domains', errorMessages.domains);
                    } else {
                        const result = domains.some((allowedDomain) => {
                            if (typeof allowedDomain === 'string') {
                                return allowedDomain === domainMatch;
                            } else {
                                return allowedDomain.test(domainMatch);
                            }
                        });

                        if (!result) {
                            utils.invalidate('domains', errorMessages.domains);
                        }
                    }
                }
            }

            return utils.getOutput();
        }
    };
}

export type {IEmailValidatorOptions};
export {emailValidator};
