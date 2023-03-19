type THeartbeat = (
    callback: () => void,
    timeout: number,
    defuse?: boolean
) => void;

function createHeartbeat(): THeartbeat {
    let timer: number | null = null;

    return (callback, timeout, defuse) => {
        if (timer !== null) {
            clearTimeout(timer);
        }

        if (defuse) {
            return;
        }

        timer = window.setTimeout(() => {
            callback();
        }, timeout);
    };
}

export type {THeartbeat};
export {createHeartbeat};
