import { AbortablePromise } from "./AbortablePromise";

describe('AbortablePromise', () => {
    it('it should resolve like normal promise when it is not aborted', async () => {

        const promise = new AbortablePromise<number>((resolve: (result: number) => void, reject: (reason: any) => void) => {
            resolve(42);
        });

        const result = await promise;
        expect(result).toEqual(42);
    });
    it('should reject like normal promise when it is not aborted', done => {

        const promise = new AbortablePromise(Promise.reject(Error("should not happen")));

        promise.catch((error: Error) => {
            expect(error.message).toEqual("should not happen");
            done();
        });
    });
    it('should not resolve when it is aborted', done => {

        const promise = new AbortablePromise((resolve: (result: number) => void, reject: (reason: any) => void) => {
            setTimeout(() => resolve(42), 5);
        });

        promise.abort().then(() => { throw Error('Resolved when it should not'); });

        setTimeout(() => done(), 10);
    });
    it('should not reject when it is aborted', done => {

        const promise = new AbortablePromise((resolve: (result: number) => void, reject: (reason: any) => void) => {
            setTimeout(() => reject(Error("Rejected when it should not")), 5);
        });

        promise.abort();

        setTimeout(() => done(), 10);
    });
});