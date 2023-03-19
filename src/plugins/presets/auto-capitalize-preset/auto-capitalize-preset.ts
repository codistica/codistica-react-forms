import type {IPreset} from '../../../classes/plugin-manager/plugin-manager';
import {capitalizeFirstsFilter, uppercaseFilter} from '../../filters';

function autoCapitalizePreset(): IPreset {
    return {
        type: 'preset',
        name: 'autoCapitalizePreset',
        groupErrorMessages: {},
        plugin: [uppercaseFilter, capitalizeFirstsFilter]
    };
}

export {autoCapitalizePreset};
