import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';
import {REG_EXPS} from '../../../defines/reg-exps';

function lowercaseBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'lowercaseBlocker',
        plugin(e) {
            return REG_EXPS.LOW_LETTERS.test(e.key);
        }
    };
}

export {lowercaseBlocker};