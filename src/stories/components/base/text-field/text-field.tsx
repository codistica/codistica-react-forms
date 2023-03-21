import type {TextFieldProps as TBaseTextFieldProps} from '@mui/material';
import {TextField as BaseTextField} from '@mui/material';
import type {FC} from 'react';
import React, {Fragment} from 'react';
import type {IResolvedMessage, TStatus} from '../../../../defines/common.types';
import {useStyles} from './text-field.styles';

type TBaseProps = Omit<TBaseTextFieldProps, 'helperText'>;

interface IExtraProps {
    status: TStatus;
    messages: IResolvedMessage[];
}

type TTextFieldProps = TBaseProps & IExtraProps;

const TextField: FC<TTextFieldProps> = ({
    className,
    status,
    messages,
    ...rest
}) => {
    const {classes, cx} = useStyles({status});

    return (
        <BaseTextField
            {...rest}
            className={cx(classes.root, className)}
            helperText={messages.map((msg, i) => {
                return (
                    <Fragment key={i}>
                        <span>{msg.message}</span>
                        <br />
                    </Fragment>
                );
            })}
        />
    );
};

export type {TTextFieldProps};
export {TextField};
