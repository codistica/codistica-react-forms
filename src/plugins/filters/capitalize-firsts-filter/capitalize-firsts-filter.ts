import type {IFilter} from '../../../defines/common.types';
import {REG_EXPS} from '../../../defines/reg-exps';

function capitalizeFirstsFilter(): IFilter {
    return {
        type: 'filter',
        name: 'capitalizeFirstFilter',
        plugin(value) {
            return value.replace(REG_EXPS.FIRST_LETTERS, (chr) => {
                return chr.toUpperCase();
            });
        }
    };
}

export {capitalizeFirstsFilter};
