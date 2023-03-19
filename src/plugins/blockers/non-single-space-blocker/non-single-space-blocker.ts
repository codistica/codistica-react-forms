import type {IBlocker} from '../../../classes/plugin-manager/plugin-manager';

function nonSingleSpaceBlocker(): IBlocker {
    return {
        type: 'blocker',
        name: 'nonSingleSpaceBlocker',
        plugin(e) {
            if ('value' in e.target && 'selectionStart' in e.target) {
                const value = e.target.value as string;
                const selectionStart = e.target.selectionStart as number;

                const isCurrentSpace = / /g.test(e.key);
                const isPreviousSpace = /\s/g.test(value[selectionStart - 1]);
                const noTrailingCaret = selectionStart < value.length;

                if (isCurrentSpace) {
                    if (isPreviousSpace) {
                        return true;
                    } else if (noTrailingCaret) {
                        return /\s/g.test(value[selectionStart]);
                    }
                }
            }

            return false;
        }
    };
}

export {nonSingleSpaceBlocker};
