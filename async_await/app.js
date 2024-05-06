function processData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data * 2), 1000);
  });
}

function* SugarCoat() {
  const result1 = yield processData(10);
  console.log('첫 번째 처리 결과:', result1);
  const result2 = yield processData(result1);
  console.log('두 번째 처리 결과:', result2);
  const result3 = yield processData(result2);
  console.log('세 번째 처리 결과:', result3);
  return result3;
}

function async(generatorFunc) {
  const generator = generatorFunc();

  function onReslove(PromiseResult) {
    const result = generator.next(PromiseResult);
    return result.done
      ? result.value
      : result.value.then((res) => onReslove(res));
  }

  return onReslove;
}

async(SugarCoat)();
