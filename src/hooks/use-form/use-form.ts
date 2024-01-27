import type {HTMLAttributes, ReactNode} from 'react';
import type {TOnValidationHandler} from '../../defines/common.types';

interface IFormProps extends HTMLAttributes<HTMLFormElement> {
    onValidationResult: null | TOnValidationHandler;
    onMount: null | ((formAPI: Form) => void);
    children: ReactNode;
}

interface IFormControls {}

function useForm({}: IFormProps) {}

export {useForm};
