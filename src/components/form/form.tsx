import type {ReactNode} from 'react';
import React, {createContext} from 'react';
import type {
    IValidationObject,
    InputRenderer
} from '../input-renderer/input-renderer';
import {testIDs} from './defines/test-ids';

// TODO: REVIEW ALL TYPINGS

interface IDataPayload {
    [k: string]: string | Array<string>;
}

interface IFormIValidationObject {
    [k: string]: IValidationObject;
}

type TOnValidationHandler = (
    validationResult: boolean,
    dataPayload: IDataPayload,
    formIValidationObject: IFormIValidationObject
) => void;

interface IProps {
    onValidationResult: null | TOnValidationHandler;
    onMount: null | ((...args: Array<unknown>) => unknown);
    children: ReactNode;
    style: {[k: string]: unknown};
    className: string;
    customStyles: {
        root: {[k: string]: unknown};
    };
    customClassNames: {
        root: string;
    };
    globalTheme: 'default' | string | null;
}

const FormContext = createContext<{
    formInstance: null | Form;
}>({
    formInstance: null
});

class Form extends React.Component<IProps> {
    static defaultProps = {
        onValidationResult: null,
        onMount: null,
        children: null,
        style: {},
        className: '',
        customStyles: {},
        customClassNames: {},
        globalTheme: 'default'
    };

    registeredInputs: {[k: string]: InputRenderer};

    validationResult: boolean;
    dataPayload: IDataPayload;
    formIValidationObject: IFormIValidationObject;

    linkedInputsMap: Map<string, Set<string>>;

    formRef: {
        current: null | HTMLFormElement;
    };

    FormContextValue: {
        formInstance: Form;
    };

    constructor(props: IProps) {
        super(props);

        this.registeredInputs = {};

        this.validationResult = false;
        this.dataPayload = {};
        this.formIValidationObject = {};

        this.linkedInputsMap = new Map();

        this.formRef = {
            current: null
        };

        // BIND METHODS
        this.registerInput = this.registerInput.bind(this);
        this.unregisterInput = this.unregisterInput.bind(this);
        this.linkInputs = this.linkInputs.bind(this);
        this.unlinkInput = this.unlinkInput.bind(this);
        this.validateLinkedInputs = this.validateLinkedInputs.bind(this);
        this.checkMatch = this.checkMatch.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.warnInvalids = this.warnInvalids.bind(this);
        this.clear = this.clear.bind(this);
        this.getInputElementByName = this.getInputElementByName.bind(this);
        this.getInputByName = this.getInputByName.bind(this);

        this.FormContextValue = {
            formInstance: this
        };
    }

    componentDidMount() {
        if (this.props.onMount) {
            this.props.onMount(this);
        }
    }

    registerInput(input: InputRenderer) {
        if (this.getInputByName(input.props.name)) {
            console.warn('registerInput() - INPUT ALREADY REGISTERED');
        }
        this.registeredInputs[input.id] = input;
    }

    unregisterInput(input: InputRenderer) {
        delete this.registeredInputs[input.id];
    }

    linkInputs(...inputsNames: Array<string>) {
        inputsNames.forEach((inputNameA, indexA) => {
            const linkedInputsSet =
                this.linkedInputsMap.get(inputNameA) || new Set();
            inputsNames.forEach((inputNameB, indexB) => {
                if (indexB !== indexA) {
                    linkedInputsSet.add(inputNameB);
                }
            });
            this.linkedInputsMap.set(inputNameA, linkedInputsSet);
        });
    }

    unlinkInput(inputName: string) {
        this.linkedInputsMap.forEach((linkedInputsSet, currentInputName) => {
            if (currentInputName !== inputName) {
                linkedInputsSet.delete(inputName);
            }
        });
        this.linkedInputsMap.delete(inputName);
    }

    validateLinkedInputs(inputName: string, ignore?: Set<string>) {
        const ignoreSet = ignore || new Set();
        const linkedInputsSet = this.linkedInputsMap.get(inputName);

        if (linkedInputsSet) {
            if (!ignoreSet.size) {
                // DO NOT VALIDATE AGAIN FIRST REQUESTER INPUT
                ignoreSet.add(inputName);
            }

            linkedInputsSet.forEach((linkedInputName) => {
                const linkedInput = this.getInputByName(linkedInputName);

                if (linkedInput && !ignoreSet.has(linkedInputName)) {
                    ignoreSet.add(linkedInputName);

                    linkedInput.validateInput();

                    this.validateLinkedInputs(
                        linkedInput.props.name,
                        ignoreSet
                    );
                }
            });
        }
    }

