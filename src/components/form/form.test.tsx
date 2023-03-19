import {render} from '@testing-library/react';
import {InputRenderer} from '../input-renderer/input-renderer';
import {Form, testIDs} from './form';

// TODO: DEDUPE TESTS IN GENERAL (GROUP COMMON ACCESSORY LOGIC)

describe('Form', () => {
    it('should render a form without errors', () => {
        const {getByTestId} = render(<Form />);

        const form = getByTestId(testIDs.root);

        expect(form).toBeVisible();
    });

    it('should correctly render an input inside a form', () => {
        const {getByTestId} = render(
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

        const form = getByTestId(testIDs.root);
        const input = getByTestId('input');

        expect(form).toBeVisible();
        expect(input).toBeVisible();
    });
});
