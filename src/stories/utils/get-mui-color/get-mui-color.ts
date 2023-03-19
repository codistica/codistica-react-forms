import type {TStatus} from '../../../defines/common.types';

type TMUIColor = 'success' | 'error' | 'warning' | 'secondary' | 'primary';

function getMUIColor(status: TStatus): TMUIColor {
    switch (status) {
        case 'valid':
            return 'success';
        case 'invalid':
            return 'error';
        case 'highlight':
            return 'secondary';
        case 'missing':
            return 'error';
        default:
            return 'primary';
    }
}

export {getMUIColor};
