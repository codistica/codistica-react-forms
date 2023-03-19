import type {
    IDeferContext,
    IMessageObject,
    IMessages,
    IOptions,
    IReport,
    IValidatorOutput,
    TDeferCache,
    TDeferCallback,
    TRawMessage
} from '../../defines/common.types';
import type {THeartbeat} from '../../utils/create-heartbeat/create-heartbeat';
import {createHeartbeat} from '../../utils/create-heartbeat/create-heartbeat';
import {promise} from '../../utils/promise/promise';

class ValidationUtils {
    options: Required<IOptions>;

    value: string;
    previousValue: string | null;

    validatorOutput: IValidatorOutput;

    deferContexts: {[k: string]: IDeferContext};
    deferCaches: {[k: string]: TDeferCache};
    deferHeartbeats: {[k: string]: THeartbeat};

    constructor(options: IOptions = {}) {
        this.options = {
            keys: options.keys || [],
            enableDeferCache: options.enableDeferCache || false,
            deferThrottlingDelay: options.deferThrottlingDelay || null
        };

        this.value = '';
        this.previousValue = null;

        this.validatorOutput = {
            result: null,
            report: {},
            messages: {},
            data: {},
            promises: {}
        };

        this.deferContexts = {};
        this.deferCaches = {};
        this.deferHeartbeats = {};

        this.init = this.init.bind(this);
        this.invalidate = this.invalidate.bind(this);
        this.invalidateAll = this.invalidateAll.bind(this);
        this.validate = this.validate.bind(this);
        this.validateAll = this.validateAll.bind(this);
        this.disable = this.disable.bind(this);
        this.disableAll = this.disableAll.bind(this);
        this.defer = this.defer.bind(this);
        this.createDeferContext = this.createDeferContext.bind(this);
        this.isStandBy = this.isStandBy.bind(this);
        this.isValid = this.isValid.bind(this);
        this.setData = this.setData.bind(this);
        this.getOutput = this.getOutput.bind(this);
    }

    init(
        value: string,
        initialValidationStatus: boolean | null,
        rawMessages?: {[k: string]: TRawMessage},
        params?: {[k: string]: unknown}
    ) {
        this.value = value;

        this.validatorOutput.result = initialValidationStatus;

        this.validatorOutput.report = this.options.keys.reduce<IReport>(
            (acc, key) => {
                acc[key] = initialValidationStatus;
                return acc;
            },
            {}
        );

        if (rawMessages) {
            this.validatorOutput.messages = this.options.keys.reduce<IMessages>(
                (acc, key) => {
                    const rawMessage = rawMessages[key];

                    if (rawMessage) {
                        if (
                            typeof params === 'object' &&
                            params !== null &&
                            Object.hasOwnProperty.call(params, key)
                        ) {
                            acc[key] = ValidationUtils.createMessageObject(
                                rawMessage,
                                params[key] as {[k: string]: unknown}
                            );
                        } else {
                            acc[key] = ValidationUtils.createMessageObject(
                                rawMessage,
                                params
                            );
                        }
                    }
                    return acc;
                },
                {}
            );
        } else {
            this.validatorOutput.messages = {};
        }

        this.validatorOutput.data = {};
    }

    setKeyResult(
        key: string | undefined,
        result: boolean | null,
        rawMessage?: TRawMessage | null,
        params?: {[k: string]: unknown},
        noAbort?: boolean
    ) {
        if (key) {
            if (!noAbort && this.deferContexts[key]) {
                this.deferContexts[key].abort();
            }
            this.validatorOutput.report[key] = result;
            if (rawMessage) {
                this.validatorOutput.messages[key] =
                    ValidationUtils.createMessageObject(rawMessage, params);
            }
            this.updateResult();
        } else if (!this.options.keys.length) {
            this.validatorOutput.result = result;
        }
    }

    invalidate(
        key?: string,
        rawMessage?: TRawMessage,
        params?: {[k: string]: unknown}
    ) {
        this.setKeyResult(key, false, rawMessage, params);
    }

    invalidateAll(rawMessage?: TRawMessage, params?: {[k: string]: unknown}) {
        if (!this.options.keys.length) {
            this.validatorOutput.result = false;
        } else {
            this.options.keys.forEach((currentKey) =>
                this.setKeyResult(currentKey, false, rawMessage, params)
            );
        }
    }

    validate(
        key?: string,
        rawMessage?: TRawMessage,
        params?: {[k: string]: unknown}
    ) {
        this.setKeyResult(key, true, rawMessage, params);
    }

    validateAll(rawMessage?: TRawMessage, params?: {[k: string]: unknown}) {
        if (!this.options.keys.length) {
            this.validatorOutput.result = true;
        } else {
            this.options.keys.forEach((currentKey) =>
                this.setKeyResult(currentKey, true, rawMessage, params)
            );
        }
    }

    disable(
        key?: string,
        rawMessage?: TRawMessage,
        params?: {[k: string]: unknown}
    ) {
        this.setKeyResult(key, null, rawMessage, params);
    }

    disableAll(rawMessage?: TRawMessage, params?: {[k: string]: unknown}) {
        if (!this.options.keys.length) {
            this.validatorOutput.result = null;
        } else {
            this.options.keys.forEach((currentKey) =>
                this.setKeyResult(currentKey, null, rawMessage, params)
            );
        }
    }

