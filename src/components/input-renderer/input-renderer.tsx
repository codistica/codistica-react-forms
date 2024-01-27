import type {FC} from 'react';
import type {TInputRenderFn} from '../../defines/common.types';
import type {IInputProps} from '../../hooks/use-input/use-input';
import {useInput} from '../../hooks/use-input/use-input';

interface IInputRendererProps extends IInputProps {
    inputRenderFn: TInputRenderFn;
}

const InputRenderer: FC<IInputRendererProps> = ({
    inputRenderFn,
    ...options
}) => {
    const {bind, api} = useInput(options);

    return inputRenderFn(bind, api);
};

export type {IInputRendererProps};
export {InputRenderer};
