import type {ChangeEvent, FocusEvent, KeyboardEvent, ReactNode} from 'react';
import type {IPromise} from '../utils/promise/promise';

type TStatus =
    | 'valid'
    | 'invalid'
    | 'highlight'
    | 'warning'
    | 'missing'
    | 'standBy'
    | null;

interface IMessageObject {
    message: string;
    params: {[k: string]: unknown};
    options: {
        sortKey?: number;
    };
}

interface IRawMessageObject {
    message?: string | ((data?: unknown) => string | null) | null;
    params?: {[k: string]: unknown};
    options?: {
        sortKey?: number;
    };
}

type TRawMessage =
    | string
    | ((data: unknown) => string | null)
    | IRawMessageObject
    | null;

type TResult = boolean | null;

interface IReport {
    [k: string]: TResult;
}

interface IMessages {
    [k: string]: IMessageObject;
}

interface IData {
    [k: string]: unknown;
}

interface IPromises {
    [k: string]: IPromise<boolean>;
}

interface IValidatorOutput {
    result: TResult;
    report: IReport;
    messages: IMessages;
    data: IData;
    promises: IPromises;
}

interface IDeferContext {
    invalidate: (
        rawMessage?: TRawMessage,
        params?: {[k: string]: unknown}
    ) => void;
    validate: (
        rawMessage?: TRawMessage,
        params?: {[k: string]: unknown}
    ) => void;
    disable: (
        rawMessage?: TRawMessage,
        params?: {[k: string]: unknown}
    ) => void;
    abort: () => void;
    isActive: () => boolean;
    updateValue: () => void;
}

type TDeferCache = Map<
    string,
    {
        result: TResult;
        rawMessage?: TRawMessage;
        params?: {[k: string]: unknown};
    }
>;

type TDeferCallback = (value: string, context: IDeferContext) => Promise<void>;

interface IOptions {
    keys?: Array<string>;
    enableDeferCache?: boolean;
    deferThrottlingDelay?: number | null;
}

type TBlockerInstance = (e: KeyboardEvent<HTMLInputElement>) => boolean;

interface IBlocker {
    type: 'blocker';
    name: string;
    plugin: TBlockerInstance;
}

type TFilterInstance = (value: string) => string;

interface IFilter {
    type: 'filter';
    name: string;
    plugin: TFilterInstance;
}

type TValidatorInstance =
    | string
    | RegExp
    | ((stringValue: string, rawValue?: unknown) => IValidatorOutput | boolean);

interface IValidator {
    type: 'validator';
    name: string;
    plugin: TValidatorInstance;
    groupName?: string;
    groupErrorMessages?: {[k: string]: TRawMessage | null};
    errorMessages?: {[k: string]: TRawMessage | null};
}

type TPresetInstance = TInputPlugin;

interface IPreset {
    type: 'preset';
    name: string;
    groupErrorMessages: {[k: string]: TRawMessage};
    plugin: TPresetInstance;
}

type TAllPlugins = IBlocker | IFilter | IValidator | IPreset;

type TPluginWrapper = (options?: {[k: string]: unknown}) => TAllPlugins;

type TInputPlugin =
    | (TAllPlugins | TPluginWrapper)
    | Array<TAllPlugins | TPluginWrapper>;

interface IRunValidatorsOutput {
    [k: string]: IValidatorOutput;
}

interface IFormProps {
    onValidationResult: null | TOnValidationHandler;
    onMount: null | ((...args: Array<unknown>) => unknown);
    children: ReactNode;
    style: {[k: string]: unknown};
    className: string;
    customStyles: {
        root: {[k: string]: unknown};
    };
    customClassNames: {
        root: string;
    };
    globalTheme: 'default' | string | null;
}

interface IDataPayload {
    [k: string]: string | Array<string>;
}

interface IFormIValidationObject {
    [k: string]: IValidationObject;
}

type TOnValidationHandler = (
    validationResult: boolean,
    dataPayload: IDataPayload,
    formIValidationObject: IFormIValidationObject
) => void;

interface IValidationObject {
    result: TResult;
    reports: {[k: string]: IReport};
    messages: Array<IMessageObject>;
    data: {[k: string]: IData};
}

interface IInputProps {
    name: string;
    value: unknown;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
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
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement> | Event) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    inputRenderFn: null | TInputRenderFn;
}

interface IState {
    value: unknown;
    status: TStatus;
    overrideStatus: TStatus | false;
}

export type {
    IBlocker,
    IData,
    IDataPayload,
    IDeferContext,
    IFilter,
    IFormIValidationObject,
    IFormProps,
    IInputProps,
    IInputRendererAPI,
    IInputRendererProps,
    IMessageObject,
    IMessages,
    IOptions,
    IPreset,
    IPromises,
    IRawMessageObject,
    IReport,
    IRunValidatorsOutput,
    IState,
    IValidationObject,
    IValidator,
    IValidatorOutput,
    TAllPlugins,
    TBlockerInstance,
    TDeferCache,
    TDeferCallback,
    TFilterInstance,
    TInputPlugin,
    TInputRenderFn,
    TOnValidationHandler,
    TPluginWrapper,
    TPresetInstance,
    TRawMessage,
    TResult,
    TStatus,
    TStringifier,
    TValidatorInstance
};
