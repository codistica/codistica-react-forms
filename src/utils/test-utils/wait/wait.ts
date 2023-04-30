async function wait(timeout: number): Promise<void> {
    if (timeout) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
        return Promise.resolve();
    }
}

export {wait};
