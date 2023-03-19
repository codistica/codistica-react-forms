import type {TextFieldProps} from '@mui/material';
import {TextField} from '@mui/material';
import type {FC} from 'react';
import {Fragment} from 'react';
import type {TInputPlugin} from '../../../classes/plugin-manager/plugin-manager';
import {InputRenderer} from '../../../components/input-renderer/input-renderer';
import {getMUIColor} from '../../utils/get-mui-color/get-mui-color';

interface IMuiTextFieldProps {
    name: string;
    errorMessages: {
        mandatory?: string | null;
        match?: string | null;
    };
    plugins: TInputPlugin;
}

const MuiTextField: FC<
    IMuiTextFieldProps & Omit<TextFieldProps, 'error' | 'color'>
> = ({name, errorMessages, plugins, required, ...rest}) => {
    return (
        <InputRenderer
            name={name}
            errorMessages={errorMessages}
            mandatory={required}
            plugins={plugins}
            inputRenderFn={(inputProps, {status, validationObject}) => {
                return (
                    <TextField
                        {...rest}
                        {...inputProps}
                        required={required}
                        error={status === 'invalid'}
                        color={getMUIColor(status)}
                        helperText={validationObject.messages.map((msg, i) => {
                            return (
                                <Fragment key={i}>
                                    <span>{msg.message}</span>
                                    <br />
                                </Fragment>
                            );
                        })}
                    />
                );
            }}
        />
    );
};

export type {IMuiTextFieldProps};
export {MuiTextField};
