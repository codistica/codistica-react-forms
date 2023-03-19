import type {IFilter} from '../../../defines/common.types';

function nonNumberFilter(): IFilter {
    return {
        type: 'filter',
        name: 'nonNumberFilter',
        plugin(value) {
            return value.replace(/\D/g, '');
        }
    };
}

export {nonNumberFilter};
