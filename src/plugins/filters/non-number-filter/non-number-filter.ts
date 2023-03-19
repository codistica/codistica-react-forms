import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
