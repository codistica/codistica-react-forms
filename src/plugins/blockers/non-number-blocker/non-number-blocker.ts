import type {IBlocker} from '../../../defines/common.types';

function nonNumberBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'nonNumberBlocker',
        plugin(e) {
            return /\D/g.test(e.key);
        }
    };
}

export {nonNumberBlocker};
