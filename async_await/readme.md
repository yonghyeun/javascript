# async/await 문법 공부하기

---

## `Promise Recap`

---

항상 머리가 지끈지끈했던 `async/await` 에 관련된 내용을 공부해보도록 하자

이전에 나는 `Promise` 와 `thenable` 한 객체의 `[[ResponseHandler]]` 에 대한 내용들을 한 번 공부했었다.

```jsx
const promise = new Promise((res) => {
  res(1); // 동기적으로 실행
})
  .then((prevRes) => prevRes + 1)
  .then((prevRes) => prevRes * 2)
  .then(console.log);
```

다음과 같은 `promise chaning` 이 있을 때 동기적으로 실행되는 부분과 비동기적으로 실행되는 부분은 다음과 같다.

### 동기적으로 실행되는 부분

---

```jsx
const promise = new Promise((res) => {
  res(1);
}) // 1번 Promise 객체 반환하며 [[PromiseFulfillReaction]] 에 다음 then 메소드 등록
  // ⭐ then 내부에 존재하는 콜백함수는 이전 Promise 객체의 [[PromiseResult]] 를 가리킨다.
  .then((prevRes) => prevRes + 1)
  // 2번 Promise 객체 반환하며 [[PromiseFulfillReaction]] 에 다음 then 메소드 등록
  // ⭐ 각 then 메소드의 반환값은 반환하는 Promise 객체의 [[PromiseResult]] 의 값을 의미한다.
  .then((prevRes) => prevRes * 2)
  // 3번 Promise 객체 반환하며 [[PromiseFulfillReaction]] 에 다음 then 메소드 등록
  .then(console.log);
// 4번 Promise 객체 반환하며 반환값이 존재하지 않기 때문에 [[PromiseResult]] 는 undeifned
```

```json
4
```

다음과 같은 `Promise Chaining` 은 여러 `Promise` 객체들의 연결로 이뤄진다.

`Promise` 에는 `[[]]` 으로 생긴 내부 슬롯들이 존재하는데

우리가 기억해야 할 슬롯은 다음과 같은 4가지이다.

- `[[PromiseState]]` - `Promise` 객체가 반응값을 받아왔는지, 받아오지 않았는지에 대한 상태로 `fulfiled , rejected` 의 결과값이 존재함
- `[[PromiseResult]]` - `Promise` 객체가 가져온 반응값을 담고 있는 자료구조
- `[[PromiseFulfillReaction]] , [[PromiseRejectReaction]]` - `[[PromiseState]]` 가 `fulfiled , rejected` 이후 실행될 콜백함수를 담는 자료구조로 , `[[PromiseState]]` 가 변경되면 실행될 콜백함수를 담는 자료구조이다.
- `[[Promise..Reaction]] - [[Handler]]` - `[[Handler]]` 자료구조 내부엔 각 `Reaction` 별 실행될 콜백함수가 담기며 해당 콜백함수는 `[[PromiseState]]` 가 변경되면 `MicroTaskqueue` 로 옮겨진 후 `call stack` 이 비면 이벤트 루프에 의해 `call stack` 옮겨진 후 실행된다.

기본적으로 `Promise` 객체는 비동기적으로 실행된다고 알고있지만 , `Promise chaining` 들이 자바스크립트 엕진에 의해 평가되는 시점에 동기적으로

**`Promise` 내부 슬롯을 실행하기 전 각 `Promise` 객체의 `[[Promise .. Reaction]]` 에 각 메소드들을 할당한다.**

체이닝이 먼저 일어난 후 , `Promise` 객체 내부에 존재하는 콜백함수들이 실행된다.

### 비동기적으로 실행되는 부분

체이닝 되어있는 이전 단계의 `Promise` 객체의 `[[PromiseState]]` 가 `fulfilled` 로 변경되면 `[[PromisefulfilledReaction]]` 내부에 등록된 콜백함수가 비동기적으로

`MicroTaskQueue` 에 등록되어 `call stack` 이 모두 빌 때까지 대기하다가 실행된다.

즉 , `then` 과 같은 프로미스 체이닝을 이용하여 프로미스 객체를 생성하는 것은

`Promise` 객체들의 연속된 행동 동작을 정의하고 , 브라우저 엔진이 연속된 행동 동작들을 콜스택과 마이크로태스크큐 흐름에 맞게 실행하는 것이다.

> 자세한 내용은 해당 유튜브를 참고하면 좋을 것 같다. 정말 좋은 영상이다.
> https://www.youtube.com/watch?v=Xs1EMmBLpn4

## `async / await` 살펴보기

동기적인 흐름에 익숙한 우리에게 비동기적인 과정은 코드를 직관적으로 이해하는데 어려움을 겪게한다.

