import type {IFilter} from '../../../defines/common.types';

function spaceFilter(): IFilter {
    return {
        type: 'filter',
        name: 'spaceFilter',
        plugin(value) {
            return value.replace(/ /g, '');
        }
    };
}

export {spaceFilter};
