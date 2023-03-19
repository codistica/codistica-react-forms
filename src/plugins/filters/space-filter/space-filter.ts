import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';

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
