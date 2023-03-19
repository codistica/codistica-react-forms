import type {IBlocker} from '../../../defines/common.types';
import {REG_EXPS} from '../../../defines/reg-exps';

function uppercaseBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'uppercaseBlocker',
        plugin(e) {
            return REG_EXPS.UP_LETTERS.test(e.key);
        }
    };
}

export {uppercaseBlocker};