    defer(
        key: string,
        rawMessage: TRawMessage | null,
        params: {[k: string]: unknown},
        callback: TDeferCallback,
        onAbort?: () => void
    ) {
        if (
            this.deferContexts[key] &&
            this.deferContexts[key].isActive() &&
            this.value === this.previousValue
        ) {
            this.setKeyResult(key, null, rawMessage, params, true);
            return;
        }

        if (this.deferContexts[key]) {
            this.deferContexts[key].abort();
        }

        if (
            this.options.enableDeferCache &&
            this.deferCaches[key] &&
            this.deferCaches[key].has(this.value)
        ) {
            const cache = this.deferCaches[key].get(this.value);

            if (!cache) {
                throw new Error();
            }

            if (cache.result) {
                this.validate(key, cache.rawMessage, cache.params);
            } else if (cache.result === false) {
                this.invalidate(key, cache.rawMessage, cache.params);
            } else {
                this.disable(key, cache.rawMessage, cache.params);
            }
        } else {
            if (this.options.enableDeferCache && !this.deferCaches[key]) {
                this.deferCaches[key] = new Map();
            }

            // CREATE VALIDATION PROMISE
            this.validatorOutput.promises[key] = promise((resolve) => {
                const context = this.createDeferContext(
                    key,
                    resolve,
                    this.deferCaches[key],
                    onAbort
                );

                this.deferContexts[key] = context;

                if (this.options.deferThrottlingDelay) {
                    // WITH THROTTLING
                    if (!this.deferHeartbeats[key]) {
                        this.deferHeartbeats[key] = createHeartbeat();
                    }
                    this.deferHeartbeats[key](() => {
                        context.updateValue();
                        void callback(this.value, context);
                    }, this.options.deferThrottlingDelay);
                } else {
                    // WITHOUT THROTTLING
                    void callback(this.value, context);
                }
            });

            this.setKeyResult(key, null, rawMessage, params, true);
        }
    }

    createDeferContext(
        key: string,
        resolve: (a: boolean) => void,
        cache?: TDeferCache,
        onAbort?: () => void
    ): IDeferContext {
        let isActive = true;
        let value = this.value;
        return {
            invalidate: (
                rawMessage?: TRawMessage,
                params?: {[k: string]: unknown}
            ) => {
                if (cache) {
                    cache.set(value, {
                        result: false,
                        rawMessage,
                        params
                    });
                }
                if (isActive) {
                    isActive = false;
                    this.invalidate(key, rawMessage, params);
                    resolve(true);
                    delete this.validatorOutput.promises[key];
                }
            },
            validate: (
                rawMessage?: TRawMessage,
                params?: {[k: string]: unknown}
            ) => {
                if (cache) {
                    cache.set(value, {
                        result: true,
                        rawMessage,
                        params
                    });
                }
                if (isActive) {
                    isActive = false;
                    this.validate(key, rawMessage, params);
                    resolve(true);
                    delete this.validatorOutput.promises[key];
                }
            },
            disable: (
                rawMessage?: TRawMessage,
                params?: {[k: string]: unknown}
            ) => {
                if (cache) {
                    cache.set(value, {
                        result: null,
                        rawMessage,
                        params
                    });
                }
                if (isActive) {
                    isActive = false;
                    this.disable(key, rawMessage, params);
                    resolve(true);
                    delete this.validatorOutput.promises[key];
                }
            },
            abort: () => {
                if (isActive) {
                    if (onAbort) {
                        onAbort();
                    }
                    isActive = false;
                    resolve(false);
                    delete this.validatorOutput.promises[key];
                }
            },
            isActive: () => isActive,
            updateValue: () => {
                value = this.value;
            }
        };
    }

    isStandBy() {
        return Object.values(this.deferContexts).some((context) => {
            return context.isActive();
        });
    }

    isValid(key?: string) {
        if (key) {
            return this.validatorOutput.report[key];
        }
        return this.validatorOutput.result;
    }

    setData(key: string, value: unknown) {
        this.validatorOutput.data[key] = value;
    }

    updateResult() {
        if (this.isStandBy()) {
            this.validatorOutput.result = null;
            return;
        }

        let result = null;
        for (const i in this.validatorOutput.report) {
            if (!Object.hasOwnProperty.call(this.validatorOutput.report, i)) {
                continue;
            }
            if (result === null) {
                result = this.validatorOutput.report[i];
            } else if (
                result === true &&
                this.validatorOutput.report[i] !== null
            ) {
                result = this.validatorOutput.report[i];
            }
            if (result === false) {
                break;
            }
        }

        this.validatorOutput.result = result;
    }

    getOutput(): IValidatorOutput {
        this.previousValue = this.value;
        return this.validatorOutput;
    }

    static createMessageObject(
        rawMessage: TRawMessage,
        params?: {[k: string]: unknown},
        options?: {sortKey?: number}
    ): IMessageObject {
        let messageSource = null;
        let messageParams = {};
        let messageOptions = {};
        let outputMessage = null;
        let outputParams = {};
        let outputOptions = {};

        if (typeof rawMessage === 'string') {
            return {
                message: rawMessage,
                params: params || {},
                options: options || {}
            };
        }

        if (typeof rawMessage === 'object' && rawMessage !== null) {
            messageSource = rawMessage.message || null;
            messageParams = rawMessage.params || {};
            messageOptions = rawMessage.options || {};
        } else {
            messageSource = rawMessage;
        }

        outputParams = {
            ...(params || ({} as {[k: string]: unknown})),
            ...(messageParams as {[k: string]: unknown})
        };

        outputOptions = {
            ...(options || ({} as {[k: string]: unknown})),
            ...(messageOptions as {[k: string]: unknown})
        };

        if (typeof messageSource === 'function') {
            outputMessage = messageSource(outputParams);
        } else {
            outputMessage = messageSource;
        }

        return {
            message: outputMessage || '',
            params: outputParams,
            options: outputOptions
        };
    }
}

export {ValidationUtils};
