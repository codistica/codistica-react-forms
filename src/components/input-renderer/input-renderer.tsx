import type {ChangeEvent, FocusEvent, KeyboardEvent, ReactNode} from 'react';
import React from 'react';
import type {
    IRunValidatorsOutput,
    TInputPlugin
} from '../../classes/plugin-manager/plugin-manager';
import {PluginManager} from '../../classes/plugin-manager/plugin-manager';
import type {
    IData,
    IMessageObject,
    IReport,
    TResult
} from '../../classes/validation-utils/validation-utils';
import {ValidationUtils} from '../../classes/validation-utils/validation-utils';
import {stringify} from '../../utils/stringify/stringify';
import type {Form} from '../form/form';
import {FormContext} from '../form/form';

interface IValidationObject {
    result: TResult;
    reports: {[k: string]: IReport};
    messages: Array<IMessageObject>;
    data: {[k: string]: IData};
}

type TStatus =
    | 'valid'
    | 'invalid'
    | 'highlight'
    | 'warning'
    | 'missing'
    | 'standBy'
    | null;

interface IInputProps {
    name: string;
    value: unknown;
    onKeyDown: (e: KeyboardEvent) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

interface IInputRendererAPI {
    status: TStatus;
    validationObject: IValidationObject;
    setNewValue: (value: string) => unknown;
    setIsInteracted: (value: boolean) => unknown;
}

type TInputRenderFn = (
    inputProps: IInputProps,
    inputRendererAPI: IInputRendererAPI
) => ReactNode;

type TStringifier = (v: unknown, type: 'validation' | 'form') => string;

interface IInputRendererProps {
    name: string;
    value: string;
    voidValue: string | null;
    booleanInput: boolean | null;
    mandatory: boolean;
    keepMissingStatus: boolean;
    runFiltersBeforeValidators: boolean;
    match: string | null;
    errorMessages: {
        mandatory?: string | null;
        match?: string | null;
    };
    plugins: TInputPlugin;
    stringifier: null | TStringifier;
    deferValidation: boolean;
    onValidationResult: null | ((...args: Array<unknown>) => unknown);
    onKeyDown: (e: KeyboardEvent) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    inputRenderFn: null | TInputRenderFn;
}

interface IState {
    value: unknown;
    status: TStatus;
    overrideStatus: TStatus | false;
}

class InputRenderer extends React.Component<IInputRendererProps, IState> {
    static contextType = FormContext;

    declare context: {
        formInstance: Form;
    };

    static defaultProps = {
        value: '',
        voidValue: '',
        booleanInput: null,
        mandatory: true,
        keepMissingStatus: false,
        runFiltersBeforeValidators: false,
        match: null,
        errorMessages: {
            mandatory: null,
            match: null
        },
        plugins: [],
        stringifier: stringify,
        deferValidation: true,
        onValidationResult: null,
        onKeyDown: null,
        onChange: null,
        onBlur: null
    };

    id: string;

    isInteracted: boolean;
    isVoid: boolean | null;
    isDeferred: boolean | null;
    isStandby: boolean | null;
    isMissing: boolean | null;
    isMatched: boolean | null;

    pluginManager: PluginManager;
    validatorsOutput: IRunValidatorsOutput;
    validationObject: IValidationObject;
    attachedPromises: Set<Promise<boolean>>;

    inputChangeTracker: string;

    constructor(props: IInputRendererProps) {
        super(props);

        this.id = this.props.name;

        this.isInteracted = false;

        this.isVoid = null;
        this.isDeferred = null;
        this.isStandby = null;
        this.isMissing = null;
        this.isMatched = null;

        this.pluginManager = new PluginManager();
        this.validatorsOutput = {};
        this.validationObject = {
            result: null,
            reports: {},
            messages: [],
            data: {}
        };
        this.attachedPromises = new Set();

        this.inputChangeTracker = props.value;

        this.state = {
            status: null,
            value: props.value,
            overrideStatus: false
        };

        this.pluginManager.loadPlugins(props.plugins);

        this.setNewValue = this.setNewValue.bind(this);
        this.setIsInteracted = this.setIsInteracted.bind(this);
        this.getValidationValue = this.getValidationValue.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.highlight = this.highlight.bind(this);
        this.warn = this.warn.bind(this);
        this.clear = this.clear.bind(this);
        this.emulateChange = this.emulateChange.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
    }

    componentDidMount() {
        // REGISTER INPUT
        if (this.context.formInstance) {
            this.context.formInstance.registerInput(this);
        }

        // VALIDATE INITIAL VALUE
        this.validateInput();

        // LINK INPUTS FOR SUCCESSIVE VALIDATIONS
        if (this.props.match && this.context.formInstance) {
            this.context.formInstance.linkInputs(
                this.props.name,
                this.props.match.replace(/^!/, '')
            );
        }
    }

