import {render, screen, waitFor} from '@testing-library/react';
import {default as userEvent} from '@testing-library/user-event';
import type {FC} from 'react';
import type {
    IUnknownTarget,
    TChangeEvent,
    TTargetElement
} from '../../defines/common.types';
import {nonNumberBlocker} from '../../plugins/blockers';
import {spaceFilter} from '../../plugins/filters';
import {prettifyPreset} from '../../plugins/presets';
import {
    asyncValidator,
    lengthValidator,
    wordValidator
} from '../../plugins/validators';
import {wait} from '../../utils/test-utils';
import type {IOptions} from './use-input';
import {useInput} from './use-input';

interface ITestInputProps extends IOptions {
    proxies?: {
        onChange?: (
            sup: (e: TChangeEvent<TTargetElement>) => void,
            e: TChangeEvent<TTargetElement>
        ) => void;
    };
}

const TestInput: FC<ITestInputProps> = ({proxies, ...options}) => {
    const {bind, api} = useInput(options);

    return (
        <div data-testid={'root'}>
            <input
                {...bind}
                value={bind.value as string}
                onChange={(e) => {
                    if (proxies && proxies.onChange) {
                        return proxies.onChange(bind.onChange, e);
                    } else {
                        return bind.onChange(e);
                    }
                }}
                data-testid={'input'}
            />

            <div data-testid={'status'}>{api.status}</div>

            <div data-testid={'messages'}>
                {api.validationObject.messages.map(({message}) => message)}
            </div>
        </div>
    );
};

