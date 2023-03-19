import type {
    IBlocker,
    IFilter,
    IValidator,
    TInputPlugin
} from '../../../../defines/common.types';
import {flat, norm} from '../../../../utils/array-utils';
import {initializePlugin} from '../initialize-plugin/initialize-plugin';

function breakdownPlugins(plugins: TInputPlugin): {
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
                presetOutput = breakdownPlugins(pluginObject.plugin);
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

export {breakdownPlugins};
