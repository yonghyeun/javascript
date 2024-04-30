const delay = (ms) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, ms);
  });
};
const fetching = async () => {
  const result = await Promise.all([delay(1000), delay(2000), delay(3000)]);
  console.log(result);
  return result;
};

console.log('페칭 시작!');
fetching();
