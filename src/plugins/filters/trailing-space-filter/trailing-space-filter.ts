import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
