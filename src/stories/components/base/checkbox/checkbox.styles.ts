import type {TStatus} from '../../../../defines/common.types';
import {makeStyles} from '../../../utils/make-styles/make-styles';
import {statusToColor} from '../../../utils/status-to-color/status-to-color';

interface IProps {
    status: TStatus;
}

const useStyles = makeStyles<IProps>()(({palette}, {status}) => {
    if (!status) {
        return {
            root: {},
            checked: {}
        };
    }

    const color = statusToColor(status);

    return {
        root: {
            color: palette[color].light
        },
        checked: {
            color: palette[color].dark
        }
    };
});

export {useStyles};
