import type {IPreset} from '../../../defines/common.types';
import {
    leadingSpaceBlocker,
    nonLetterBlocker,
    nonSingleSpaceBlocker
} from '../../blockers';
import {
    capitalizeFirstsFilter,
    leadingSpaceFilter,
    nonLetterFilter,
    nonSingleSpaceFilter,
    trailingSpaceFilter,
    uppercaseFilter
} from '../../filters';

function prettifyPreset(): IPreset {
    return {
        type: 'preset',
        name: 'prettifyPreset',
        groupErrorMessages: {},
        plugin: [
            nonSingleSpaceBlocker,
            leadingSpaceBlocker,
            nonLetterBlocker,
            nonSingleSpaceFilter,
            trailingSpaceFilter,
            leadingSpaceFilter,
            uppercaseFilter,
            capitalizeFirstsFilter,
            nonLetterFilter
        ]
    };
}

export {prettifyPreset};
