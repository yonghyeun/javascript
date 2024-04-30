const promise1 = new Promise((res) => res(1))
  .then((res) => res + 1)
  .then((res) => res * 2);
console.log(promise1);
