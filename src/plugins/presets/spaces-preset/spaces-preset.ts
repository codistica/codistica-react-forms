import type {IPreset} from '../../../classes/plugin-manager/plugin-manager';
import {leadingSpaceBlocker, nonSingleSpaceBlocker} from '../../blockers';
import {
    leadingSpaceFilter,
    nonSingleSpaceFilter,
    trailingSpaceFilter
} from '../../filters';

function spacesPreset(): IPreset {
    return {
        type: 'preset',
        name: 'spacesPreset',
        groupErrorMessages: {},
        plugin: [
            leadingSpaceBlocker,
            nonSingleSpaceBlocker,
            leadingSpaceFilter,
            nonSingleSpaceFilter,
            trailingSpaceFilter
        ]
    };
}

export {spacesPreset};
