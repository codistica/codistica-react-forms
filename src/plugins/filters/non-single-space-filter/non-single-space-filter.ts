import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
