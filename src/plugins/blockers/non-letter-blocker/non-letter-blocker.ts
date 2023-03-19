import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';
import {REG_EXPS} from '../../../defines/reg-exps';

function nonLetterBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'nonLetterBlocker',
        plugin(e) {
            return REG_EXPS.NON_LETTERS.test(e.key);
        }
    };
}

export {nonLetterBlocker};
