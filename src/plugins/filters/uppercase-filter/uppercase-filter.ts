import type {IFilter} from '../../../defines/common.types';

function uppercaseFilter(): IFilter {
    return {
        type: 'filter',
        name: 'uppercaseFilter',
        plugin(value) {
            return value.toLowerCase();
        }
    };
}

export {uppercaseFilter};
