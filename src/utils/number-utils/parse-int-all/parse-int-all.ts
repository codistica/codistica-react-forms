function parseIntAll(input: string | number): Array<number> {
    if (typeof input === 'string' && input.length > 0) {
        return (input.match(/\d+/g) || []).map((val) => parseInt(val));
    } else if (typeof input === 'number') {
        return [input];
    } else {
        return [];
    }
}

export {parseIntAll};
