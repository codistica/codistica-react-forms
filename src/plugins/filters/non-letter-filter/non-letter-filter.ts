import type {IFilter} from '../../../classes/plugin-manager/plugin-manager';
import {REG_EXPS} from '../../../defines/reg-exps';

function nonLetterFilter(): IFilter {
    return {
        type: 'filter',
        name: 'nonLetterFilter',
        plugin(value) {
            return value.replace(REG_EXPS.NON_LETTERS, '');
        }
    };
}

export {nonLetterFilter};