    componentWillUnmount() {
        // UNLINK INPUT
        if (this.props.match && this.context.formInstance) {
            this.context.formInstance.unlinkInput(this.props.name);
        }

        // UNREGISTER INPUT
        if (this.context.formInstance) {
            this.context.formInstance.unregisterInput(this);
        }
    }

    setNewValue(value: string) {
        // SET NEW VALUE
        this.setState({value}, () => {
            // VALIDATE NEW VALUE
            this.validateInput();

            // REQUEST LINKED INPUTS VALIDATION
            if (this.context.formInstance) {
                this.context.formInstance.validateLinkedInputs(this.props.name);
            }
        });
    }

    setIsInteracted(value: boolean) {
        this.isInteracted = value;
    }

    getValidationValue() {
        if (typeof this.state.value !== 'string') {
            if (this.props.stringifier) {
                return this.props.stringifier(this.state.value, 'validation');
            } else {
                return stringify(this.state.value);
            }
        } else {
            return this.state.value;
        }
    }

    getFormValue(): string {
        if (typeof this.state.value !== 'string') {
            if (this.props.stringifier) {
                return this.props.stringifier(this.state.value, 'form');
            } else {
                return stringify(this.state.value);
            }
        } else {
            return this.state.value;
        }
    }

    checkMandatory() {
        this.isVoid = this.state.value === this.props.voidValue;
        return this.props.mandatory && this.isVoid;
    }

    validateInput(useLastValidatorsOutput?: boolean) {
        this.isDeferred = this.props.deferValidation && !this.isInteracted;
        this.isStandby = false;

        this.isMissing = this.checkMandatory();
        this.isMatched =
            this.context.formInstance &&
            this.context.formInstance.checkMatch(this.props.name);

        // RESET VALIDATION OBJECT
        this.validationObject.result = null;
        this.validationObject.reports = {};
        this.validationObject.messages = [];
        this.validationObject.data = {};

        if (this.isMissing) {
            // RESULT
            this.validationObject.result = false;
            // MESSAGES
            if (!this.isDeferred && this.props.errorMessages.mandatory) {
                this.validationObject.messages = [
                    ValidationUtils.createMessageObject(
                        this.props.errorMessages.mandatory
                    )
                ];
            }
        } else if (this.isMatched === false) {
            // RESULT
            this.validationObject.result = false;
            // MESSAGES
            if (!this.isDeferred && this.props.errorMessages.match) {
                this.validationObject.messages = [
                    ValidationUtils.createMessageObject(
                        this.props.errorMessages.match
                    )
                ];
            }
        } else {
            if (!useLastValidatorsOutput) {
                const validationValue = this.props.runFiltersBeforeValidators
                    ? this.pluginManager.runFilters(this.getValidationValue())
                    : this.getValidationValue();
                // RUN VALIDATORS
                this.validatorsOutput =
                    this.pluginManager.runValidators(validationValue);
            }

            for (const validatorName in this.validatorsOutput) {
                if (
                    !Object.hasOwnProperty.call(
                        this.validatorsOutput,
                        validatorName
                    )
                ) {
                    continue;
                }

                const validatorOutput = this.validatorsOutput[validatorName];

                // RESULT
                if (this.validationObject.result === null) {
                    this.validationObject.result = validatorOutput.result;
                } else if (
                    this.validationObject.result &&
                    validatorOutput.result !== null
                ) {
                    this.validationObject.result = validatorOutput.result;
                }

                // REPORTS
                this.validationObject.reports[validatorName] =
                    validatorOutput.report;

                // MESSAGES
                this.validationObject.messages = this.validationObject.messages
                    .concat(Object.values(validatorOutput.messages))
                    .sort(
                        (msgA, msgB) =>
                            (msgA.options.sortKey || 0) -
                            (msgB.options.sortKey || 0)
                    );

                // DATA
                this.validationObject.data[validatorName] =
                    validatorOutput.data;

                // PROMISES
                Object.values(validatorOutput.promises).forEach((promise) => {
                    if (promise.isPending) {
                        this.isStandby = true;
                        if (!this.attachedPromises.has(promise)) {
                            this.attachedPromises.add(promise);

                            promise
                                .then((shouldValidate) => {
                                    this.attachedPromises.delete(promise);
                                    if (shouldValidate) {
                                        this.validateInput(true);
                                    }
                                })
                                .catch(() => undefined);
                        }
                    }
                });
            }

            if (this.isStandby) {
                this.validationObject.result = false;
            }
        }

        if (this.context.formInstance) {
            this.context.formInstance.validateForm();
        }

        this.updateStatus();

        // EMIT VALIDATION RESULT
        if (this.props.onValidationResult) {
            this.props.onValidationResult({
                result: this.validationObject.result,
                reports: this.validationObject.reports,
                messages: this.validationObject.messages,
                data: this.validationObject.data
            });
        }
    }

