import type {TStatus} from '../../../../defines/common.types';
import {makeStyles} from '../../../utils/make-styles/make-styles';
import {statusToColor} from '../../../utils/status-to-color/status-to-color';

interface IProps {
    status: TStatus;
}

const useStyles = makeStyles<IProps>()(({palette}, {status}) => {
    if (!status) {
        return {
            notchedOutline: {}
        };
    }

    const color = statusToColor(status);

    return {
        notchedOutline: {
            borderColor: palette[color].main + '!important',
            borderWidth: 2
        }
    };
});

export {useStyles};
