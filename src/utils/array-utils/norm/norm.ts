type TNotArray<T> = T extends [] ? never : T;
type TInput<T> = TNotArray<T> | Array<T>;

function norm<T>(input: TInput<T>): Array<T> {
    if (Array.isArray(input)) {
        return input;
    } else {
        return [input];
    }
}

export {norm};
