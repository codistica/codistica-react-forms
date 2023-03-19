import type {TPluginCore} from '../../defines/common.types';

function mergePlugins<TMergePlugin extends TPluginCore>(
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

export {mergePlugins};
