// --- Polyfill for Array.prototype.entries ---
if (typeof Array.prototype.entries !== 'function') {
  Array.prototype.entries = function entries() {
    let i = 0;
    const arr = this;
    return {
      [Symbol.iterator]() { return this; },
      next() {
        if (i < arr.length) return { value: [i, arr[i++]], done: false };
        return { value: undefined, done: true };
      },
    };
  };
}

// --- Optional: polyfill Array.prototype.keys / values as well ---
if (typeof Array.prototype.keys !== 'function') {
  Array.prototype.keys = function keys() {
    let i = 0;
    const arr = this;
    return {
      [Symbol.iterator]() { return this; },
      next() {
        if (i < arr.length) return { value: i++, done: false };
        return { value: undefined, done: true };
      },
    };
  };
}
if (typeof Array.prototype.values !== 'function') {
  Array.prototype.values = function values() {
    let i = 0;
    const arr = this;
    return {
      [Symbol.iterator]() { return this; },
      next() {
        if (i < arr.length) return { value: arr[i++], done: false };
        return { value: undefined, done: true };
      },
    };
  };
}
