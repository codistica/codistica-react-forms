import type {IFilter} from '../../../defines/common.types';

function leadingSpaceFilter(): IFilter {
    return {
        type: 'filter',
        name: 'leadingSpaceFilter',
        plugin(value) {
            return value.replace(/^\s+/, '');
        }
    };
}

export {leadingSpaceFilter};
