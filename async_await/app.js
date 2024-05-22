// function* generatorMaker() {
//   // console.log(generator.next()); 실행
//   console.log('첫번째 호출');
//   const x = yield 1;
//   // console.log(generator.next(100)); 실행
//   console.log('두 번째 호출'); // generator.next(100) 로 인해 x 엔 100이 할당
//   const y = yield x + 10;
//   // console.log(generator.next(200)); 실행
//   console.log(y);
//   const z = yield y + 10; // generator.next(200) 로 y 엔 200이 할당
//   console.log(z);
//   console.log('세 번째 호출');
// }

// const generator = generatorMaker();
// console.log(generator.next());
// console.log(generator.next(100));
// console.log(generator.next(200));
// console.log(generator.next());

const promise = new Promise((res, rej) => {
  let i = 0;
  while (i < 30000) {
    i += 1;
  }
  console.log(i);
  res(i);
})
  .then((i) => {
    while (i < 30000) {
      i += 1;
    }
    console.log(i);
    return i;
  })
  .then((i) => {
    i += 1;
    console.log(i);
  });
console.log(promise);
