import type {IPreset} from '../../../defines/common.types';
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
