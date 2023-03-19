function stringify(input: unknown): string {
    if (input !== undefined && input !== null) {
        if (
            Object.hasOwnProperty.call(input, 'toString') ||
            Object.hasOwnProperty.call(Object.getPrototypeOf(input), 'toString')
        ) {
            return input.toString();
        }
    }

    return JSON.stringify(input);
}

export {stringify};
