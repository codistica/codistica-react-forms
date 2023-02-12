import {render} from '@testing-library/react';
import {DummyComponent, testIDs} from './dummy-component';

describe('dummy test', () => {
    it('should dummy test', () => {
        const {getByTestId} = render(<DummyComponent>{'TEST'}</DummyComponent>);
        const root = getByTestId(testIDs.root);

        expect(root).toBeVisible();
        expect(root.textContent).toBe('TEST');
    });
});
