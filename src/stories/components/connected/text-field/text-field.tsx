import type {FC} from 'react';
import {InputRenderer} from '../../../../components/input-renderer/input-renderer';
import type {TPlugin} from '../../../../defines/common.types';
import type {TTextFieldProps as TBaseTextFieldProps} from '../../base/text-field/text-field';
import {TextField as BaseTextField} from '../../base/text-field/text-field';

type TBaseProps = Omit<TBaseTextFieldProps, 'status' | 'messages'>;

interface IExtraProps {
    name: string;
    defaultValue?: string;
    errorMessages?: {
        mandatory?: string | null;
        match?: string | null;
    };
    plugins?: TPlugin;
    required?: boolean;
}

type TTextFieldProps = TBaseProps & IExtraProps;

const TextField: FC<TTextFieldProps> = ({
    name,
    errorMessages,
    plugins,
    required,
    defaultValue,
    ...rest
}) => {
    return (
        <InputRenderer
            name={name}
            value={defaultValue}
            errorMessages={errorMessages}
            mandatory={required}
            plugins={plugins}
            inputRenderFn={(inputProps, {status, validationObject}) => {
                return (
                    <BaseTextField
                        {...rest}
                        {...inputProps}
                        required={required}
                        status={status}
                        messages={validationObject.messages.map(
                            ({message}) => message
                        )}
                    />
                );
            }}
        />
    );
};

export type {TTextFieldProps};
export {TextField};
