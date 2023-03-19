import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';

function leadingSpaceBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'leadingSpaceBlocker',
        plugin(e) {
            if ('selectionStart' in e.target && e.target.selectionStart === 0) {
                return / /g.test(e.key);
            } else {
                return false;
            }
        }
    };
}

export {leadingSpaceBlocker};
