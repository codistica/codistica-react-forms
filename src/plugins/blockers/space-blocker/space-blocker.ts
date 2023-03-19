import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';

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
