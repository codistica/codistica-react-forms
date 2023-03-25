import type {CheckboxProps as TBaseCheckboxProps} from '@mui/material';
import {
    Checkbox as BaseCheckbox,
    FormControl,
    FormControlLabel,
    FormHelperText
} from '@mui/material';
import type {FC} from 'react';
import type {TStatus} from '../../../../defines/common.types';
import {useStyles} from './checkbox.styles';

type TBaseProps = Omit<TBaseCheckboxProps, 'classes'>;

interface IExtraProps {
    label?: string;
    status?: TStatus;
    messages?: string[];
}

type TCheckboxProps = TBaseProps & IExtraProps;

const Checkbox: FC<TCheckboxProps> = ({
    label = '',
    status = null,
    messages = [],
    required = false,
    disabled = false,
    ...rest
}) => {
    const {classes} = useStyles({status});

    return (
        <FormControl
            error={status === 'invalid'}
            required={required}
            disabled={disabled}
        >
            <FormControlLabel
                label={label}
                control={
                    <BaseCheckbox
                        {...rest}
                        classes={{
                            root: classes.root,
                            checked: classes.checked
                        }}
                    />
                }
            />

            {messages.map((msg, i) => (
                <FormHelperText key={i}>{msg}</FormHelperText>
            ))}
        </FormControl>
    );
};

export type {TCheckboxProps};
export {Checkbox};
