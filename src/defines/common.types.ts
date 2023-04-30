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

interface IUnknownTarget extends HTMLElement {
    value: unknown;
}

type TTargetElement =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLButtonElement
    | IUnknownTarget;

type TChangeEvent<T> = ChangeEvent<T>;

interface IResolvedMessage {
    message: string;
    params: {[k: string]: unknown};
    options: {
        sortIndex?: number;
    };
}

interface IMessageObject {
    message?: string | ((params?: unknown) => string | null) | null;
    params?: {[k: string]: unknown};
    options?: {
        sortIndex?: number;
    };
}

type TMessage =
    | string
    | ((params: unknown) => string | null)
    | IMessageObject
    | null;

type TValidationResult = boolean | null;

interface IValidationReport {
    [k: string]: TValidationResult;
}

interface IValidationData {
    [k: string]: unknown;
}

interface IValidatorOutput {
    result: TValidationResult;
    report: IValidationReport;
    messages: {[k: string]: IResolvedMessage};
    data: IValidationData;
    promises: {[k: string]: IPromise<boolean>};
}

interface IDeferContext {
    invalidate: (
        rawMessage?: TMessage,
        params?: {[k: string]: unknown}
    ) => void;
    validate: (rawMessage?: TMessage, params?: {[k: string]: unknown}) => void;
    disable: (rawMessage?: TMessage, params?: {[k: string]: unknown}) => void;
    abort: () => void;
    isActive: () => boolean;
    updateValue: () => void;
}

type TDeferCache = Map<
    string,
    {
        result: TValidationResult;
        rawMessage?: TMessage;
        params?: {[k: string]: unknown};
    }
>;

type TDeferCallback = (value: string, context: IDeferContext) => Promise<void>;

interface IValidationUtilsOptions {
    keys?: Array<string>;
    enableDeferCache?: boolean;
    deferThrottlingDelay?: number | null;
}

interface IBlocker {
    type: 'blocker';
    name: string;
    plugin: (e: KeyboardEvent<TTargetElement>) => boolean;
}

interface IFilter {
    type: 'filter';
    name: string;
    plugin: (value: string) => string;
}

interface IValidator {
    type: 'validator';
    name: string;
    plugin:
        | string
        | RegExp
        | ((
              stringValue: string,
              rawValue?: unknown
          ) => IValidatorOutput | boolean);
    groupName?: string;
    groupErrorMessages?: {[k: string]: TMessage | null};
    errorMessages?: {[k: string]: TMessage | null};
}

interface IPreset {
    type: 'preset';
    name: string;
    groupErrorMessages: {[k: string]: TMessage};
    plugin: TPlugin;
}

type TPluginCore = IBlocker | IFilter | IValidator | IPreset;

type TPluginWrapper = (options?: {[k: string]: unknown}) => TPluginCore;

type TPlugin =
    | (TPluginCore | TPluginWrapper)
    | Array<TPluginCore | TPluginWrapper>;

interface IFormPayload {
    [k: string]: string | Array<string>;
}

interface IFormValidationObject {
    [k: string]: IValidationObject;
}

type TOnValidationHandler = (
    validationResult: boolean,
    dataPayload: IFormPayload,
    formValidationObject: IFormValidationObject
) => void;

interface IValidationObject {
    result: TValidationResult;
    reports: {[k: string]: IValidationReport};
    messages: Array<IResolvedMessage>;
    data: {[k: string]: IValidationData};
}

interface IInputProps {
    name: string;
    value: unknown;
    onKeyDown: (e: KeyboardEvent<TTargetElement>) => void;
    onChange: (e: TChangeEvent<TTargetElement>) => void;
    onBlur: (e: FocusEvent<TTargetElement>) => void;
}

interface IInputRendererAPI {
    status: TStatus;
    validationObject: IValidationObject;
    setNewValue: (value: string) => unknown;
    setIsInteracted: (value: boolean) => unknown;
    highlight: (duration: number) => void;
    warn: (duration: number) => void;
    clear: () => void;
}

type TInputRenderFn = (
    inputProps: IInputProps,
    inputRendererAPI: IInputRendererAPI
) => ReactNode;

type TStringifier = (v: unknown, type: 'validation' | 'form') => string;

export type {
    IBlocker,
    IDeferContext,
    IFilter,
    IFormPayload,
    IFormValidationObject,
    IInputProps,
    IInputRendererAPI,
    IMessageObject,
    IPreset,
    IResolvedMessage,
    IUnknownTarget,
    IValidationData,
    IValidationObject,
    IValidationReport,
    IValidationUtilsOptions,
    IValidator,
    IValidatorOutput,
    TChangeEvent,
    TDeferCache,
    TDeferCallback,
    TInputRenderFn,
    TMessage,
    TOnValidationHandler,
    TPlugin,
    TPluginCore,
    TPluginWrapper,
    TStatus,
    TStringifier,
    TTargetElement,
    TValidationResult
};