describe('InputRenderer', () => {
    it('should render an input', () => {
        render(<TestInput name={'test'} />);

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input).toBeVisible();
    });

    it('should render an input with a default value', () => {
        render(<TestInput name={'test'} defaultValue={'DEFAULT'} />);

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input.value).toBe('DEFAULT');
    });

    it('should update input value on typing', async () => {
        render(<TestInput name={'test'} defaultValue={'THIS TEST'} />);

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input.value).toBe('THIS TEST');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard(' SUCCEEDED');

        expect(input.value).toBe('THIS TEST SUCCEEDED');
    });

    it('should validate after interaction if "deferValidation" is "true"', () => {
        render(
            <TestInput name={'test'} mandatory={true} deferValidation={true} />
        );

        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(status).toHaveTextContent('');
    });

    it('should validate before interaction if "deferValidation" is "false"', () => {
        render(
            <TestInput name={'test'} mandatory={true} deferValidation={false} />
        );

        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(status).toHaveTextContent('invalid');
    });

    it('should keep "missing" status after validation if "keepMissingStatus" is "true"', () => {
        render(
            <TestInput
                name={'test'}
                mandatory={true}
                deferValidation={false}
                keepMissingStatus={true}
            />
        );

        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(status).toHaveTextContent('missing');
    });

    it('should pass "mandatory" error message when required', () => {
        render(
            <TestInput
                name={'test'}
                mandatory={true}
                deferValidation={false}
                errorMessages={{
                    mandatory: 'error-message'
                }}
            />
        );

        const status = screen.getByTestId<HTMLDivElement>('messages');

        expect(status).toHaveTextContent('error-message');
    });

    it('should load and run a validator', async () => {
        render(
            <TestInput
                name={'test'}
                plugins={lengthValidator({
                    minLength: 10,
                    maxLength: 15
                })}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('');
        expect(status).toHaveTextContent('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('Hello');

        expect(input.value).toBe('Hello');
        expect(status).toHaveTextContent('invalid');

        await userEvent.keyboard(', World!');

        expect(input.value).toBe('Hello, World!');
        expect(status).toHaveTextContent('valid');

        await userEvent.keyboard('!!!!!!!!!!');

        expect(input.value).toBe('Hello, World!!!!!!!!!!!');
        expect(status).toHaveTextContent('invalid');
    });

    it('should load and run a blocker', async () => {
        render(<TestInput name={'test'} plugins={nonNumberBlocker} />);

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input.value).toBe('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('Hel11o');

        expect(input.value).toBe('11');
    });

    it('should load and run a filter', async () => {
        render(<TestInput name={'test'} plugins={spaceFilter} />);

        const root = screen.getByTestId<HTMLDivElement>('root');
        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input.value).toBe('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('h e l l o');

        expect(input.value).toBe('h e l l o');

        await userEvent.pointer({target: root, keys: '[MouseLeft]'});

        expect(input.value).toBe('hello');
    });

    it('should load and run a preset', async () => {
        render(<TestInput name={'test'} plugins={prettifyPreset} />);

        const root = screen.getByTestId<HTMLDivElement>('root');
        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input.value).toBe('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('hello1 ');

        expect(input.value).toBe('hello ');

        await userEvent.pointer({target: root, keys: '[MouseLeft]'});

        expect(input.value).toBe('Hello');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});

        expect(input.selectionStart).toBe(input.value.length);
        expect(input.selectionEnd).toBe(input.selectionStart);

        await userEvent.keyboard(',     world@   ');

        expect(input.value).toBe('Hello world ');

        await userEvent.pointer({target: root, keys: '[MouseLeft]'});

        expect(input.value).toBe('Hello World');
    });

    it('should handle non default "voidValue"', async () => {
        render(
            <TestInput
                name={'test'}
                defaultValue={'INITIAL'}
                voidValue={'INITIAL'}
            />
        );

        const root = screen.getByTestId<HTMLDivElement>('root');
        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('INITIAL');
        expect(status).toHaveTextContent('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.pointer({target: root, keys: '[MouseLeft]'});

        expect(input.value).toBe('INITIAL');
        expect(status).toHaveTextContent('invalid');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('{Backspace>7}');

        expect(input.value).toBe('');
        expect(status).toHaveTextContent('valid');
    });

    it('should successfully validate a "defaultValue" if equal to "voidValue" when not mandatory', async () => {
        render(
            <TestInput
                name={'test'}
                defaultValue={'INITIAL'}
                voidValue={'INITIAL'}
                mandatory={false}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('INITIAL');
        expect(status).toHaveTextContent('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.pointer({target: status, keys: '[MouseLeft]'});

        expect(input.value).toBe('INITIAL');
        expect(status).toHaveTextContent('valid');
    });

    it('should run filters before validators if "runFiltersBeforeValidators" is "true"', async () => {
        render(
            <TestInput
                name={'test'}
                runFiltersBeforeValidators={true}
                plugins={[
                    wordValidator({
                        valid: ['valid-value']
                    }),
                    spaceFilter
                ]}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('');
        expect(status).toHaveTextContent('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('valid - value');

        expect(input.value).toBe('valid - value');
        expect(status).toHaveTextContent('valid');

        await userEvent.pointer({target: status, keys: '[MouseLeft]'});

        expect(input.value).toBe('valid-value');
        expect(status).toHaveTextContent('highlight');
    });

    it('should execute callbacks on respective events', async () => {
        const onKeydownHandler = jest.fn();
        const onChangeHandler = jest.fn();
        const onBlurHandler = jest.fn();
        const onValidationResultHandler = jest.fn();

        render(
            <TestInput
                name={'test'}
                onKeyDown={onKeydownHandler}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                onValidationResult={onValidationResultHandler}
            />
        );

        const root = screen.getByTestId<HTMLDivElement>('root');
        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input.value).toBe('');

        expect(onValidationResultHandler).toHaveBeenCalledTimes(1);
        expect(onValidationResultHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                result: false
            })
        );

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('{a>}');

        expect(onKeydownHandler).toHaveBeenCalledTimes(1);
        expect(onKeydownHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'keydown',
                key: 'a'
            })
        );

        expect(onChangeHandler).toHaveBeenCalledTimes(1);
        expect(onChangeHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'change',
                target: expect.objectContaining({
                    value: 'a'
                }) as {value: string}
            })
        );

        expect(onBlurHandler).toHaveBeenCalledTimes(0);

        await userEvent.keyboard('{/a}');
        await userEvent.pointer({target: root, keys: '[MouseLeft]'});

        expect(input.value).toBe('a');

        expect(onBlurHandler).toHaveBeenCalledTimes(1);
        expect(onChangeHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'change',
                target: expect.objectContaining({
                    value: 'a'
                }) as {value: string}
            })
        );

        expect(onValidationResultHandler).toHaveBeenCalledTimes(2);
        expect(onValidationResultHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                result: true
            })
        );
    });

    it('should handle async validation', async () => {
        const executor = jest.fn(async () => {
            await wait(100);
            return true;
        });

        render(
            <TestInput
                name={'test'}
                plugins={asyncValidator({
                    executor,
                    deferThrottlingDelay: 0,
                    enableDeferCache: false
                })}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('');
        expect(status).toHaveTextContent('');
        expect(executor).toHaveBeenCalledTimes(0);

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});

        expect(executor).toHaveBeenCalledTimes(0);

        await userEvent.keyboard('Test');

        expect(status).toHaveTextContent('standBy');

        await waitFor(() => {
            expect(status).toHaveTextContent('valid');
        });

        expect(executor).toHaveBeenCalledTimes(4);
        expect(input.value).toBe('Test');
    });

    it('should cache async validation results if enabled', async () => {
        const executor = jest.fn(async () => {
            await wait(100);
            return true;
        });

        render(
            <TestInput
                name={'test'}
                plugins={asyncValidator({
                    executor,
                    deferThrottlingDelay: 0,
                    enableDeferCache: true
                })}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('Test');

        expect(status).toHaveTextContent('standBy');

        await waitFor(() => {
            expect(status).toHaveTextContent('valid');
        });

        await userEvent.keyboard('{Backspace>2}');

        expect(status).toHaveTextContent('valid');

        expect(executor).toHaveBeenCalledTimes(4);
        expect(input.value).toBe('Te');
    });

    it('should use passed stringifier', async () => {
        const stringifier = jest.fn(() => {
            return 'stringifier-output';
        });

        render(
            <TestInput
                name={'test'}
                stringifier={stringifier}
                plugins={wordValidator({valid: ['stringifier-output']})}
                proxies={{
                    onChange: (sup, e) => {
                        sup({
                            ...e,
                            target: {
                                ...e.target,
                                value: {}
                            }
                        } as TChangeEvent<IUnknownTarget>);
                    }
                }}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('');
        expect(status).toHaveTextContent('');
        expect(stringifier).toHaveBeenCalledTimes(0);

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('Test');

        expect(stringifier).toHaveBeenCalledTimes(8);
        expect(status).toHaveTextContent('valid');
    });

    it('should use internal stringifier', async () => {
        render(
            <TestInput
                name={'test'}
                plugins={wordValidator({valid: ['1234']})}
                proxies={{
                    onChange: (sup, e) => {
                        sup({
                            ...e,
                            target: {
                                ...e.target,
                                value: 1234
                            }
                        } as TChangeEvent<IUnknownTarget>);
                    }
                }}
            />
        );

        const input = screen.getByTestId<HTMLInputElement>('input');
        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(input.value).toBe('');
        expect(status).toHaveTextContent('');

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('Test');

        expect(input.value).toBe('1234');
        expect(status).toHaveTextContent('valid');
    });
});
