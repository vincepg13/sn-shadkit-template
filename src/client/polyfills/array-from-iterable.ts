/* eslint-disable @typescript-eslint/no-explicit-any */
(() => {
  const ok = (() => {
    try {
      const arr = Array.from(new Set([1, 2, 2]));
      return Array.isArray(arr) && arr.length === 2 && arr[0] === 1 && arr[1] === 2;
    } catch { return false; }
  })();

  if (ok) return;

  const hasIter = typeof Symbol !== 'undefined' && !!(Symbol as any).iterator;

  function fromIterator<T>(iter: Iterator<T>, mapFn?: (v: T, i: number) => any, thisArg?: any) {
    const out: any[] = [];
    let i = 0, r: IteratorResult<T>;
    // eslint-disable-next-line no-cond-assign
    while (!(r = iter.next()).done) {
      out.push(mapFn ? mapFn.call(thisArg, r.value, i++) : r.value);
    }
    return out;
  }

  Object.defineProperty(Array, 'from', {
    configurable: true,
    writable: true,
    value: function from(arrayLike: any, mapFn?: any, thisArg?: any) {
      if (arrayLike == null) throw new TypeError('Array.from requires an array-like or iterable');
      // Iterable path (handles Set/Map/etc.)
      if (hasIter && typeof arrayLike[Symbol.iterator] === 'function') {
        return fromIterator(arrayLike[Symbol.iterator](), mapFn, thisArg);
      }
      // Fallback: array-like with .length
      const len = Math.max(Math.min(Number(arrayLike.length) || 0, Number.MAX_SAFE_INTEGER), 0);
      const out: any[] = new Array(len);
      for (let i = 0; i < len; i++) out[i] = mapFn ? mapFn.call(thisArg, arrayLike[i], i) : arrayLike[i];
      return out;
    }
  });
})();
