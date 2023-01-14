export interface AbortablePromiseResolver<TResult> {
    (resolve: (result: TResult) => void, reject: (reason: any) => void): void;
};

/**
 *  This is a variation of on a Promise concept which also allows for aborting
 *  resolution or reject of a promise. When the promise is aborted, the resolution
 *  and rejection callbacks will not be called at all. 
 * 
 *  However, when the promise resolver resolves before .abort() call, the promise
 *  will be in resolved or rejected state as the promise chain collapses.
 */
export class AbortablePromise<TResult> implements Promise<TResult> {

    // required by Promise<TResult>
    readonly [Symbol.toStringTag]: string = '[object Object]';

    private _promise: Promise<TResult>;
    private _abort: boolean = false;

    /**
     *  The AbortablePromise can be constructed with a resolver function (just like the regular
     *  Promise) or with a promise object that is, essentially, wrapped by the abortable promise.
     *  The second way allows for easy wrapping existing promies with additional functionality
     *  of aborting the handling the passed promise.
     */
    constructor(resolver: Promise<TResult> | AbortablePromiseResolver<TResult>) {

        const internalPromise = ('then' in resolver) ? resolver : new Promise(resolver);

        this._promise = new Promise<TResult>((resolve: (result: TResult) => void, reject: (reason: any) => void) => {

            internalPromise.then(result => {
                if (this._abort) return;
                resolve(result);
            }, reason => {
                if (this._abort) return;
                reject(reason);
            });
        });
    }

    /**
     *  Handle when promise resolves and optionally when it rejects.
     */
    then<TResult1 = TResult, TResult2 = never>(onfulfilled?: ((value: TResult) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
        return this._promise.then(onfulfilled, onrejected);
    }

    /**
     *  Catch errors from the promise. When promise is aborted this
     *  callback doesn't execute.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<TResult | TResult> {
        return this._promise.then(undefined, onrejected);
    }

    /**
     *  A callback called when the promise resolves or rejects. When the promise
     *  is aborted, this callback doesn't executes at all.
     */
    finally(onfinally?: (() => void) | null | undefined): Promise<TResult> {
        return this._promise.finally(onfinally);
    }

    /**
     *  Abort handling of the promise.
     */
    abort() : this {
        this._abort = true;
        return this;
    };
};
