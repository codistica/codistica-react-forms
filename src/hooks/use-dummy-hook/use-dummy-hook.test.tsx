import {render} from '@testing-library/react';
import type {FC} from 'react';
import {useDummyHook} from './use-dummy-hook';

const defines = {
    componentTestIds: {
        root: 'root'
    }
};

interface IComponentProps {
    str: string;
}

const Component: FC<IComponentProps> = ({str}) => {
    const result = useDummyHook(str);
    return <div data-testid={defines.componentTestIds.root}>{result}</div>;
};

describe('dummy test', () => {
    it('should dummy test', () => {
        const {getByTestId} = render(<Component str={'TEST'} />);
        const root = getByTestId(defines.componentTestIds.root);

        expect(root).toBeVisible();
        expect(root.textContent).toBe('TEST');
    });
});
