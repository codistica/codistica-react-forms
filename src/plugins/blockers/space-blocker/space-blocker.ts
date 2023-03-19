import type {IBlocker} from '../../../defines/common.types';

function spaceBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'spaceBlocker',
        plugin(e) {
            return / /g.test(e.key);
        }
    };
}

export {spaceBlocker};
