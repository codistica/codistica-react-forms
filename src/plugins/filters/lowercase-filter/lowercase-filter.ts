import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
