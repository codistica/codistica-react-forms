import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {InputRenderer} from '../input-renderer/input-renderer';
import {Form, testIDs} from './form';

describe('Form', () => {
    it('should render a form', () => {
        render(<Form />);

        const form = screen.getByTestId<HTMLFormElement>(testIDs.root);

        expect(form).toBeVisible();
    });

    it('should render a connected input inside a form', () => {
        render(
            <Form>
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
            </Form>
        );

        const form = screen.getByTestId<HTMLFormElement>(testIDs.root);
        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(form).toBeVisible();
        expect(input).toBeVisible();
    });

    it('should execute callbacks on respective events', async () => {
        const onValidationResultHandler = jest.fn();

        render(
            <Form onValidationResult={onValidationResultHandler}>
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
            </Form>
        );

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(onValidationResultHandler).toHaveBeenCalledTimes(1);
        expect(onValidationResultHandler).toHaveBeenLastCalledWith(
            false,
            expect.objectContaining({
                test: ''
            }),
            expect.objectContaining({
                test: expect.any(Object) as object
            })
        );

        await userEvent.pointer({target: input, keys: '[MouseLeft]'});
        await userEvent.keyboard('Test');

        expect(onValidationResultHandler).toHaveBeenCalledTimes(5);
        expect(onValidationResultHandler).toHaveBeenLastCalledWith(
            true,
            expect.objectContaining({
                test: 'Test'
            }),
            expect.objectContaining({
                test: expect.any(Object) as object
            })
        );
    });

    it('should provoke a warning status on invalid inputs', () => {
        const context: {formAPI: null | Form} = {
            formAPI: null
        };

        render(
            <Form
                onMount={(formAPI) => {
                    context.formAPI = formAPI;
                }}
            >
                <InputRenderer
                    name={'test'}
                    inputRenderFn={(inputProps, inputRendererAPI) => {
                        return (
                            <div>
                                <input
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
            </Form>
        );

        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(context.formAPI).toMatchObject(expect.any(Object));

        act(() => {
            if (context.formAPI) {
                context.formAPI.warnInvalids();
            }
        });

        expect(status).toHaveTextContent('warning');
    });
});
