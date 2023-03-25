import type {OutlinedInputProps as TOutlinedInputProps} from '@mui/material';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import type {FC} from 'react';
import {useId} from 'react';
import type {TStatus} from '../../../../defines/common.types';
import {useStyles} from './text-field.styles';

type TBaseProps = Omit<TOutlinedInputProps, 'id' | 'classes' | 'error'>;

interface IExtraProps {
    label?: string;
    status?: TStatus;
    messages?: string[];
}

type TTextFieldProps = TBaseProps & IExtraProps;

const TextField: FC<TTextFieldProps> = ({
    label = '',
    status = null,
    messages = [],
    required = false,
    disabled = false,
    ...rest
}) => {
    const id = useId();

    const {classes} = useStyles({status});

    return (
        <FormControl
            error={status === 'invalid'}
            required={required}
            disabled={disabled}
        >
            <InputLabel htmlFor={id}>{label}</InputLabel>

            <OutlinedInput
                {...rest}
                id={id}
                label={label}
                classes={{
                    notchedOutline: classes.notchedOutline
                }}
            />

            {messages.map((msg, i) => {
                return <FormHelperText key={i}>{msg}</FormHelperText>;
            })}
        </FormControl>
    );
};

export type {TTextFieldProps};
export {TextField};
