import type {IFilter} from '../../../defines/common.types';

function nonSingleSpaceFilter(): IFilter {
    return {
        type: 'filter',
        name: 'nonSingleSpaceFilter',
        plugin(value) {
            return value.replace(/\s{2,}/g, ' ');
        }
    };
}

export {nonSingleSpaceFilter};
