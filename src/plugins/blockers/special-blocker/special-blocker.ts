import type {IBlocker} from '../../../defines/common.types';
import {REG_EXPS} from '../../../defines/reg-exps';

function specialBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'specialBlocker',
        plugin(e) {
            return REG_EXPS.SPECIALS.test(e.key);
        }
    };
}

export {specialBlocker};
