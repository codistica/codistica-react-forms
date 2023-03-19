import type {IValidator} from '../../../classes/plugin-manager/plugin-manager';
import type {TRawMessage} from '../../../classes/validation-utils/validation-utils';
import {ValidationUtils} from '../../../classes/validation-utils/validation-utils';
import {REG_EXPS} from '../../../defines/reg-exps';

interface IEmailValidatorOptions {
    username?: RegExp | null;
    domains?: Array<string | RegExp> | null;
    errorMessages?: {
        generic?: TRawMessage;
        format?: TRawMessage;
        username?: TRawMessage;
        domains?: TRawMessage;
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

            return utils.getValidatorOutput();
        }
    };
}

export type {IEmailValidatorOptions};
export {emailValidator};
