import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
