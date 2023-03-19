import type {IPreset} from '../../../defines/common.types';
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
