import type {FC} from 'react';
import {InputRenderer} from '../../../../components/input-renderer/input-renderer';
import type {TPlugin} from '../../../../defines/common.types';
import type {TTextFieldProps as TBaseTextFieldProps} from '../../base/text-field/text-field';
import {TextField as BaseTextField} from '../../base/text-field/text-field';

type TBaseProps = Omit<TBaseTextFieldProps, 'error' | 'status' | 'messages'>;

interface IExtraProps {
    name: string;
    errorMessages: {
        mandatory?: string | null;
        match?: string | null;
    };
    plugins: TPlugin;
    required?: boolean;
}

type TTextFieldProps = TBaseProps & IExtraProps;

const TextField: FC<TTextFieldProps> = ({
    name,
    errorMessages,
    plugins,
    required,
    ...rest
}) => {
    return (
        <InputRenderer
            name={name}
            errorMessages={errorMessages}
            mandatory={required}
            plugins={plugins}
            inputRenderFn={(inputProps, {status, validationObject}) => {
                return (
                    <BaseTextField
                        {...rest}
                        {...inputProps}
                        required={required}
                        error={status === 'invalid'}
                        status={status}
                        messages={validationObject.messages}
                    />
                );
            }}
        />
    );
};

export type {TTextFieldProps};
export {TextField};
