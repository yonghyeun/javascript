const fibo = (() => {
  let [pre, cur] = [0, 1];
  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      [pre, cur] = [cur, pre + cur];
      return { value: cur, done: false };
    },
  };
})();

for (const num of fibo) {
  if (num > 100) break;
  console.log(num);
}
