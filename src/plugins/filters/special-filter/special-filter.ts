import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';
import {REG_EXPS} from '../../../defines/reg-exps';

function specialFilter(): IFilter {
    return {
        type: 'filter',
        name: 'specialFilter',
        plugin(value) {
            return value.replace(REG_EXPS.SPECIALS, '');
        }
    };
}

export {specialFilter};
