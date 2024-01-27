import {render, screen} from '@testing-library/react';
import type {FC} from 'react';
import type {IInputRendererProps} from './input-renderer';
import {InputRenderer} from './input-renderer';

type TBaseProps = Omit<IInputRendererProps, 'name' | 'inputRenderFn'>;

interface ITestInputProps extends TBaseProps {
    name?: IInputRendererProps['name'];
}

const TestInput: FC<ITestInputProps> = (props) => {
    return (
        <InputRenderer
            name={'test'}
            {...props}
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
    );
};

describe('tests for: InputRenderer component', () => {
    it('should render an input', () => {
        expect.assertions(1);

        render(<TestInput />);

        const input = screen.getByTestId<HTMLInputElement>('input');

        expect(input).toBeVisible();
    });
});
