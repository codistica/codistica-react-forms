import type {TStatus} from '../../../defines/common.types';

type TMUIColor = 'success' | 'error' | 'warning' | 'secondary' | 'primary';

function statusToColor(status: TStatus): TMUIColor {
    switch (status) {
        case 'valid':
            return 'success';
        case 'invalid':
            return 'error';
        case 'highlight':
            return 'secondary';
        case 'warning':
            return 'warning';
        case 'missing':
            return 'error';
        case 'standBy':
            return 'primary';
        default:
            return 'primary';
    }
}

export {statusToColor};
