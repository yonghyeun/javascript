폴리필이란 특정 자바스크립트의 API를 지원하지 않는 구형 브라우저에게

해당 API의 기능을 제공하는데 필요한 코드를 의미한다.

좀 더 자세한 내용은 폴리필이란 단어를 제안한 이의 포스팅을 통해 보도록 하자
<a href = 'https://remysharp.com/2010/10/08/what-is-a-polyfill'>Where polyfill came from / on coining the term </a>

> ![](https://velog.velcdn.com/images/yonghyeun/post/e5c8cf6b-4e46-437b-ba4b-4b425dd9e8a9/image.png)
> 폴리필은 차갑다 ..

---

나는 배열의 API 를 몇 개만 특정적으로 사용해봤을 뿐 정확하게 알고 있다는 느낌이 들지 않았다.

그래서 `MDN` 이나 교재를 더 읽어볼까 하다가

읽어보는 것보다 직접 만들어보는게 더 재밌고 깊게 배울 수 있을 것 같아

폴리필을 구현해보도록 하려고 한다.

구현해보는 API 들의 순서는 `MDN` 에 기술된 메소드들의 순으로 하도록 한다.

또한 메소드에 대한 모든 설명의 출처는 `MDN` 이다.

# 테스트 코드 준비하기

```js
export default class Tester {
  generateRandomArray = () => {
    /* 길이가 50 ~ 150 사이의 랜덤한 배열 생성
    배열은 Object 에서 length 프로퍼티를 가지며 [Symbol.iterator] 내부 프로퍼티를 갖는다
    */
    const length = Math.floor(50 + Math.random() * 100);
    const randomArray = {
      length,
      *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i += 1) {
          yield this[i];
        }
      },
    };
    for (let i = 0; i < length; i += 1) {
      randomArray[i] = Math.random() * 100;
    }

    return randomArray;
  };

  areEquals = (group1, group2) => {
    /* 두 group1 , group2가 같은 값을 갖는지 확인 */

    /* 옵셔널 체이닝을 이용하여 group1, group2 가 undefined 거나
    length 프로퍼티를 갖지 않는다면  group1 , group2 는 원시값이니 원시값 비교
    */
    if (!group1?.length && !group2?.length) {
      return group1 === group2;
    }
    /* group1 , group2 가 배열이라면 각 값의 길이가 같은지 확인 */
    if (group1.length !== group2.length) return false;

    /* group1 , gorup2의 길이가 같다면 원소가 같은지 확인 */
    for (let i = 0; i < group1.length; i += 1) {
      if (group1[i] !== group2[i]) return false;
    }
    /* 모든 조건을 만족한다면 group1 , group2 는 같다 */
    return true;
  };

  test = (array, API, polyfill, ...args) => {
    const { areEquals } = this;
    const arr1 = [...array];
    const arr2 = [...array];

    const result1 = API.call(arr1, ...args);
    const result2 = polyfill.call(arr2, ...args);
    /*
    arr1,arr2 와 result1, result2를 모두 비교하는 것은 메소드가
    원본 메소드를 반환하는 Mutator Method 일 수도 있기 때문 
    */

    return areEquals(arr1, arr2) && areEquals(result1, result2);
  };

  crossTest = (API, polyfill, ...args) => {
    const numTest = 5;
    const { generateRandomArray, test } = this;
    let i = 0;
    while (i < numTest) {
      const randomArray = generateRandomArray();
      const result = test(randomArray, API, polyfill, ...args);
      console.log(`${i + 1}번째 TEST : ${result ? '통과' : '실패'}`);
      i += 1;
    }
  };
}
```

테스트 코드를 이렇게 적는지는 모르겠으나 내 나름대로 테스트 코드를 작성해봤다.

설명은 주석에 써뒀으니 참고하길 바란다!

최대한 `Tester` 에서는 `Array.prototype` 을 사용하지 않으려고 노력했다.

> 지금 생각해보면 generateRandomArray 메소드는 모두 동일한 타입의 원소들이 담긴 배열이며 길이만 다르기 때문에 크기 유의미하지 않은 것 같다 ..
> 다양한 데이터 타입을 넣을 수 있도록 했어야 했는데

---

# `Array.prototype.at`

```
Array 인스턴스의 at() 메서드는 정숫값을 받아 해당 인덱스에 있는 항목을 반환하며,
양수와 음수를 사용할 수 있습니다. 음의 정수는 배열의 마지막 항목부터 거슬러 셉니다.
```

```js
at(index);
```

`index` 값을 넣어 반환값을 가져오면 되는 프로토타입 메소드

```js
Array.prototype.atCustom = function (index) {
  const indexInteger = Math.floor(index);
  return this[indexInteger < 0 ? this.length + indexInteger : indexInteger];
};

tester.crossTest(Array.prototype.at, Array.prototype.atCustom, 42);
tester.crossTest(Array.prototype.at, Array.prototype.atCustom, -42);
```

모두 통과 ~!!

---

# `Array.prototype.concat`

```
Array 인스턴스의 concat() 메서드는 두 개 이상의 배열을 병합하는 데 사용됩니다.
이 메서드는 기존 배열을 변경하지 않고, 새 배열을 반환합니다.
```

```js
concat();
concat(value0);
concat(value0, value1);
concat(value0, value1, /* …, */ valueN);
```

만일 인자로 들어온 배열에 `[1,2,3,['a' , 'b']]` 이런 경우에는 얕게 합쳐진다.

```js
Array.prototype.concatCustom = function (...args) {
  const result = [...this];
  for (let index = 0; index < args.length; index += 1) {
    const target = args[index];
    if (Object.prototype.hasOwnProperty.call(target, 'length')) {
      for (let subIndex = 0; subIndex < target.length; subIndex += 1) {
        result[result.length] = target[subIndex];
      }
    } else {
      result[result.length] = target;
    }
  }
  return result;
};

args = [1, 2, 3, ['a', 'b'], true, false];
tester.crossTest(Array.prototype.concat, Array.prototype.concatCustom, args);
```

통과 ~!!

---

# `Array.prototype.copyWithin`

```
Array 인스턴스의 copyWithin() 메서드는 배열의 일부를 같은 배열의 다른 위치로 얕게 복사하며,
배열의 길이를 수정하지 않고 해당 배열을 반환합니다.
```

```js
copyWithin(target, start);
copyWithin(target, start, end);
```

`copyWithin` 은 배열에서 `target` 인덱스 위치부터 `start ~ end - 1` 인덱스 사이의 값을 얕게 복사하여 덮어 씌운다.

이후 덮어 씌워진 원본 배열을 반환한다.

이 때 인덱스들은 음수도 사용 가능하며 음수일 경우엔 끝에서부터 센다.

```js
Array.prototype.copyWithinCustom = function (target, start, end = this.length) {
  /* 정수 형 변환 */
  [target, start, end] = [
    Math.floor(target),
    Math.floor(start),
    Math.floor(end),
  ];

  /* 음수일 경우엔 인덱스 값 변경 */
  target = target < 0 ? this.length + target : target;
  start = start < 0 ? this.length + start : start;
  end = end < 0 ? this.length + end : end;

  if (target >= this.length || start > end) return this;

  /* start 부터 end-1 까지의 복사본 생성 */
  const copiedArr = { length: 0 };
  for (let index = 0; index < end - start; index += 1) {
    copiedArr[index] = this[start + index];
    copiedArr.length += 1;
  }

  for (let index = 0; index < copiedArr.length; index += 1) {
    this[target + index] = copiedArr[index];
  }

  return this;
};

/* 테스트케이스를 생각해보자
1. start < target < end [정상작동] 
2. target < start < end [정상작동]
3. end < target < start [작동X]
4. end < start < target [작동X]
*/
```

모두 통과 ~!!

생각보다 오래 걸렸다. `copiedArr` 를 담는 것 까진 쉽게 됐는데

원본 데이터에서 `copiedArr` 의 값으로 변경하는 것을 생각하는게

왜이리 오래걸렸을까

컥

---

# 🙅‍♂️테스트코드 한계점

맨 처음 작성했던 테스트 코드는 `...args` 인수에 따라 결과가 바뀌는게 아니라

생성되는 배열에 따라서만 결과가 바뀐다.

그러니 다양한 인수에 따른 테스트 케이스를 고려 할 수 없기 때문에

고쳐야 한다.

또한 배열에 있는 값이 모두 숫자형이라는 한계점이 존재하기 때문에

간단한 메소드인 경우에만 사용하도록 하고

다양한 테스트 케이스가 필요한 메소드에 대해서는 직접 다양한 테스트 케이스 조건을 만들고

반복문을 이용해 다양하게 테스트를 해봐야겠다.

---

# `Array.prototype.entries`

```
Array.prototype.entries()
Array 인스턴스의 entries() 메서드는 배열의 각 인덱스에 대한 키/값 쌍을
포함하는 새 배열 반복자 (en-US) 객체를 반환합니다.
```

```js
entries();
```

`entries()` 메소드는 이터레이터 객체를 반환하며

이터레이터 객체가 반환하는 이터레이터 리절트는

`{value : [index , value] , done : boolean}` 다음처럼 생겼다.

`console.dir` 을 통해 반환되는 이터레이터 객체의 생김새를 봐보자

![](https://velog.velcdn.com/images/yonghyeun/post/f5885176-4177-420b-a616-8f590d58935a/image.png)

`next` 메소드를 가지며 `Symbol(Symbol.toStringTag)` 프로퍼티를 갖는 이터레이터 객체를 반환한다.

이터레이터 객체가 반환되는 것의 포인트는 **`for of`** 문을 사용 가능해진다는 것이다. `for of` 문은 해당 객체가 가지고 있는 `[Symbol.iterator]` 프로퍼티에 접근하여 **이터레이터 객체를 받는다 **

이후 이터레이터의 `next()` 메소드를 호출하여 반복문을 도는 것이다.

```js
Array.prototype.entriesCustom = function () {
  let idx = 0;
  const length = this.length;
  const data = this;

  const iterator = {
    next() {
      return {
        /* next 메소드는 idx , length , data 를 참조하는
        클로저 함수
        */
        value: idx < length ? [idx, data[idx]] : undefined,
        done: idx++ < length ? false : true,
      };
    },
    [Symbol.iterator]() {
      return this; /* for of 문으로 호출되면 iterator 자기 자신을*/
    },
    [Symbol.toStringTag]: 'My custom entries',
  };
  return iterator;
};

const arr = [1, 2, 3];
const iterator = arr.entriesCustom();
for (let key of iterator) {
  console.log(key);
  /*
  [ 0, 1 ]
  [ 1, 2 ]
  [ 2, 3 ]
  */
}
```

> `[Symbol.toStringTag]` 프로퍼티를 넣는 이유는 반환되는 이터레이터 객체를 `console.log` 나 `console.dir` 하였을 때 이터레이터의 내부가 보이는 것이 아닌 선택한 문자열이 나오게 하기 위함이였다.
>
> > 다만 나는 구현을 하지 못했다. 슬프게도 .. 좀 더 생각해봐야겠다.

> `Array.prototype.entires` 로 생성된 이터레이터 객체는 `[Symbol.iterator]` 프로퍼티가 없는데 어떻게 `for of` 문으로 순회가 가능할까 뒤져봤는데
> ![](https://velog.velcdn.com/images/yonghyeun/post/4c260805-4c13-493e-9e98-415ae0cd8cf4/image.png) > `[Symbol.iterator]` 프로퍼티를 갖는 객체를 상속받아 생성된 객체였다.

---

# `Array.prototype.every`

```
Array 인스턴스의 every() 메서드는 배열의 모든 요소가 제공된 함수로
구현된 테스트를 통과하는지 테스트합니다.

이 메서드는 불리언 값을 반환합니다.
```

```js
every(callbackFn);
every(callbackFn, thisArg);
```

```
every() 메서드는 순회 메서드입니다. 배열의 각 요소에 대해 제공된
callbackFn 함수를 한 번씩 호출하고,
callbackFn이 거짓 값을 반환할 때까지 호출을 반복합니다. 거짓 요소가 발견되면
every()는 즉시 false를 반환하고 배열 순회를 중지합니다.
그렇지 않고 callbackFn이 모든 요소에 대해 참 값을 반환하면,
every()는 true를 반환합니다.
```

**포인트**

- `every` 메소드에 전달되는 `callback` 함수는 `index , element , array ( 자신을 호출한)` 를 인수로 받는다.
- `every` 메소드에 전달되는 콜백 함수는 자신을 호출한 배열의 형태를 변경시키는 것이 가능하다.
- 희소배열의 경우에는 콜백함수를 시행하지 않는다.

```js
Array.prototype.everyCustom = function (callbackFn, thisArg = this) {
  for (let index = 0; index < this.length; index += 1) {
    if (!index in thisArg) continue;
    if (!callbackFn(thisArg[index], index, thisArg)) return false;
  }
  return true;
};
```

테스트 케이스를 작성해보자

```js
let arr = Array.from({ length: 10 }, (_, idx) => idx + 1);

const test1 = (elem) => typeof elem === 'number'; /* true */
const test2 = (elem, index) => elem > index; /* true */
const test3 = (elem, index, thisArg) => {
  /* 원본 배열의 형태를 바꾸는 콜백 함수 
  원본 배열의 값을 하나씩 pop() 하여 
  결국 length 는 값에 들은 elem 보다 작은 값이 나와야 함
  false
  */
  thisArg.pop();
  return thisArg.length > elem;
};

console.log(arr.everyCustom(test1)); // true
console.log(arr.everyCustom(test2)); // true
console.log(arr.everyCustom(test3)); // false
console.log(arr); // [1,2,3,4,5]
```

구우우웃~~

---

# `Array.prototype.fill`

```
Array.prototype.fill()
Array 인스턴스의 fill() 메서드는 배열의 인덱스 범위 내에 있는 모든 요소를
정적 값으로 변경합니다. 그리고 수정된 배열을 반환합니다.
```

```js
fill(value);
fill(value, start);
fill(value, start, end);
```

> **포인트** > ![](https://velog.velcdn.com/images/yonghyeun/post/b43bedc5-b834-4001-a076-712b4af54f13/image.png)

```js
Array.prototype.fillCustom = function (value, start = 0, end = this.length) {
  /* 기본 조건 */
  if (start < -this.length) start = 0;
  if (start > this.length) return this;
  if (end < -this.length) end = 0;
  if (end >= this.length) end = this.length;

  /* start 와 end 정수로 형변환 하기 */
  [start, end] = [Math.floor(start), Math.floor(end)];
  /* 음수일 경우 형 변환 */
  start = start < 0 ? this.length + start : start;
  end = end < 0 ? this.length + end : end;
  /* start 와 end 가 적절하지 않을 경우 실행하지 않음 반환 */
  if (start > end) return this;

  let index = start;
  while (index < end) {
    this[index] = value;
    index += 1;
  }
  return this;
};
```

기본 조건에 맞춰 값들을 설정해줬다.

이번에는 테스트코드를 작성해보자

### 테스트코드

```js
const testCustomfill = (array, testNum = 100000) => {
  /* test에 사용할 array 의 길이는 100 */
  let trial = 0;
  let value, start, end;
  while (trial < testNum) {
    let arr1 = [...array];
    let arr2 = [...array];

    value = Math.random();
    start = Math.floor(Math.random() * 100);
    end = Math.floor(Math.random() * 100);

    start = Math.random() > 0.5 ? start : -start;
    end = Math.random() > 0.5 ? end : -end;

    arr1.fill(value, start, end);
    arr2.fillCustom(value, start, end);

    for (let index = 0; index < arr1.length; index += 1) {
      if (arr1[index] !== arr2[index]) return '실패';
    }
    trial += 1;
  }
  return '통과';
};

let array = Array.from({ length: 100 }, (_, index) => index);
console.log(testCustomfill(array)); // 통과
```

얄루

---

# `Array.prototype.filter`

```
Array 인스턴스의 filter() 메서드는 주어진 배열의 일부에 대한
얕은 복사본을 생성하고, 주어진 배열에서 제공된 함수에 의해
구현된 테스트를 통과한 요소로만 필터링 합니다.
```

```js
filter(callbackFn);
filter(callbackFn, thisArg);
```

> 포인트
>
> - 호출한 배열의 얕은 복사본을 반환한다.
> - `callbackFn` 은 `elem , index, array` 를 인수로 받는다.

```js
Array.prototype.filterCustrom = function (callbackFn, thisArg = this) {
  const { length } = this;
  const resultArr = [];
  for (let index = 0; index < length; index += 1) {
    const elem = this[index];
    if (!elem) continue;
    if (callbackFn(elem, index, thisArg)) resultArr.push(elem);
  }
  return resultArr;
};
```

얄루 ~~

---

# `Array.prototype.find`

```
Array 인스턴스의 find() 메서드는 제공된 배열에서 제공된
테스트 함수를 만족하는 첫 번째 요소를 반환합니다.
 테스트 함수를 만족하는 값이 없으면 undefined가 반환됩니다.

배열에서 찾은 요소의 인덱스가 필요한 경우, findIndex()를 사용하세요.
값의 인덱스를 찾아야 하는 경우, indexOf()를 사용하세요.
 (findIndex()와 유사하지만, 테스트 함수를 사용하는 것 대신
 각 요소가 값과 동일한지 확인합니다.)
배열에 값이 존재하는지 찾아야 하는 경우, includes()를 사용하세요.
 이 역시 테스트 함수를 사용하는 것 대신 각 요소가 값과 동일한지
 확인합니다.
제공된 테스트 함수를 만족하는 요소가 있는지 찾아야 하는 경우, some()을 사용하세요.
```

```js
find(callbackFn);
find(callbackFn, thisArg);
```

> 포인트
>
> - callbackFn은 값이 할당된 인덱스뿐만 아니라 배열의 모든 인덱스에 대해 호출됩니다. 희소 배열의 빈 슬롯은 undefined와 동일하게 동작합니다.
>   > 희소배열의 경우에도 동일하게 작동하는구나

```js
Array.prototype.findCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = 0; index < length; index += 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return elem;
  }
  return undefined;
};
```

굿 쉽다쉬워

---

# `Array.prototype.findIndex`

```
Array.prototype.findIndex()
findIndex() 메서드는 주어진 판별 함수를 만족하는 배열의
첫 번째 요소에 대한 인덱스를 반환합니다. 만족하는 요소가 없으면 -1을 반환합니다.

판별 함수를 만족하는 첫번째 인덱스 대신 값을 반환하는 find() 메서드도 참고하세요.
```

```js
Array.prototype.findIndexCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = 0; index < length; index += 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return index;
  }
  return -1;
};
```

쉽다쉬워

---

# `Array.prototype.findLast`

```
Array.prototype.findLast()
Array 인스턴스의 findLast() 메서드는 배열을 역순으로 순회하며
제공된 테스트 함수를 만족하는 첫 번째 요소의 값을 반환합니다.
테스트 함수를 만족하는 요소가 없으면 undefined가 반환됩니다.
```

> 포인트
> 나는 이름만 보고 아 ~ 반복문을 다 돌고나서 조건을 만족하는 마지막 값을 찾으면 되겠구나 했는데
> **??? : ㅋㅋ 배열의 마지막부터 순회하면 되는디 ㅋㅋ**
> 와우 이렇게 돌아가더라 왜 그걸 생각못했지 !

```js
Array.prototype.findLastCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = length - 1; index > 0; index -= 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return elem;
  }
  return undefined;
};
```

가볍고 가볍고

---

# `Array.prototype.findLastIndex`

```
Array.prototype.findLastIndex()
findLastIndex() 메서드는 배열을 역순으로 순회하며 주어진 판별 함수를
만족하는 만족하는 배열의 첫번째 요소의 인덱스를 반환합니다.
만족하는 요소가 없으면 -1을 반환합니다.

인덱스 대신 판별함수를 만족하는 마지막 값을 반환하는findLast()메서드도 참고하세요.
```

```js
findLastIndex(callbackFn);
findLastIndex(callbackFn, thisArg);
```

```js
Array.prototype.findLastIndexCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = length - 1; index > 0; index -= 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return index;
  }
  return -1;
};
```

가볍고 가볍고

> 아니 근데 어쩔땐 return 값이 -1 , undefined냐
> 진짜 열받네

---

# `Array.prototype.flat()`

```
Array 인스턴스의 flat() 메서드는 모든 하위 배열 요소가
지정된 깊이까지 재귀적으로 연결된 새 배열을 생성합니다.
```

```js
flat();
flat((depth = 1));
/* depth 는 평탄화 할 깊이 */
```

> 포인트
> `depth` 에 적힌 깊이 만큼의 희소배열은 무시한다.
>
> ```js
> const arr = [1, , 2, [3, , 4, [5, , 6]]];
> console.log(arr.flat(depth = 1));
> /* [ 1, 2, 3, 4, [ 5, <1 empty item>, 6 ] ] */
>
> 얕은 복사본을 return 한다.
> ```

오 .. 조금 어렵다 생각해보자

재귀함수를 이용해야 하며 재귀 함수의 중단 조건은 두 가지다.

1. 배열의 모든 원소가 중첩되지 않은 상태이거나
2. 인수로 받은 `depth` 이상 재귀 함수가 실행 되었을 때

콜스택에 쌓이는 재귀 함수에서 인수로 받은 `depth` 에 접근하려면

클로저 함수 형태로 사용해야겠구나

> 오마이갓 이번엔 진짜 오래걸렸다
> 재귀함수는 항상 할 때 마다 헷갈리는 것 같다

```js
Array.prototype.flatCustom = function (depth = 1) {
  if (!depth) return this;
  const { length } = this;
  const result = [];

  const recursionFunc = (elem, depth) => {
    /* 
    recursionFunc은 상위 렉시컬 환경의 depth 를 참조하는 클로저 함수 
    depth가 0이거나 배열이 아닌 경우 result 추가 후 종료 */
    if (!depth || !elem.length) {
      result.push(elem);
      return;
    }

    /* 
    인수로 넘겨 받은 elem 이 배열일 경우 elem 을 순회하며 recursionFunc 재귀호출
    재귀호출 시 depth 를 1 감소 시킨 후 호출하도록 함 
    */
    const { length } = elem;
    depth -= 1;
    for (let index = 0; index < length; index += 1) {
      if (index in elem) recursionFunc(elem[index], depth);
    }
  };

  for (let index = 0; index < length; index += 1) {
    const elem = this[index];
    if (!elem) continue; /* 희소배열 경우엔 무시하도록 함 */
    recursionFunc(elem, depth);
  }
  return result;
};
```

`flatCustom` 함수는 `this` 배열을 모두 순회하며 희소값인 경우에는 건너 뛰고 희소값이 아닌 경우엔 `recursionFunc` 을 호출한 후 결과값을 담은 `result` 배열을 반환한다.

그럼 `recurssionFunc` 에 대해 생각해보자

우선적으로 `recursionFunc` 은 함수를 호출한 상위 렉시컬 환경의 `result , depth` 값에 접근하거나 수정 할 수 있는 클로저 함수이다.

`recurssionFunc` 은 세 가지 조건에 따라 행동 양상이 존재한다.

1. `depth` 가 0일 때
   `depth` 가 0이되면 인수로 받은 `elem` 이 배열이건 아니건 상관없이 `result` 값에 추가하고 종료한다.

2. `depth` 가 0이 아니고 `elem` 이 배열이 아닌 경우
   `elem` 이 배열이 아니라면 `result` 값에 추가하고 종료 한다.

3. `depth` 가 0이 아니며 `elem` 이 배열일 경우
   `length` 프로퍼티가 존재하는 `elem` 인 경우 `elem` 을 순회하며 `recursionFunc` 을 재귀 호출한다.
   재귀 호출 할 때 평탄화 작업이 이뤄지기 때문에 `depth` 값을 1 감소 시킨 후 인수로 넘겨준다.

### 테스트 코드

```js
const testCustomflat = (arr, maxNestedLevel) => {
  const { length } = arr;
  for (let nestLevel = 1; nestLevel < maxNestedLevel; nestLevel += 1) {
    const original = arr.flat(nestLevel);
    const custom = arr.flatCustom(nestLevel);

    for (let index = 0; index < length; index += 1) {
      if (original[index].toString() !== custom[index].toString()) {
        console.log('실패');
        return;
      }
    }
    console.log(original);
    console.log(custom);

    console.log('통과');
  }
};

const testCases = [
  [[1, 2, [3, 4, [5, 6]], 7, [8, 9]], 3],
  [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]]], 8],
  [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], 10], 8],
  [[1, 2, 3, 4, 5, 6, 7, 8, 9], 1],
  [[[1], [2], [3], [4], [5], [6], [7], [8], [9]], 9],
  [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], [10, [11, [12]]]], 11],
  [
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    3,
  ],
  [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], 10, [11, [12, [13, [14]]]]], 12],
];

testCases.forEach((testcase) => {
  testCustomflat(...testcase);
});
```

엄청나게 중첩 시킨 테스트 케이스들과 해당 케이스의 최대 중첩 개수를 인수로 받아

0부터 최대 중첩개수까지 모두 `flat() , flatCustom()` 함수의 실행 결과 배열을 비교한다.

> 비교 할 때 원소값들이 객체나 배열인 경우에는 비교 연산자로 비교가 불가능하다.
> 그래서 `toString` 을 사용해주었다.

모두 잘 통과한다 구우웃 이렇게 뿌듯 할 수가 ㅎㅎ

---

# `Array.prototype.flatMap`

```
Array 인스턴스의 flatMap() 메서드는 배열의 각 요소에 주어진 콜백 함수를 적용한 다음
그 결과를 한 단계씩 평탄화하여 형성된 새 배열을 반환합니다.

이 메서드는 map() 뒤에 깊이 1의 flat()을 붙이는
(arr.map(...args).flat())과 동일하지만,
두 메서드를 따로 호출하는 것보다 약간 더 효율적입니다.
```

```js
flatMap(callbackFn);
flatMap(callbackFn, thisArg);
```

> 처음본다 신기하다.

`flatMap` 은 인수로 받은 `callbackFn` 이 배열의 원소값을 `[]` 에 담아 반환 할 경우 해당 결과 값을 **1번만 평탄화** 한 후 반환한다.

```js
const arr1 = [1, 2, 3, 4];

arr1.map((x) => [x * 2]);
// [[2], [4], [6], [8]]

arr1.flatMap((x) => [x * 2]);
// [2, 4, 6, 8]

// 오직 한 단계만 평탄화됩니다.
arr1.flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]
```

마치 다음처럼 말이다.

```js
Array.prototype.flatMapCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  const result = [];

  for (let index = 0; index < length; index += 1) {
    const elem = thisArg[index];
    if (index in thisArg) {
      const subResult = callbackFn(elem, index, thisArg);
      if (subResult.length) {
        for (let subIndex = 0; subIndex < subResult.length; subIndex += 1) {
          result.push(subResult[subIndex]);
        }
      } else {
        result.push(subResult);
      }
    }
  }
  return result;
};
```

한단계만 평탄화하면 되니 콜백 함수의 반환값이 배열일 경우 반복문을 통해 평탄화 작업을 해주었다.

---

# `Array.prototype.forEach`

```
Array.prototype.forEach()
Array 인스턴스의 forEach() 메서드는 각 배열 요소에 대해
제공된 함수를 한 번씩 실행합니다.
```

```js
forEach(callbackFn);
forEach(callbackFn, thisArg);
```

```js
Array.prototype.forEachCustom = async function (callbackFn, thisArg = this) {
  /* 비동기 함수들을 async/await 하는 커스텀 forEach */
  const { length } = thisArg;

  for (let index = 0; index < length; index += 1) {
    const elem = await thisArg[index];
    console.log(`이벤트 루프에서 ${elem}이 콜스택에 담겼어요`);

    if (index in thisArg) callbackFn(elem, index, thisArg);
  }
  console.log('콜스택 종료');
};
```

> 포인트
>
> - `forEach` 는 희소값에 대해서는 순회하지 않는다.
> - `forEach`에선 명시적으로 이터레이션을 중단 할 방법이 존재하지 않는다.
> - **`forEach` 문에서는 동기함수를 기대하며 비동기 함수의 경우 `async/await` 가 불가능하다.**

`forEach` 문은 비동기 함수를 기다리지 않고 이터레이션 한다.

그렇기에 반복문을 이용해 비동기 함수들을 순회하고 싶다면 `for of` 문이나 `map , filter , reduce` 와 같은 메소드를 `async/await` 선언문과 함께 사용해야 한다.

> ### 왜 `forEach` 는 비동기 함수를 기다리지 않나요 ?
>
> `async/await` 를 이용해 비동기 함수를 동기 함수처럼 사용하기 위해선 해당 함수가 `async` 로 정의되어 있어야 `await` 선언을 통해 동기함수처럼 멈춰둘 수 있다.
>
> 하지만 `Array.prototype.forEach` 에 선언되어 있는 메소드는 `async` 로 선언되어있지 않기 때문에 불가능하다.

```js
const asyncIterable = [
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, 1000),
  ),
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(2);
    }, 1000),
  ),
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(3);
    }, 1000),
  ),
];

const forOfPromise = async (iterable) => {
  for await (const promise of iterable) {
    console.log(promise);
  }
};

forOfPromise(asyncIterable);

asyncIterable.forEach((promise) => console.log(promise));
```

```
/* forOfPromise 는 이벤트 루프에 넘어갔음으로 콜스택엔 forEach 문이 먼저 실행됨 */
Promise { <pending> }
Promise { <pending> }
Promise { <pending> }

/* 콜스택에서 forEach 문이 제거되고 for of 문에서
Promise 객체들이 settle 될 때 마다 로그됨 */
1
2
3
```

그럼 `forEachCustom` 에서 `async/await` 로 선언해줘볼까 ?

```js
Array.prototype.forEachCustom = async function (callbackFn, thisArg = this) {
  /* 비동기 함수들을 async/await 하는 커스텀 forEach */
  const { length } = thisArg;

  for (let index = 0; index < length; index += 1) {
    const elem = await thisArg[index];
    console.log(`이벤트 루프에서 ${elem}이 콜스택에 담겼어요`);

    if (index in thisArg) callbackFn(elem, index, thisArg);
  }
  console.log('콜스택 종료');
};

asyncIterable.forEachCustom((promise) => console.log(promise));
console.log('forEach문은 이벤트 루프로 빠져나가서 제가 먼저 실행됩니다');
```

```
forEach문은 이벤트 루프로 빠져나가서 제가 먼저 실행됩니다
이벤트 루프에서 1이 콜스택에 담겼어요
1
이벤트 루프에서 2이 콜스택에 담겼어요
2
이벤트 루프에서 3이 콜스택에 담겼어요
3
콜스택 종료
```

---

# `Array.prototype.from`

```
Array.from() 정적 메서드는 순회 가능 또는 유사 배열 객체에서
얕게 복사된 새로운 Array 인스턴스를 생성합니다.
```

```js
Array.from(arrayLike);
Array.from(arrayLike, mapFn);
Array.from(arrayLike, mapFn, thisArg);
```

> 오 .. `Array.from` 에서 이렇게 많은 인수들이 사용되는지 몰랐다.

> 포인트
>
> - `Array.from(obj, mapFn, thisArg)`는 중간 배열을 생성하지 않는다는 점과 배열이 아직 생성 중이기 때문에 전체 배열 없이 두 개의 인수(element, index)만 받는다는 점을 제외하면 `Array.from(obj).map(mapFn, thisArg) `과 동일한 결과를 가져옵니다.
>   > 희소값은 무시한다.
>   >
>   > 희소값을 무시하는 행위들은 **형식화된 배열**에서 특히 중요하다고 하는데
>   > 형식화된 배열에 대해 찾다보니, 배열의 개념에 대해서 더 공부해야 할 필요성을 느꼈다. 나는 동적 배열만 사용해봤다 보니 정적 배열에 대한 개념이 부족한 것 같다.
>   > 이 부분에 대해서는 따로 더 공부해봐야겠다.

### 👀 희소배열에서 희소값 올바르게 걸러내는 방법을 찾았다.

### 동적배열의 특징을 생각해봐야 한다 !!

위에서는 희소값을 걸러내기 위해 여태 `if (elem)` 처럼 사용했는데 이 방법들은 모두 자동 형변환을 이용해서 `undefined` 를 걸러내기 위함이였다.

하지만 생각해보면 이같은 방법은 `0 , '0' , false` 와 같은 값까지 걸러내기 때문에 적절한 방법이 아녔다.

자바스크립트의 동적 배열은 정적 배열을 사용하는 언어들처럼 메모리 공간에 원소들을 삽입하는 것이 아닌

순회 가능한 객체 형태로 생성된다.

그러니 정적 배열의 경우엔 `array[index]` 로 접근하면

메모리 공간에서 `index  * array 의 원소크기` 에 담긴 원소 값으로 접근 가능했으나

**자바스크립트에선 연속되지 않은 메모리 공간에 특정 원소들을 넣어두고, 각 `index` 들은 원소들의 주소를 참조하는 자료 구조 형태로 존재한다. **

> 오 마이 갓 그래서 정적 배열을 사용하는 경우가 메모리 관리에 더 좋다는 이유가 이런거였구나
> 물론 엄격하게 메모리 공간을 할당하고 삭제하는 것도 이유지만 말이다

**그래서 !!!!**

**희소값 (`undefined , null , NaN` 이 아닌 정말 아무것도 없는) 의 경우엔 메모리에 원소값 자체가 할당되지 않기 때문에 자바스크립트에서 인덱스 자체가 존재하지 않는다!!!**

```js
const sparseArr = [1, 2, , 3, undefined, null, NaN];

for (let index = 0; index < sparseArr.length; index += 1) {
  process.stdout.write(index in sparseArr ? 'true ' : 'false ');
} // true true false true true true true
```

**애초에 희소배열 (배열은 이터러블하고 프로토타입이 존재하는 럭키 객체) 의 희소값은 인덱스 (사실은 프로퍼티입니다) 자체가 존재하지 않는다고!@!@!@!@@!**

> 객체를 생성 할 때 희소값 자체는 프로퍼티키 자체를 생성하지 않는다.

![](https://velog.velcdn.com/images/yonghyeun/post/73399ae0-5831-4aa7-a272-c9a0388539b6/image.gif)

그래서 희소배열에서 희소값을 걸러낼 때는 인덱스가 해당 배열에 존재하는지 안하는지만 확인하면 된다.

ㅎㅎ
