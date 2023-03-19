import type {IFilter} from '../../../defines/common.types';

function lowercaseFilter(): IFilter {
    return {
        type: 'filter',
        name: 'lowercaseFilter',
        plugin(value) {
            return value.toUpperCase();
        }
    };
}

export {lowercaseFilter};
