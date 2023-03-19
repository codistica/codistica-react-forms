type TResolve<T> = (value: T) => void;
type TReject = (reason?: undefined) => void;
type TExecutor<T> = (resolve: TResolve<T>, reject: TReject) => void;

interface IPromise<T> extends Promise<T> {
    isPending: boolean;
    isRejected: boolean;
    isFulfilled: boolean;
}

function promise<T>(executor: TExecutor<T>): IPromise<T> {
    const sub = new Promise(executor);

    const context = {
        isPending: true,
        isRejected: false,
        isFulfilled: false
    };

    Object.defineProperties(sub, {
        isFulfilled: {
            get() {
                return context.isFulfilled;
            }
        },
        isPending: {
            get() {
                return context.isPending;
            }
        },
        isRejected: {
            get() {
                return context.isRejected;
            }
        }
    }).then(
        (value) => {
            context.isFulfilled = true;
            context.isPending = false;

            return Promise.resolve(value);
        },
        (reason) => {
            context.isRejected = true;
            context.isPending = false;

            return Promise.reject(reason);
        }
    );

    return sub as IPromise<T>;
}

export type {IPromise};
export {promise};
