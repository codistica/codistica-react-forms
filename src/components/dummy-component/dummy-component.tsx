import type {FC, ReactNode} from 'react';
import {testIDs} from './defines/test-ids';

interface IDummyComponentProps {
    children?: ReactNode;
}
const DummyComponent: FC<IDummyComponentProps> = function DummyComponent({
    children
}) {
    return <div data-testid={testIDs.root}>{children}</div>;
};

export type {IDummyComponentProps};
export {DummyComponent, testIDs};
