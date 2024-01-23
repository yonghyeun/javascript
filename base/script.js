const sleepPromise = (value, delay) => {
  return new Promise((res) =>
    setTimeout(() => {
      res(value);
    }, delay),
  );
};

const createPromise = async (value, delay) => {
  const a = await sleepPromise(value, delay);
  console.log(a);
  return a;
};

const a = createPromise('a', 3000);