    checkMatch(inputName: string) {
        const result = null;
        const input = this.getInputByName(inputName);
        if (input && input.props.match) {
            const matchProp = input.props.match;
            const matchName = matchProp.replace(/^!/, '');
            const invert = matchProp.startsWith('!');
            const matchedInput = this.getInputByName(matchName);
            if (matchedInput) {
                if (invert) {
                    return (
                        matchedInput.getValidationValue() !==
                        input.getValidationValue()
                    );
                }
                return (
                    matchedInput.getValidationValue() ===
                    input.getValidationValue()
                );
            }
        }
        return result;
    }

    validateForm() {
        this.validationResult = true;
        this.dataPayload = {};

        for (const i in this.registeredInputs) {
            if (
                !Object.prototype.hasOwnProperty.call(this.registeredInputs, i)
            ) {
                continue;
            }

            const input = this.registeredInputs[i];

            // CHECK VALIDITY
            if (input.validationObject.result === false) {
                this.validationResult = false;
            }

            // COLLECT INPUT INFORMATION
            const groupName = (input.props.name.match(/[^:]+(?=:)/) || [])[0];

            if (groupName) {
                if (Array.isArray(this.dataPayload[groupName])) {
                    (this.dataPayload[groupName] as Array<string>).push(
                        input.getFormValue()
                    );
                } else {
                    this.dataPayload[groupName] = [input.getFormValue()];
                }
            } else {
                this.dataPayload[input.props.name] = input.getFormValue();
            }

            this.formIValidationObject[input.props.name] =
                input.validationObject;
        }

        if (this.props.onValidationResult) {
            this.props.onValidationResult(
                this.validationResult,
                this.dataPayload,
                this.formIValidationObject
            );
        }
    }

    warnInvalids() {
        let focused = false;

        for (const i in this.registeredInputs) {
            if (
                !Object.prototype.hasOwnProperty.call(this.registeredInputs, i)
            ) {
                continue;
            }
            const input = this.registeredInputs[i];

            // INDICATE THAT THERE HAS BEEN INTERACTION
            if (!input.isInteracted) {
                input.isInteracted = true;
                input.validateInput();
            }

            // CHECK VALIDITY
            if (input.validationObject.result === false) {
                if (!focused) {
                    // FOCUS FIRST INVALID INPUT
                    const inputElement = this.getInputElementByName(
                        input.props.name
                    );
                    if (inputElement) {
                        inputElement.focus();
                        focused = true;
                    }
                }
                input.warn();
            }
        }
    }

    clear(inputName?: string) {
        if (inputName) {
            const input = this.getInputByName(inputName);
            if (input) {
                input.clear();
            }
            return;
        }

        for (const i in this.registeredInputs) {
            if (
                !Object.prototype.hasOwnProperty.call(this.registeredInputs, i)
            ) {
                continue;
            }
            this.registeredInputs[i].clear();
        }
    }

    getInputElementByName(inputName: string): HTMLInputElement | null {
        if (!this.formRef.current) {
            return null;
        }

        return (this.formRef.current as HTMLElement).querySelector(
            `input[name="${inputName}"]`
        );
    }

    getInputByName(inputName: string): InputRenderer | null {
        for (const i in this.registeredInputs) {
            if (
                !Object.prototype.hasOwnProperty.call(this.registeredInputs, i)
            ) {
                continue;
            }
            if (this.registeredInputs[i].props.name === inputName) {
                return this.registeredInputs[i];
            }
        }
        return null;
    }

    submit(handler: TOnValidationHandler) {
        for (const i in this.registeredInputs) {
            if (
                !Object.prototype.hasOwnProperty.call(this.registeredInputs, i)
            ) {
                continue;
            }
            const input = this.registeredInputs[i];

            // INDICATE THAT THERE HAS BEEN INTERACTION
            if (!input.isInteracted) {
                input.isInteracted = true;
                input.validateInput();
            }
        }

        handler(
            this.validationResult,
            this.dataPayload,
            this.formIValidationObject
        );
    }

    render() {
        const {
            onValidationResult,
            onMount,
            children,
            style,
            className,
            customStyles,
            customClassNames,
            globalTheme,
            ...other
        } = this.props;

        return (
            <form data-testid={testIDs.root} {...other} ref={this.formRef}>
                <FormContext.Provider value={this.FormContextValue}>
                    {children}
                </FormContext.Provider>
            </form>
        );
    }
}

export type {IFormIValidationObject};
export {Form, FormContext, testIDs};