    updateStatus() {
        if (this.isStandby) {
            this.setState({
                status: 'standBy'
            });
        } else if (this.isDeferred) {
            this.setState({
                status: null
            });
        } else if (this.isMissing) {
            this.setState({
                status:
                    (!this.props.deferValidation || this.isInteracted) &&
                    !this.props.keepMissingStatus
                        ? 'invalid'
                        : 'missing'
            });
        } else if (this.validationObject.result === null) {
            this.setState({
                status:
                    this.props.mandatory !== null && !this.isVoid
                        ? 'valid'
                        : null
            });
        } else {
            this.setState({
                status: this.validationObject.result ? 'valid' : 'invalid'
            });
        }
    }

    highlight(duration?: number) {
        if (!this.state.overrideStatus) {
            this.setState({
                overrideStatus: 'highlight'
            });
            setTimeout(() => {
                if (this.state.overrideStatus === 'highlight') {
                    this.setState({
                        overrideStatus: false
                    });
                }
            }, duration || 1000);
        }
    }

    warn(duration?: number) {
        if (!this.state.overrideStatus) {
            this.setState({
                overrideStatus: 'warning'
            });
            setTimeout(() => {
                if (this.state.overrideStatus === 'warning') {
                    this.setState({
                        overrideStatus: false
                    });
                }
            }, duration || 1000);
        }
    }

    clear() {
        this.isInteracted = false;
        this.inputChangeTracker = this.props.value;
        this.setNewValue(this.props.value);
    }

    emulateChange(inputElement: HTMLInputElement, value: string) {
        const valueDescriptor = Object.getOwnPropertyDescriptor(
            inputElement,
            'value'
        );

        const prototype = Object.getPrototypeOf(inputElement) as object | null;

        const prototypeValueDescriptor =
            prototype && Object.getOwnPropertyDescriptor(prototype, 'value');

        if (prototypeValueDescriptor && prototypeValueDescriptor.set) {
            prototypeValueDescriptor.set.call(inputElement, value);
        } else if (valueDescriptor && valueDescriptor.set) {
            valueDescriptor.set.call(inputElement, value);
        }

        inputElement.dispatchEvent(new Event('change', {bubbles: true}));
    }

    onKeyDownHandler(e: KeyboardEvent) {
        // CHAIN PASSED EVENT HANDLER IF NECESSARY
        if (typeof this.props.onKeyDown === 'function') {
            this.props.onKeyDown(e);
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
            if (this.pluginManager.runBlockers(e)) {
                e.preventDefault();
                this.highlight();
            }
        }
    }

    onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        // CHAIN PASSED EVENT HANDLER IF NECESSARY
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e);
        }

        // INDICATE THAT THERE HAS BEEN INTERACTION
        this.isInteracted = true;

        if (
            typeof this.props.booleanInput === 'boolean'
                ? this.props.booleanInput
                : e.target.type === 'checkbox'
        ) {
            this.setNewValue(e.target.checked ? 'true' : 'false');
        } else {
            this.setNewValue(e.target.value);
        }
    }

    onBlurHandler(e: FocusEvent<HTMLInputElement>) {
        // CHAIN PASSED EVENT HANDLER IF NECESSARY
        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(e);
        }

        // INDICATE THAT THERE HAS BEEN INTERACTION
        if (!this.isInteracted) {
            this.isInteracted = true;
            if (this.props.deferValidation) {
                this.validateInput();
            }
        }

        // IMITATE onChange EVENT REAL SPECIFICATION BEHAVIOR
        if (e.target.value !== this.inputChangeTracker) {
            // RESET inputChangeTracker
            this.inputChangeTracker = e.target.value;

            if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                return;
            }

            // RUN FILTERS
            const newValue = this.pluginManager.runFilters(e.target.value);

            if (newValue !== e.target.value) {
                // UPDATE inputChangeTracker
                this.inputChangeTracker = newValue;

                // EMULATE INPUT CHANGE
                this.emulateChange(e.target, newValue);

                this.highlight();
            }
        }
    }

    render() {
        const {
            name,
            value,
            voidValue,
            booleanInput,
            mandatory,
            keepMissingStatus,
            runFiltersBeforeValidators,
            match,
            errorMessages,
            plugins,
            stringifier,
            deferValidation,
            onValidationResult,
            onKeyDown,
            onChange,
            onBlur,
            inputRenderFn,
            ...other
        } = this.props;

        return (
            inputRenderFn &&
            inputRenderFn(
                {
                    ...other,
                    name,
                    value: this.state.value,
                    onKeyDown: this.onKeyDownHandler.bind(this),
                    onChange: this.onChangeHandler.bind(this),
                    onBlur: this.onBlurHandler.bind(this)
                },
                {
                    status: this.state.overrideStatus || this.state.status,
                    validationObject: this.validationObject,
                    setNewValue: this.setNewValue.bind(this),
                    setIsInteracted: this.setIsInteracted.bind(this)
                }
            )
        );
    }
}

export type {IInputRendererProps, IValidationObject, TInputPlugin, TStatus};
export {FormContext, InputRenderer};
