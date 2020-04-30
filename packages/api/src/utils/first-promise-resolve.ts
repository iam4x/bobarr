// function invert<TResult>(
//   promise: Promise<TResult[] | TResult>
// ): Promise<TResult> {
//   return new Promise((res, rej) => promise.then(rej, res));
// }

// export function firstOf<TResult>(
//   promises: Array<Promise<TResult>>
// ): Promise<TResult> {
//   return invert<TResult>(Promise.all(promises.map((p) => invert<TResult>(p))));
// }
