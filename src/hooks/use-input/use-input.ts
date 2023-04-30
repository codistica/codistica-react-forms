import type {FocusEvent, KeyboardEvent} from 'react';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {PluginManager} from '../../classes/plugin-manager/plugin-manager';
import {FormContext} from '../../components/form/form';
import type {
    IInputProps,
    IInputRendererAPI,
    IResolvedMessage,
    IValidationData,
    IValidationObject,
    IValidationReport,
    IValidatorOutput,
    TChangeEvent,
    TPlugin,
    TStatus,
    TStringifier,
    TTargetElement
} from '../../defines/common.types';
import {createResolvedMessage} from '../../utils/create-resolved-message/create-resolved-message';
import {stringify} from '../../utils/stringify/stringify';

interface IValidation extends IValidationObject {
    isStandBy: boolean;
    isDeferred: boolean;
    isVoid: boolean;
    isMissing: boolean;
}

type TOnKeyDownHandler = (e: KeyboardEvent<TTargetElement>) => void;
type TOnChangeHandler = (e: TChangeEvent<TTargetElement> | Event) => void;
type TOnBlurHandler = (e: FocusEvent<TTargetElement>) => void;

interface IOptions {
    name: string;
    value?: string;
    defaultValue?: string;
    voidValue?: string;
    mandatory?: boolean;
    keepMissingStatus?: boolean;
    runFiltersBeforeValidators?: boolean;
    match?: string;
    errorMessages?: {
        mandatory?: string;
        match?: string;
    };
    plugins?: TPlugin;
    stringifier?: TStringifier;
    deferValidation?: boolean;
    onValidationResult?: (...args: Array<unknown>) => unknown;
    onKeyDown?: TOnKeyDownHandler;
    onChange?: TOnChangeHandler;
    onBlur?: TOnBlurHandler;
}

interface IReturn {
    bind: IInputProps;
    api: IInputRendererAPI;
}

