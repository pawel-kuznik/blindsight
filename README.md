# blindsight library

This is a personal library to deal with some futures mechanism (like a Promise). Initial reason
is an implementation of a abortable promise mechanism that is easy to use and is easy to consume
in a TypeScript project.

## Comparison to bluebird promises

Excellent bluebird library has a similar concept for aborting promises (cancellation). However,
it doesn't come with good TypeScript support (it works better if there are no type at all) and
it introduces a third channel of communication which doesn't behave like the resolution and rejection.
This seems rether strange and can lead to strange code. Instead of dealing with it and securing
public APIs of my libraries, I decided to just write the implementation for an AbortablePromise
cause it was easier.

## Future work

- support of signals for AbortablePromise (look at iventy library)
- deferred mechanisms