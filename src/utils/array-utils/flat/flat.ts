type TInput<T> = Array<TInput<T> | T>;

function flat<T>(input: TInput<T>, maxDepth?: number): Array<T> {
    if (typeof maxDepth === 'undefined') {
        maxDepth = Infinity;
    }

    const recurse = (current: TInput<T>, depth: number): TInput<T> => {
        const length = current.length;

        const output: TInput<T> = [];

        let index = 0;

        while (index < length) {
            const value = current[index];

            if (Array.isArray(value) && depth < (maxDepth as number)) {
                const sub = recurse(value, depth + 1);

                output.push(...sub);
            } else {
                output.push(value);
            }

            index++;
        }

        return output;
    };

    return recurse(input, 0) as Array<T>;
}

export {flat};