비동기적인 과정들이 `then` 으로 엮여있는 , 콜백함수들의 연결들로 이뤄져 코드의 흐름을 파악하기 어려운 현상을

**콜백 지옥** 이라고 한다.

지금 같은 경우는 `Promise` 내부의 콜백함수가 매우 단순하기 때문에 흐름을 이해하기 매우 쉽지만

다음과 같은 경우를 살펴보면 코드의 흐름을 파악하기 매우 어렵다.

```jsx
function processData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data * 2), 1000);
  });
}

// 데이터 처리를 시작합니다.
processData(10)
  .then((result) => {
    console.log('첫 번째 처리 결과:', result);
    // 첫 번째 처리 결과를 받고 두 번째 데이터 처리
    return processData(result);
  })
  .then((result) => {
    console.log('두 번째 처리 결과:', result);
    // 두 번째 처리 결과를 받고 세 번째 데이터 처리
    return processData(result);
  })
  .then((result) => {
    console.log('세 번째 처리 결과:', result);
    // 세 번째 처리 결과를 받고 네 번째 데이터 처리
    return processData(result);
  });
```

여러번의 비동기 처리가 일어나야 하는 경우 필연적으로 프로미스 체이닝을 사용해야 할 때가 되는데

해당 코드를 이해하기 위해서는 여러가지를 신경써야 한다.

음. 지금 n 번째 `then` 내부에 있는 인수는 이전 `Promise` 객체가 패칭해온 `[[PromiseResult]]` 이고 .. 이 `then` 내부에 존재하는 콜백함수가 가리키는 `result` 는 이전 프로미스 객체의 `[[PromiseResult]]` 고 ..

웩

이렇게 동기적인 흐름을 이해하기 힘든 코드를 마치 동기적인 코드처럼 사용 할 수 있게 해주는

문법인 `async/await` 문법이 존재한다.

```jsx
async function SugarCoat() {
  const result1 = await processData(10);
  console.log('첫 번째 처리 결과:', result1);
  const result2 = await processData(result1);
  console.log('두 번째 처리 결과:', result2);
  const result3 = await processData(result2);
  console.log('세 번째 처리 결과:', result3);
  return result3;
}
```

해당 코드도 이전의 프로미스 체이닝들과 동일하게 작동하지만

코드의 가독성이 훨씬 좋아진 모습을 볼 수 있다.

## `async/await` 는 그럼 어떻게 동작하는데 ?

`async/await` 문법은 `thenable` 한 객체들의 비동기적인 처리를

동기적인 처리의 흐름처럼 사용 할 수 있게 해주는 `syntactic sugar` 라고 한다.

헷갈리지 마자, 이는 마치 동기적인 처리의 흐름처럼 사용 할 수 있게 할 뿐 실제로 동기적인 처리의 흐름으로 실행되는 것이 아니다.

동기적인 처리가 진행되는 코드나 , 더 빠르게 `TaskQueue` 에 들어갈 코드가 있다면 어떻게 처리되는지를 보면 알 수 있다.

```jsx
async function SugarCoat() {
  const result1 = await processData(10);
  console.log('첫 번째 처리 결과:', result1);
  const result2 = await processData(result1);
  console.log('두 번째 처리 결과:', result2);
  const result3 = await processData(result2);
  console.log('세 번째 처리 결과:', result3);
  return result3;
}

SugarCoat();
console.log('SugarCoat 함수 이후에 호출된 로그');
setTimeout(() => {
  console.log('SugarCoat 호출 이후에 1000ms 이후 TaskQueue 에 들어간 로그');
}, 1000);
```

```json
SugarCoat 함수 이후에 호출된 로그 // console.log()
첫 번째 처리 결과: 20
SugarCoat 호출 이후에 1000ms 이후 TaskQueue 에 들어간 로그 // setTimeout ..
두 번째 처리 결과: 40
세 번째 처리 결과: 80
```

`syntatic sugar` 라는 이름에 맞게, `async/await` 는 그저 코드를 동기적인 흐름처럼 사용 할 수 있게 하는 문법을 지원 할 뿐

자바스크립트 엔진에서 처리 될 땐 `then` 과 같은 프로미스 체이닝과 같은 로직으로 변환되어 처리된다.

그럼 나는 궁금하다 , 도대체 어떻게 처리되는걸까 ?

## `Bable` 을 이용해 폴리필 해보자

```jsx
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}
```

바벨 컴파일러를 이용해 `ES5` 버전으로 컴파일 하면 다음과 같은 두 개의 함수를 제공하고

`async,await` 가 사용된 해당 코드를 다음처럼 컴파일 해준다.

