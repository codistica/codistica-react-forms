import {act, render} from '@testing-library/react';
import {default as userEvent} from '@testing-library/user-event';
import {prettifyPreset} from '../../plugins/presets';
import {lengthValidator} from '../../plugins/validators';
import {InputRenderer} from './input-renderer';

describe('InputRenderer', () => {
    it('should render an input without errors', () => {
        const {getByTestId} = render(
            <InputRenderer
                name={'test'}
                inputRenderFn={(inputProps) => {
                    return (
                        <input
                            data-testid={'input'}
                            {...inputProps}
                            value={inputProps.value as string}
                        />
                    );
                }}
            />
        );

        const input = getByTestId('input');

        expect(input).toBeVisible();
    });

    it('should render an input with proper default value', () => {
        const {getByTestId} = render(
            <InputRenderer
                name={'test'}
                value={'DEFAULT'}
                inputRenderFn={(inputProps) => {
                    return (
                        <input
                            data-testid={'input'}
                            {...inputProps}
                            value={inputProps.value as string}
                        />
                    );
                }}
            />
        );

        const input = getByTestId('input') as HTMLInputElement;

        expect(input.value).toBe('DEFAULT');
    });

    it('should properly update input value on typing', async () => {
        const {getByTestId} = render(
            <InputRenderer
                name={'test'}
                value={'THIS TEST'}
                inputRenderFn={(inputProps) => {
                    return (
                        <input
                            data-testid={'input'}
                            {...inputProps}
                            value={inputProps.value as string}
                        />
                    );
                }}
            />
        );

        const input = getByTestId('input') as HTMLInputElement;

        expect(input.value).toBe('THIS TEST');

        await act(async () => {
            await userEvent.pointer({target: input, keys: '[MouseLeft]'});
            await userEvent.keyboard(' SUCCEEDED');
        });

        expect(input.value).toBe('THIS TEST SUCCEEDED');
    });

    it('should properly load and run a validator', async () => {
        const {getByTestId} = render(
            <InputRenderer
                name={'test'}
                plugins={lengthValidator({
                    minLength: 10,
                    maxLength: 15
                })}
                inputRenderFn={(inputProps, inputRendererAPI) => {
                    return (
                        <div>
                            <input
                                data-testid={'input'}
                                {...inputProps}
                                value={inputProps.value as string}
                            />
                            <div data-testid={'status'}>
                                {inputRendererAPI.status}
                            </div>
                        </div>
                    );
                }}
            />
        );

        const input = getByTestId('input') as HTMLInputElement;
        const status = getByTestId('status') as HTMLDivElement;

        expect(input.value).toBe('');
        expect(status.textContent).toBe('');

        await act(async () => {
            await userEvent.pointer({target: input, keys: '[MouseLeft]'});
            await userEvent.keyboard('Hello');
        });

        expect(input.value).toBe('Hello');
        expect(status.textContent).toBe('invalid');

        await act(async () => {
            await userEvent.keyboard(', World!');
        });

        expect(input.value).toBe('Hello, World!');
        expect(status.textContent).toBe('valid');

        await act(async () => {
            await userEvent.keyboard('!!!!!!!!!!');
        });

        expect(input.value).toBe('Hello, World!!!!!!!!!!!');
        expect(status.textContent).toBe('invalid');
    });

    it('should properly load and run a preset', async () => {
        const {getByTestId} = render(
            <InputRenderer
                name={'test'}
                plugins={prettifyPreset}
                inputRenderFn={(inputProps) => {
                    return (
                        <div data-testid={'root'}>
                            <input
                                data-testid={'input'}
                                {...inputProps}
                                value={inputProps.value as string}
                            />
                        </div>
                    );
                }}
            />
        );

        const root = getByTestId('root') as HTMLDivElement;
        const input = getByTestId('input') as HTMLInputElement;

        expect(input.value).toBe('');

        await act(async () => {
            await userEvent.pointer({target: input, keys: '[MouseLeft]'});
            await userEvent.keyboard('hello1 ');
        });

        expect(input.value).toBe('hello ');

        await act(async () => {
            await userEvent.pointer({target: root, keys: '[MouseLeft]'});
        });

        expect(input.value).toBe('Hello');

        await act(async () => {
            await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        });

        expect(input.selectionStart).toBe(input.value.length);
        expect(input.selectionEnd).toBe(input.selectionStart);

        await act(async () => {
            await userEvent.keyboard(',     world@   ');
        });

        expect(input.value).toBe('Hello world ');

        await act(async () => {
            await userEvent.pointer({target: root, keys: '[MouseLeft]'});
        });

        expect(input.value).toBe('Hello World');
    });
});
