import type {KeyboardEvent} from 'react';
import type {
    IBlocker,
    IFilter,
    IRunValidatorsOutput,
    IValidator,
    TInputPlugin
} from '../../defines/common.types';
import {breakdownPlugins} from './utils/breakdown-plugins/breakdown-plugins';
import {mergePlugins} from './utils/merge-plugins/merge-plugins';
import {runValidator} from './utils/run-validator/run-validator';

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
            const validatorOutput = runValidator(
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

    runBlockers(e: KeyboardEvent<HTMLInputElement>): boolean {
        const isPrintable = e.key && e.key.length === 1;

        return this.blockers.some((blocker) => {
            return !!(isPrintable && blocker.plugin(e));
        });
    }

    loadPlugins(plugins: TInputPlugin) {
        const {blockers, filters, validators} = breakdownPlugins(plugins);
        this.blockers = mergePlugins<IBlocker>(this.blockers, blockers);
        this.filters = mergePlugins<IFilter>(this.filters, filters);
        this.validators = mergePlugins<IValidator>(this.validators, validators);
    }
}

export {PluginManager};