```jsx
function SugarCoat() {
  return _SugarCoat.apply(this, arguments);
}
function _SugarCoat() {
  _SugarCoat = _asyncToGenerator(
    /*#__PURE__*/ _regeneratorRuntime().mark(function _callee() {
      var result1, result2, result3;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1)
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return processData(10);
            case 2:
              result1 = _context.sent;
              console.log('첫 번째 처리 결과:', result1);
              _context.next = 6;
              return processData(result1);
            case 6:
              result2 = _context.sent;
              console.log('두 번째 처리 결과:', result2);
              _context.next = 10;
              return processData(result2);
            case 10:
              result3 = _context.sent;
              console.log('세 번째 처리 결과:', result3);
              return _context.abrupt('return', result3);
            case 13:
            case 'end':
              return _context.stop();
          }
      }, _callee);
    }),
  );
  return _SugarCoat.apply(this, arguments);
}
SugarCoat();
```

코드를 보면 제네레이터 뭐 어쩌구 하는데 .. `_regeneratorRuntime` 이란 함수가 주 역할인 것 같다.

컴파일 될 때 같이 생성된 해당 함수를 살펴보자

```jsx
function _regeneratorRuntime() {
  'use strict';
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime =
    function _regeneratorRuntime() {
      return e;
    };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o =
      Object.defineProperty ||
      function (t, e, r) {
        t[e] = r.value;
      },
    i = 'function' == typeof Symbol ? Symbol : {},
    a = i.iterator || '@@iterator',
    c = i.asyncIterator || '@@asyncIterator',
    u = i.toStringTag || '@@toStringTag';
  function define(t, e, r) {
    return (
      Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0,
      }),
      t[e]
    );
  }
  ... // 이후로 100줄 가량의 꼬부랑 외계어
```

도저히 전부를 파악하는 것이 불가능 할 것 같다.

그래서 여러 웹서핑과 서적을 뒤져보았다.

## 모던 자바스크립트 딥다이브에 답이 있었다.

킹갓 자바스크립트 딥다이브 감사합니다.

예전 자바스크립트 공부 할 때 사실 `async / await` 구문에 대한 내용에서 이에 대한 간략한 폴리필 예시가 존재했었는데

잠깐 읽고 슥 넘겼었는데 이번에 큰 도움이 되었다.

사실 `async / await` 는 선언문이기 때문에 정확한 폴리필이 존재하지는 않지만

전체 틀은 비슷하다.

그것은 바로 제네레이터를 이용하는 방식이다.

### 제네레이터 ?

제네레이터란 제네레이터 객체를 반환하는 함수를 의미한다.

제네레이터 객체란 이터러블이면서 `next` 메소드를 가지며

`next` 메소드의 반환값은 `interator result` 객체를 반환한다.

```jsx
function* generatorMaker() {
  yield 1;
  yield 2;
  yield 3;
}
```

다음과 같이 `*` 를 붙여 제네레이터 객체를 반환하는 제네레이터 함수를 생성해 줄 수 있다.

```jsx
function* generatorMaker() {
  console.log('첫 번째 호출');
  yield 1;
  console.log('두 번째 호출');
  yield 2;
  console.log('세 번째 호출');
  yield 3;
  console.log('네 번째 호출');
}

const generator = generatorMaker();
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
```

```json
첫 번째 호출
{ value: 1, done: false }
두 번째 호출
{ value: 2, done: false }
세 번째 호출
{ value: 3, done: false }
네 번째 호출
{ value: undefined, done: true }
```

해당 제네레이터 객체의 `next` 메소드의 반환값은 매번 `yield` 가 반환하는 값을 반환하며

`yield` 되기 이전까지의 코드 블록을 시행하고 호출이 중지된다는 특징이 있다.

또 각 `next` 메소드에는 인수를 추가해줄 수 있는데 해당 인수는

`yield` 문에 존재하는 변수에 할당된다는 특징이 있다

```jsx
function* generatorMaker() {
  // console.log(generator.next()); 실행
  console.log('첫번째 호출');
  const x = yield 1;
  // console.log(generator.next(100)); 실행
  console.log('두 번째 호출'); // generator.next(100) 로 인해 x 엔 100이 할당
  const y = yield x + 10;
  // console.log(generator.next(200)); 실행
  console.log(y);
  const z = yield y + 10; // generator.next(200) 로 y 엔 200이 할당
  console.log(z);
  console.log('세 번째 호출');
}

const generator = generatorMaker();
console.log(generator.next());
console.log(generator.next(100));
console.log(generator.next(200));
```

```json
첫번째 호출
{ value: 1, done: false }
두 번째 호출
{ value: 110, done: false }
100
{ value: 210, done: false }
```

