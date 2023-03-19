import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
