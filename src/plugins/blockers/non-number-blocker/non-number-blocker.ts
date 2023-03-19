import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';

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
