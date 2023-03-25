import type {FC} from 'react';
import {InputRenderer} from '../../../../components/input-renderer/input-renderer';
import type {TPlugin} from '../../../../defines/common.types';
import type {TCheckboxProps as TBaseCheckboxProps} from '../../base/checkbox/checkbox';
import {Checkbox as BaseCheckbox} from '../../base/checkbox/checkbox';

type TBaseProps = Omit<TBaseCheckboxProps, 'status' | 'messages' | 'checked'>;

interface IExtraProps {
    name: string;
    errorMessages?: {
        mandatory?: string | null;
        match?: string | null;
    };
    plugins?: TPlugin;
    required?: boolean;
}

type TTextFieldProps = TBaseProps & IExtraProps;

const Checkbox: FC<TTextFieldProps> = ({
    name,
    errorMessages,
    plugins,
    required,
    defaultChecked,
    ...rest
}) => {
    return (
        <InputRenderer
            name={name}
            value={defaultChecked ? 'true' : 'false'}
            voidValue={'false'}
            errorMessages={errorMessages}
            mandatory={required}
            plugins={plugins}
            inputRenderFn={(
                {value, ...inputProps},
                {status, validationObject}
            ) => {
                return (
                    <BaseCheckbox
                        {...rest}
                        {...inputProps}
                        checked={value === 'true'}
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
export {Checkbox};
