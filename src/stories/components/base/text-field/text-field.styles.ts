import type {TStatus} from '../../../../defines/common.types';
import {makeStyles} from '../../../utils/make-styles/make-styles';

interface IProps {
    status: TStatus;
}

const useStyles = makeStyles<IProps>()(({palette}, {status}) => {
    switch (status) {
        case 'valid':
            return {
                root: {
                    '& input + fieldset': {
                        borderColor: palette.success.main + '!important',
                        borderWidth: 2
                    },
                    '& input:focus + fieldset': {
                        borderLeftWidth: 6,
                        padding: ['4px', '!important']
                    }
                }
            };
        case 'invalid':
            return {
                root: {
                    '& input + fieldset': {
                        borderColor: palette.error.main + '!important',
                        borderWidth: 2
                    }
                }
            };
        case 'highlight':
            return {
                root: {
                    '& input + fieldset': {
                        borderColor: palette.warning.main + '!important',
                        borderWidth: 2
                    }
                }
            };
        case 'missing':
            return {
                root: {
                    '& input + fieldset': {
                        borderColor: palette.warning.main + '!important',
                        borderWidth: 2
                    }
                }
            };
        default:
            return {
                root: {}
            };
    }
});

export {useStyles};
