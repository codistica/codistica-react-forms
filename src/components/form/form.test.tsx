import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {InputRenderer} from '../input-renderer/input-renderer';
import {Form, testIDs} from './form';

describe('tests for: Form component', () => {
    it('should render a form', () => {
        expect.assertions(1);

        render(<Form />);

        const form = screen.getByTestId<HTMLFormElement>(testIDs.root);

        expect(form).toBeVisible();
    });

    it('should render a connected input inside a form', () => {
        expect.assertions(2);

        render(
            <Form>
                <InputRenderer
                    name={'test'}
                    inputRenderFn={(bind) => {
                        return (
                            <input
                                data-testid={'input'}
                                {...bind}
                                value={bind.value as string}
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
        expect.assertions(4);

        const onValidationResultHandler = jest.fn();

        render(
            <Form onValidationResult={onValidationResultHandler}>
                <InputRenderer
                    name={'test'}
                    inputRenderFn={(bind) => {
                        return (
                            <input
                                data-testid={'input'}
                                {...bind}
                                value={bind.value as string}
                            />
                        );
                    }}
                />
            </Form>
        );

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(onValidationResultHandler).toHaveBeenCalledTimes(2);
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

        expect(onValidationResultHandler).toHaveBeenCalledTimes(6);
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
        expect.assertions(2);

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
                    inputRenderFn={(bind, api) => {
                        return (
                            <div>
                                <input {...bind} value={bind.value as string} />
                                <div data-testid={'status'}>{api.status}</div>
                            </div>
                        );
                    }}
                />
            </Form>
        );

        const status = screen.getByTestId<HTMLDivElement>('status');

        expect(context.formAPI).toMatchObject(expect.any(Object));

        act(() => {
            (context.formAPI as Form).warnInvalids();
        });

        expect(status).toHaveTextContent('warning');
    });
});