해당 코드의 흐름을 보면 `y` 의 값은 x 가 1이였으니 11이여야 할 것 같지만

`next` 메소드의 인수로 건내준 100이 할당되어 `100 + 10` 이 되어 `110` 이 된다.

이 두 가지 특징을 가지고 `async / await` 간단한 폴리필을 살펴보자

### `async / await` 폴리필

```jsx
async function SugarCoat() {
  const result1 = await processData(10);
  console.log('첫 번째 처리 결과:', result1);
  const result2 = await processData(result1);
  console.log('두 번째 처리 결과:', result2);
  const result3 = await processData(result2);
  console.log('세 번째 처리 결과:', result3);
  return result3;
}
```

해당 `async / await` 로 정의된 코드를 제네레이터를 이용해 반환하게 되면 다음과 같이 변경된다.

> 실제로 변경되는 것은 아니지만 , 동작 원리는 유사하다.

```jsx
function* SugarCoat() {
  const result1 = yield processData(10);
  console.log('첫 번째 처리 결과:', result1);
  const result2 = yield processData(result1);
  console.log('두 번째 처리 결과:', result2);
  const result3 = yield processData(result2);
  console.log('세 번째 처리 결과:', result3);
  return result3;
}
```

`await` 부분이 모두 `yield` 로 변경된 제네레이터 함수로 변경된다.

이를 통해 `await` 부분은 코드의 흐름을 일시적으로 `yield` (중지) 시킬 수 있음을 알 수 있다.

```jsx
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
```

이후 `async` 선언문을 폴리필한 코드를 살펴보자

이는 재귀적으로 본인을 호출하는 `onResolve` 함수를 반환하는데 `onResolve` 함수는 생성된 제네레이터 객체를 기억하는 클로저 함수이다.

이터레이터 객체가 종료값을 뱉을 때 까지 `result.value` (이터레이터 리절트의 `value` 부분 ) 에 프로미스 체이닝을 하는 모습을 볼 수 있다.

이는 매번 반환되는 새로운 `Promise` 객체의 `[[PromiseFulfilledReaction]]` 에 `generator.next(이전 [[PromiseResult]])` 값을 넣어주는 모습임을 알 수 있다.

결국 `async / await` 는 `then` 체이닝에서 행해지는 `Promise` 객체들의

`[[PromisefulfilledReaction]]` 에 콜백 함수를 넣어 주는 것을

제네레이터를 이용해 구현된 것임을 알 수 있다.

## 드디어 예전 코드를 이해 할 수 있게 되었다.

예전 `async / await` 를 이용한 `try , catch` 문에서

컴포넌트의 `state` 가 변경되는 구문이 `await` 구문들 사이에 존재 할 때

컴포넌트들의 `re- rendering` 이 일어나면서도 `async / await` 구문은 연속해서 진행되는 것이 잘 이해가 안갔다.

```jsx
const useFetchingWeatherAir = () => {
  ...
  useEffect(() => {
    const fetchingWeatherAir = async () => {
      try {
        disptachStatus('Loading');
        const stationName = await fetchNearstStationName(lat, lon);
        const [...] = await Promise.all([...]);
        ...
        disptachStatus('OK');
      } catch (e) {
        ...
        disptachStatus(e.message);
        await delay(DELAY_TIME);
        navigate('/');
        disptachStatus('OK');
      }
    };
    fetchingWeatherAir();
  }, [lat, lon]);
};

export default useFetchingWeatherAir;
```

다음 코드에서 `dispatchStatus` 는 전역에 존재하는 `state` 를 변경시키는 훅인데

맨 처음 해당 코드를 구글링을 통해 알고 짰을 때

**아니, 상태가 변경되어서 `fetchingWeatherAir` 함수의 실행이 중단되었는데, 어떻게 다시 `await` 부분부터 다시 진행되지 ?**

하고 아주 멍청한 고민을 오랫동안 했었는데

지금 생각해보면 상태를 변경시키는 함수들은 본인 차례가 되면 콜스택에 샥샥 올라가게 되고

`await` 로 인해 `yield` 된 부분의 상태는 해당 `Promise` 객체가 `resolve` 될 때 까지 마이크로태스크 큐 -> 콜스택으로 올라가지 못하기 때문에

해당 부분 이후의 코드들은 실행자체가 되지 않고 대기하게 되는 것이였다.

마법같은 단어로 느껴졌던 `async / await` 구문을 제네레이터의 `yield` 의 개념과 `Promise` 객체, 마이크로 태스크 큐에 대한 공부를 하고 나서 보니

드디어 코드가 보이는 것 같다. :)
