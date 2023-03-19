import type {TPluginCore, TPluginWrapper} from '../../defines/common.types';

function initializePlugin(
    plugin: TPluginCore | TPluginWrapper
): TPluginCore | null {
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

export {initializePlugin};
