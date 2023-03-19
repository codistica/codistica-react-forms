import type {KeyboardEvent} from 'react';
import {flat, norm} from '../../utils/array-utils';
import type {
    IValidatorOutput,
    TRawMessage
} from '../validation-utils/validation-utils';
import {ValidationUtils} from '../validation-utils/validation-utils';

type TBlockerInstance = (e: KeyboardEvent) => boolean;
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
type TPluginWrapper = (options?: unknown) => TAllPlugins;

type TInputPlugin =
    | (TAllPlugins | TPluginWrapper)
    | Array<TAllPlugins | TPluginWrapper>;

interface IRunValidatorsOutput {
    [k: string]: IValidatorOutput;
}

function initializePlugin(
    plugin: TAllPlugins | TPluginWrapper
): TAllPlugins | null {
    if (typeof plugin === 'function') {
        const returnedValue = plugin();
        if (
            typeof returnedValue === 'object' &&
            returnedValue !== null &&
            returnedValue.type
        ) {
            return returnedValue;
        }
    } else if (typeof plugin === 'object' && plugin !== null && plugin.type) {
        return plugin;
    }
    return null;
}

function mergePlugins<TMergePlugin extends TAllPlugins>(
    ...pluginsArg: Array<TMergePlugin | Array<TMergePlugin>>
): Array<TMergePlugin> {
    const output: Array<TMergePlugin> = [];
    const outputMap = new Map<string, number>();

    pluginsArg.forEach((pluginArg) => {
        if (Array.isArray(pluginArg)) {
            pluginArg.forEach((plugin) => {
                const index = outputMap.get(plugin.name);

                if (typeof index === 'undefined') {
                    // ADD PLUGIN
                    outputMap.set(plugin.name, output.length);
                    output.push(plugin);
                } else {
                    // REPLACE PLUGIN
                    output[index] = plugin;
                }
            });
        } else {
            const plugin = pluginArg;
            const index = outputMap.get(plugin.name);

            if (typeof index === 'undefined') {
                // ADD PLUGIN
                outputMap.set(plugin.name, output.length);
                output.push(plugin);
            } else {
                // REPLACE PLUGIN
                output[index] = plugin;
            }
        }
    });

    return output;
}

function loadPlugins(plugins: TInputPlugin): {
    blockers: Array<IBlocker>;
    filters: Array<IFilter>;
    validators: Array<IValidator>;
} {
    const output: {
        blockers: Array<IBlocker>;
        filters: Array<IFilter>;
        validators: Array<IValidator>;
    } = {
        blockers: [],
        filters: [],
        validators: []
    };

    flat(norm(plugins)).forEach((plugin) => {
        const pluginObject = initializePlugin(plugin);

        if (!pluginObject) {
            return;
        }

        let presetOutput = null;

        switch (pluginObject.type) {
            case 'blocker':
                output.blockers.push(pluginObject);
                break;
            case 'filter':
                output.filters.push(pluginObject);
                break;
            case 'validator':
                output.validators.push(pluginObject);
                break;
            case 'preset':
                presetOutput = loadPlugins(pluginObject.plugin);
                output.blockers = output.blockers.concat(presetOutput.blockers);
                output.filters = output.filters.concat(presetOutput.filters);
                output.validators = output.validators.concat(
                    presetOutput.validators.map((validator) => {
                        validator.groupName = pluginObject.name;
                        validator.groupErrorMessages =
                            pluginObject.groupErrorMessages;
                        return validator;
                    })
                );
                break;
            default:
                break;
        }
    });

    return output;
}

function getNormalizedValidatorOutput(
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

class PluginManager {
    blockers: Array<IBlocker>;
    filters: Array<IFilter>;
    validators: Array<IValidator>;

    constructor() {
        this.blockers = [];
        this.filters = [];
        this.validators = [];

        this.runValidators = this.runValidators.bind(this);
        this.runFilters = this.runFilters.bind(this);
        this.runBlockers = this.runBlockers.bind(this);
        this.loadPlugins = this.loadPlugins.bind(this);
    }

    runValidators(
        stringValue: string,
        rawValue?: unknown
    ): IRunValidatorsOutput {
        const output: IRunValidatorsOutput = {};

        for (const validator of this.validators) {
            const validatorOutput = getNormalizedValidatorOutput(
                stringValue,
                rawValue,
                validator
            );

            output[validator.name] = validatorOutput;

            if (validatorOutput.result === false) {
                break;
            }
        }

        return output;
    }

    runFilters(value: string): string {
        return this.filters.reduce((acc, filter) => filter.plugin(acc), value);
    }

    runBlockers(e: KeyboardEvent): boolean {
        const isPrintable = e.key && e.key.length === 1;

        return this.blockers.some((blocker) => {
            return !!(isPrintable && blocker.plugin(e));
        });
    }

    loadPlugins(plugins: TInputPlugin) {
        const {blockers, filters, validators} = loadPlugins(plugins);
        this.blockers = mergePlugins<IBlocker>(this.blockers, blockers);
        this.filters = mergePlugins<IFilter>(this.filters, filters);
        this.validators = mergePlugins<IValidator>(this.validators, validators);
    }
}

export type {
    IBlocker,
    IFilter,
    IPreset,
    IRunValidatorsOutput,
    IValidator,
    TInputPlugin
};
export {PluginManager};
