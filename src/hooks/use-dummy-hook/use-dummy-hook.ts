import {useRef} from 'react';

function useDummyHook(value: string) {
    const ref = useRef(value);

    return ref.current;
}

export {useDummyHook};
