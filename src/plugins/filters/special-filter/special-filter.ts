import type {IFilter} from '../../../defines/common.types';
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
