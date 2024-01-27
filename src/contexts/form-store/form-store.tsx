import type {FC, ReactNode} from 'react';
import {createContext} from 'react';

const FormContext = createContext<{
    formInstance: null | Form;
}>({
    formInstance: null
});

interface IFormStoreProps {
    children: ReactNode;
}

const FormStore: FC<IFormStoreProps> = ({children}) => {
    return <FormContext.Provider>{children}</FormContext.Provider>;
};

export {FormContext, FormStore};