function useInput({
    name,
    value: externalValue = undefined,
    defaultValue = '',
    voidValue = '',
    mandatory = true,
    keepMissingStatus = false,
    runFiltersBeforeValidators = false,
    match = undefined,
    errorMessages = {},
    plugins = [],
    stringifier = stringify,
    deferValidation = true,
    onValidationResult = undefined,
    onKeyDown = undefined,
    onChange = undefined,
    onBlur = undefined
}: IOptions): IReturn {
    const {formInstance} = useContext(FormContext);

    const [value, setValue] = useState<unknown>(defaultValue);
    const [isTouched, setIsTouched] = useState<boolean>(false);

    const validatorsOutputRef = useRef<{[k: string]: IValidatorOutput}>({});
    const syntheticEventRef = useRef<Event | null>(null);
    const inputChangeTrackerRef = useRef<unknown>(value);

    const getValue = useCallback<(context: 'validation' | 'form') => string>(
        (context) => {
            if (typeof value !== 'string') {
                return stringifier(value, context);
            } else {
                return value;
            }
        },
        [stringifier, value]
    );

    const checkMandatory = useCallback<() => boolean>(() => {
        const isVoid = getValue('validation') === voidValue;

        return mandatory && isVoid;
    }, [getValue, mandatory, voidValue]);

    const pluginManager = useMemo<PluginManager>(() => {
        return new PluginManager();
    }, []);

    useMemo(() => {
        pluginManager.loadPlugins(plugins);
    }, [pluginManager, plugins]);

    const attachedPromises = useMemo<Set<Promise<boolean>>>(() => {
        return new Set();
    }, []);

    const getValidation = useCallback<
        (
            revalidate?: (useLastValidatorsOutput?: boolean) => void,
            useLastValidatorsOutput?: boolean
        ) => IValidation
    >(
        (revalidate, useLastValidatorsOutput = false) => {
            const isDeferred = deferValidation && !isTouched;

            let isStandBy = false;

            const isMissing = checkMandatory();
            const isMatched = formInstance && formInstance.checkMatch(name);

            // RESET VALIDATION OBJECT
            let result = null;
            let messages: IResolvedMessage[] = [];

            const reports: {[k: string]: IValidationReport} = {};
            const data: {[k: string]: IValidationData} = {};

            if (isMissing) {
                // RESULT
                result = false;

                // MESSAGES
                if (!isDeferred && errorMessages.mandatory) {
                    messages = [createResolvedMessage(errorMessages.mandatory)];
                }
            } else if (isMatched === false) {
                // RESULT
                result = false;

                // MESSAGES
                if (!isDeferred && errorMessages.match) {
                    messages = [createResolvedMessage(errorMessages.match)];
                }
            } else {
                if (!useLastValidatorsOutput) {
                    const validationValue = runFiltersBeforeValidators
                        ? pluginManager.runFilters(getValue('validation'))
                        : getValue('validation');

                    // RUN VALIDATORS
                    validatorsOutputRef.current =
                        pluginManager.runValidators(validationValue);
                }

                for (const validatorName in validatorsOutputRef.current) {
                    if (
                        !Object.hasOwnProperty.call(
                            validatorsOutputRef.current,
                            validatorName
                        )
                    ) {
                        continue;
                    }

                    const validatorOutput =
                        validatorsOutputRef.current[validatorName];

                    // RESULT
                    if (result === null) {
                        result = validatorOutput.result;
                    } else if (result && validatorOutput.result !== null) {
                        result = validatorOutput.result;
                    }

                    // REPORTS
                    reports[validatorName] = validatorOutput.report;

                    // MESSAGES
                    messages = messages
                        .concat(Object.values(validatorOutput.messages))
                        .sort(
                            (msgA, msgB) =>
                                (msgA.options.sortIndex || 0) -
                                (msgB.options.sortIndex || 0)
                        );

                    // DATA
                    data[validatorName] = validatorOutput.data;

                    // PROMISES
                    Object.values(validatorOutput.promises).forEach(
                        (promise) => {
                            if (promise.isPending) {
                                isStandBy = true;

                                if (!attachedPromises.has(promise)) {
                                    attachedPromises.add(promise);

                                    promise
                                        .then((shouldValidate) => {
                                            attachedPromises.delete(promise);

                                            if (shouldValidate && revalidate) {
                                                revalidate(true);
                                            }
                                        })
                                        .catch(() => undefined);
                                }
                            }
                        }
                    );
                }

                if (isStandBy) {
                    result = false;
                }
            }

            if (formInstance) {
                formInstance.validateForm();
            }

            // TODO: CHECK/REMOVE
            // this.updateStatus();

            const output = {
                result: typeof result === 'boolean' ? result : true,
                reports,
                messages,
                data,
                isStandBy,
                isDeferred,
                isVoid: value === voidValue,
                isMissing
            };

            // EMIT VALIDATION RESULT
            if (onValidationResult) {
                onValidationResult(output);
            }

            return output;
        },
        [
            attachedPromises,
            checkMandatory,
            deferValidation,
            errorMessages.mandatory,
            errorMessages.match,
            formInstance,
            getValue,
            isTouched,
            name,
            onValidationResult,
            pluginManager,
            runFiltersBeforeValidators,
            value,
            voidValue
        ]
    );

    const [validation, setValidation] = useState<IValidation>(() => {
        if (deferValidation) {
            const isVoid = value === voidValue;

            return {
                result: null,
                reports: {},
                messages: [],
                data: {},
                isStandBy: false,
                isDeferred: !isTouched,
                isVoid,
                isMissing: isVoid && mandatory
            };
        } else {
            return getValidation();
        }
    });

    const validate = useCallback<() => void>(() => {
        (function revalidate(useLastValidatorsOutput?: boolean) {
            setValidation(getValidation(revalidate, useLastValidatorsOutput));
        })();
    }, [getValidation]);

    const [overrideStatus, setOverrideStatus] = useState<TStatus | false>(
        false
    );

    const setNewValue = useCallback<(newValue: unknown) => void>((newValue) => {
        // TODO: CHECK/REMOVE
        // newValue: unknown,
        // emulateChange?: boolean,
        // inputElement?: TTargetElement

        setValue(newValue);

        // TODO: CHECK/REMOVE
        // if (emulateChange && inputElement) {
        //     this.syntheticEvent = new Event('change', {bubbles: true});
        //
        //     inputElement.dispatchEvent(this.syntheticEvent);
        // }
        //
        // // VALIDATE NEW VALUE
        // this.validateInput();
        //
        // // REQUEST LINKED INPUTS VALIDATION
        // if (formInstance) {
        //     formInstance.validateLinkedInputs(name);
        // }
    }, []);

    useEffect(() => {
        // VALIDATE NEW VALUE
        validate();

        // REQUEST LINKED INPUTS VALIDATION
        if (formInstance) {
            formInstance.validateLinkedInputs(name);
        }
    }, [formInstance, name, validate, value]);

    const highlight = useCallback<(duration?: number) => void>(
        (duration) => {
            if (!overrideStatus) {
                setOverrideStatus('highlight');

                setTimeout(() => {
                    setOverrideStatus((prevState) => {
                        if (prevState === 'highlight') {
                            return false;
                        } else {
                            return prevState;
                        }
                    });
                }, duration || 1000);
            }
        },
        [overrideStatus]
    );

    const warn = useCallback<(duration?: number) => void>(
        (duration) => {
            if (!overrideStatus) {
                setOverrideStatus('warning');

                setTimeout(() => {
                    setOverrideStatus((prevState) => {
                        if (prevState === 'warning') {
                            return false;
                        } else {
                            return prevState;
                        }
                    });
                }, duration || 1000);
            }
        },
        [overrideStatus]
    );

    const clear = useCallback<() => void>(() => {
        setIsTouched(false);
        inputChangeTrackerRef.current = defaultValue;
        setNewValue(defaultValue);
    }, [defaultValue, setNewValue]);

    const status = useMemo<TStatus>(() => {
        if (validation.isStandBy) {
            return 'standBy';
        } else if (validation.isDeferred) {
            return null;
        } else if (validation.isMissing) {
            return (!deferValidation || isTouched) && !keepMissingStatus
                ? 'invalid'
                : 'missing';
        } else if (validation.result === null) {
            return mandatory !== null && !validation.isVoid ? 'valid' : null;
        } else {
            return validation.result ? 'valid' : 'invalid';
        }
    }, [
        deferValidation,
        isTouched,
        keepMissingStatus,
        mandatory,
        validation.isDeferred,
        validation.isMissing,
        validation.isStandBy,
        validation.isVoid,
        validation.result
    ]);

    const onKeyDownHandler = useCallback<TOnKeyDownHandler>(
        (e) => {
            // CHAIN PASSED EVENT HANDLER IF NECESSARY
            if (onKeyDown) {
                onKeyDown(e);
            }

            if (!e.target) {
                return;
            }

            if ('type' in e.target) {
                if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                    return;
                }
            }

            if (!('tagName' in e.target)) {
                return;
            } else if ((e.target.tagName as string).toLowerCase() !== 'input') {
                return;
            }

            if (e.metaKey || e.ctrlKey || e.altKey) {
                return;
            }

            if (e.cancelable) {
                // RUN BLOCKERS
                if (pluginManager.runBlockers(e)) {
                    e.preventDefault();
                    highlight();
                }
            }
        },
        [highlight, onKeyDown, pluginManager]
    );

    const onChangeHandler = useCallback<TOnChangeHandler>(
        (e) => {
            // CHAIN PASSED EVENT HANDLER IF NECESSARY
            if (onChange) {
                onChange(e);
            }

            if (e === syntheticEventRef.current) {
                syntheticEventRef.current = null;
                return;
            }

            const {target} = e as TChangeEvent<TTargetElement>;

            // INDICATE THAT THERE HAS BEEN INTERACTION
            setIsTouched(true);

            if ('type' in target && target.type === 'checkbox') {
                setNewValue(
                    'checked' in target && target.checked ? 'true' : 'false'
                );
            } else {
                setNewValue(target.value);
            }
        },
        [onChange, setNewValue]
    );

    const onBlurHandler = useCallback<TOnBlurHandler>(
        (e) => {
            // CHAIN PASSED EVENT HANDLER IF NECESSARY
            if (onBlur) {
                onBlur(e);
            }

            // INDICATE THAT THERE HAS BEEN INTERACTION
            if (!isTouched) {
                setIsTouched(true);

                if (deferValidation) {
                    validate();
                }
            }

            // IMITATE onChange EVENT REAL SPECIFICATION BEHAVIOR
            if (e.target.value !== inputChangeTrackerRef.current) {
                // RESET inputChangeTracker
                inputChangeTrackerRef.current = e.target.value;

                if ('type' in e.target) {
                    if (
                        e.target.type === 'checkbox' ||
                        e.target.type === 'radio'
                    ) {
                        return;
                    }
                }

                // RUN FILTERS
                const newValue = pluginManager.runFilters(
                    typeof e.target.value === 'string'
                        ? e.target.value
                        : stringifier(e.target.value, 'validation')
                );

                if (newValue !== e.target.value) {
                    // UPDATE inputChangeTracker
                    inputChangeTrackerRef.current = newValue;

                    // INDICATE THAT THERE HAS BEEN INTERACTION
                    setIsTouched(true);

                    // TODO: CHECK/REMOVE
                    // setNewValue(newValue, true, e.target);

                    setNewValue(newValue);

                    highlight();
                }
            }
        },
        [
            deferValidation,
            highlight,
            isTouched,
            onBlur,
            pluginManager,
            setNewValue,
            stringifier,
            validate
        ]
    );

    // TODO: REMOVE
    const legacyInputRef = useRef({
        id: name,
        props: {
            name,
            match
        },
        validateInput: validate,
        getValidationValue: getValue.bind(null, 'validation'),
        getFormValue: getValue.bind(null, 'form'),
        validationObject: {
            result: validation.result,
            reports: validation.reports,
            messages: validation.messages,
            data: validation.data
        },
        isInteracted: isTouched,
        warn,
        clear
    });

    // TODO: REMOVE
    useMemo(() => {
        legacyInputRef.current.id = name;
        legacyInputRef.current.props.name = name;
        legacyInputRef.current.props.match = match;
        legacyInputRef.current.validateInput = validate;
        legacyInputRef.current.getValidationValue = getValue.bind(
            null,
            'validation'
        );
        legacyInputRef.current.getFormValue = getValue.bind(null, 'form');
        legacyInputRef.current.validationObject.result = validation.result;
        legacyInputRef.current.validationObject.reports = validation.reports;
        legacyInputRef.current.validationObject.messages = validation.messages;
        legacyInputRef.current.validationObject.data = validation.data;
        legacyInputRef.current.isInteracted = isTouched;
        legacyInputRef.current.warn = warn;
        legacyInputRef.current.clear = clear;
    }, [
        clear,
        getValue,
        isTouched,
        match,
        name,
        validate,
        validation.data,
        validation.messages,
        validation.reports,
        validation.result,
        warn
    ]);

    useEffect(() => {
        const ref = legacyInputRef.current;

        // REGISTER INPUT
        if (formInstance) {
            formInstance.registerInput(ref);
        }

        // TODO: CHECK/REMOVE
        // VALIDATE INITIAL VALUE
        // validateInput();

        // LINK INPUTS FOR SUCCESSIVE VALIDATIONS
        if (match && formInstance) {
            formInstance.linkInputs(name, match.replace(/^!/, ''));
        }

        return () => {
            // UNLINK INPUT
            if (match && formInstance) {
                formInstance.unlinkInput(name);
            }

            // UNREGISTER INPUT
            if (formInstance) {
                formInstance.unregisterInput(ref);
            }
        };
    }, [formInstance, match, name]);

    return {
        bind: {
            name,
            value: typeof externalValue !== 'undefined' ? externalValue : value,
            onKeyDown: onKeyDownHandler,
            onChange: onChangeHandler,
            onBlur: onBlurHandler
        },
        api: {
            status: overrideStatus ? overrideStatus : status,
            validationObject: validation,
            setNewValue: setValue,
            setIsInteracted: setIsTouched,
            highlight,
            warn,
            clear
        }
    };
}

export type {IOptions};
export {useInput};
