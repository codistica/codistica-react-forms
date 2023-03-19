import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';
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
