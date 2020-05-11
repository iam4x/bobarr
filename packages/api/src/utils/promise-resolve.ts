function invert<TResult>(
  promise: Promise<TResult[] | TResult>
): Promise<TResult> {
  return new Promise((res, rej) => promise.then(rej, res));
}

export function firstOf<TResult>(
  promises: Array<Promise<TResult>>
): Promise<TResult> {
  return invert<TResult>(Promise.all(promises.map((p) => invert<TResult>(p))));
}

function PromiseDelay<TResult>(t: number): Promise<TResult> {
  return new Promise((resolve) => {
    setTimeout(resolve.bind(null), t);
  });
}

export const PromiseRaceAll = function <TResult>(
  promises: Array<Promise<TResult>>,
  timeoutTime: number
) {
  return Promise.all(
    promises.map(
      (p) => Promise.race([p, PromiseDelay(timeoutTime)]) as Promise<TResult>
    )
  );
};
