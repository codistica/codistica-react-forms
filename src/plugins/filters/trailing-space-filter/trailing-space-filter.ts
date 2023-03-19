import type {IFilter} from '../../../defines/common.types';

function trailingSpaceFilter(): IFilter {
    return {
        type: 'filter',
        name: 'trailingSpaceFilter',
        plugin(value) {
            return value.replace(/\s+$/, '');
        }
    };
}

export {trailingSpaceFilter};
