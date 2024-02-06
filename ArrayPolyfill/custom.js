/* eslint-disable no-extend-native */

import Tester from './Test.js';
const tester = new Tester();
/*
Array.prototype.at
반환할 배열 요소의 0부터 시작하는 인덱스로, 정수로 변환됩니다.
음수 인덱스는 배열 끝부터 거슬러 셉니다. index < 0인 경우, index + array.length로 접근합니다.
*/
Array.prototype.atCustom = function (index) {
  const indexInteger = Math.floor(index);
  return result[indexInteger < 0 ? result.length + indexInteger : indexInteger];
};

// tester.crossTest(Array.prototype.at, Array.prototype.atCustom, 42);
// tester.crossTest(Array.prototype.at, Array.prototype.atCustom, -42);

/*
Array.prototype.concat 
Array 인스턴스의 concat() 메서드는 두 개 이상의 배열을 병합하는 데 사용됩니다. 
이 메서드는 기존 배열을 변경하지 않고, 새 배열을 반환합니다.
*/
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

// const args = [1, 2, 3, ['a', 'b'], true, false];
// tester.crossTest(Array.prototype.concat, Array.prototype.concatCustom, args);

/*
Array.prototype.copyWithin
Array 인스턴스의 copyWithin() 메서드는 배열의 일부를 같은 배열의 다른 위치로 얕게 복사하며,
배열의 길이를 수정하지 않고 해당 배열을 반환합니다.
*/
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

// tester.crossTest(
//   Array.prototype.copyWithin,
//   Array.prototype.copyWithinCustom,
//   [3, 30, 60],
// );

// tester.crossTest(
//   Array.prototype.copyWithin,
//   Array.prototype.copyWithinCustom,
//   [30, 3, 60],
// );

// tester.crossTest(
//   Array.prototype.copyWithin,
//   Array.prototype.copyWithinCustom,
//   [60, 30, 3],
// );

// tester.crossTest(
//   Array.prototype.copyWithin,
//   Array.prototype.copyWithinCustom,
//   [60, 30, 3],
// );

/*
Array.prototype.entries()
Array 인스턴스의 entries() 메서드는 배열의 각 인덱스에 대한 키/값 쌍을 포함하는 새 배열 반복자 (en-US) 객체를 반환합니다.

entries()
*/

Array.prototype.entriesCustom = function () {
  let idx = 0;
  const length = this.length;
  const data = this;

  const iterator = {
    next() {
      return {
        value: idx < length ? [idx, data[idx]] : undefined,
        done: idx++ < length ? false : true,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
    [Symbol.toStringTag]: 'My custom entries',
  };
  return iterator;
};

/*
Array.prototype.every()
Array 인스턴스의 every() 메서드는 배열의 모든 요소가 제공된 함수로 구현된 테스트를 통과하는지 테스트합니다. 
이 메서드는 불리언 값을 반환합니다.

every(callbackFn)
every(callbackFn, thisArg)
*/

Array.prototype.everyCustom = function (callbackFn, thisArg = this) {
  for (let index = 0; index < this.length; index += 1) {
    if (!index in thisArg) continue;
    if (!callbackFn(thisArg[index], index, thisArg)) return false;
  }
  return true;
};

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

// let arr = Array.from({ length: 10 }, (_, idx) => idx + 1);
// console.log(arr.everyCustom(test1));
// console.log(arr.everyCustom(test2));
// console.log(arr.everyCustom(test3));
// console.log(arr);

/*
Array.prototype.fill()
Array 인스턴스의 fill() 메서드는 배열의 인덱스 범위 내에 있는 모든 요소를 정적 값으로 변경합니다. 그리고 수정된 배열을 반환합니다.
fill(value)
fill(value, start)
fill(value, start, end)
*/

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

/* 테스트 코드를 짜보자 
배열은 동일하게 하고 인수로 전달할 value , start , end 값을 랜덤으로 조정하자
*/

const testCustomfill = (array, testNum = 100000) => {
  /* test에 사용할 array 의 길이는 100 */
  let linear = 0;
  let value, start, end;
  while (linear < testNum) {
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
    linear += 1;
  }
  return '통과';
};

// let array = Array.from({ length: 100 }, (_, index) => index);
// console.log(testCustomfill(array));

/* 
Array.prototype.filter()
Array 인스턴스의 filter() 메서드는 주어진 배열의 일부에 대한 얕은 복사본을 생성하고, 
주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링 합니다.

filter(callbackFn)
filter(callbackFn, thisArg)
*/

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

/*
Array.prototype.find()
Array 인스턴스의 find() 메서드는 제공된 배열에서 제공된 테스트 함수를 만족하는 첫 번째 요소를 반환합니다.
 테스트 함수를 만족하는 값이 없으면 undefined가 반환됩니다.

배열에서 찾은 요소의 인덱스가 필요한 경우, findIndex()를 사용하세요.
값의 인덱스를 찾아야 하는 경우, indexOf()를 사용하세요.
 (findIndex()와 유사하지만, 테스트 함수를 사용하는 것 대신 각 요소가 값과 동일한지 확인합니다.)
배열에 값이 존재하는지 찾아야 하는 경우, includes()를 사용하세요.
 이 역시 테스트 함수를 사용하는 것 대신 각 요소가 값과 동일한지 확인합니다.
제공된 테스트 함수를 만족하는 요소가 있는지 찾아야 하는 경우, some()을 사용하세요.
*/

Array.prototype.findCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = 0; index < length; index += 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return elem;
  }
  return undefined;
};

/*
Array.prototype.findIndex()
findIndex() 메서드는 주어진 판별 함수를 만족하는 배열의 
첫 번째 요소에 대한 인덱스를 반환합니다. 만족하는 요소가 없으면 -1을 반환합니다.

판별 함수를 만족하는 첫번째 인덱스 대신 값을 반환하는 find() 메서드도 참고하세요.

findIndex(callbackFn)
findIndex(callbackFn, thisArg)
*/

Array.prototype.findIndexCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = 0; index < length; index += 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return index;
  }
  return -1;
};

/*
Array.prototype.findLast()
Array 인스턴스의 findLast() 메서드는 배열을 역순으로 순회하며 
제공된 테스트 함수를 만족하는 첫 번째 요소의 값을 반환합니다. 
테스트 함수를 만족하는 요소가 없으면 undefined가 반환됩니다.
*/

Array.prototype.findLastCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = length - 1; index > 0; index -= 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return elem;
  }
  return undefined;
};

// const arr = [1, 2, 3, 4, 5, 6];
// console.log(arr.findLastCustom((num) => !(num % 2)));
// console.log(arr.findLast((num) => !(num % 2)));

/*
Array.prototype.findLastIndex()
findLastIndex() 메서드는 배열을 역순으로 순회하며 주어진 판별 함수를 
만족하는 만족하는 배열의 첫번째 요소의 인덱스를 반환합니다.
만족하는 요소가 없으면 -1을 반환합니다.

인덱스 대신 판별함수를 만족하는 마지막 값을 반환하는findLast()메서드도 참고하세요.
*/
Array.prototype.findLastIndexCustom = function (callbackFn, thisArg = this) {
  const { length } = this;
  for (let index = length - 1; index > 0; index -= 1) {
    const elem = this[index];
    if (callbackFn(elem, index, thisArg)) return index;
  }
  return -1;
};

/*
Array.prototype.flat()
Array 인스턴스의 flat() 메서드는 모든 하위 배열 요소가
지정된 깊이까지 재귀적으로 연결된 새 배열을 생성합니다.

flat()
flat(depth = 1)
*/

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

/* test코드를 작성하자 */

// const testCustomflat = (arr, maxNestedLevel) => {
//   const { length } = arr;
//   for (let nestLevel = 1; nestLevel < maxNestedLevel; nestLevel += 1) {
//     const original = arr.flat(nestLevel);
//     const custom = arr.flatCustom(nestLevel);

//     for (let index = 0; index < length; index += 1) {
//       if (original[index].toString() !== custom[index].toString()) {
//         console.log('실패');
//         return;
//       }
//     }

//     console.log('통과');
//   }
// };

// const testCases = [
//   [[1, 2, [3, 4, [5, 6]], 7, [8, 9]], 3],
//   [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]]], 8],
//   [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], 10], 8],
//   [[1, 2, 3, 4, 5, 6, 7, 8, 9], 1],
//   [[[1], [2], [3], [4], [5], [6], [7], [8], [9]], 9],
//   [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], [10, [11, [12]]]], 11],
//   [
//     [
//       [1, 2, 3],
//       [4, 5, 6],
//       [7, 8, 9],
//     ],
//     3,
//   ],
//   [[1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], 10, [11, [12, [13, [14]]]]], 12],
// ];

// testCases.forEach((testcase) => {
//   testCustomflat(...testcase);
// });

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

/*
Array.prototype.forEach()
Array 인스턴스의 forEach() 메서드는 각 배열 요소에 대해 제공된 함수를 한 번씩 실행합니다.

forEach(callbackFn)
forEach(callbackFn, thisArg)
*/

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

// const asyncIterable = [
//   new Promise((resolve) =>
//     setTimeout(() => {
//       resolve(1);
//     }, 1000),
//   ),
//   new Promise((resolve) =>
//     setTimeout(() => {
//       resolve(2);
//     }, 1000),
//   ),
//   new Promise((resolve) =>
//     setTimeout(() => {
//       resolve(3);
//     }, 1000),
//   ),
// ];

// const forofPromise = async (iterable) => {
//   for await (const promise of iterable) {
//     console.log(promise);
//   }
// };

// forofPromise(asyncIterable);
// asyncIterable.forEachCustom((promise) => console.log(promise));
// console.log('forEach문은 이벤트 루프로 빠져나가서 제가 먼저 실행됩니다');

/*
Array.prototype.from

Array.from() 정적 메서드는 순회 가능 또는 유사 배열 객체에서 
얕게 복사된 새로운 Array 인스턴스를 생성합니다.

Array.from(arrayLike, mapFn, thisArg)
*/

Array.fromCustom = function (arrayLike, mapFn, thisArg = arrayLike) {
  const baseFunc = (num) => num;
  mapFn = mapFn || baseFunc;
  const result = [];

  for (let index = 0; index < thisArg.length; index += 1) {
    const elem = thisArg[index];
    if (index in thisArg) {
      result[index] = mapFn(elem, index);
    } else {
      result[index] = undefined;
    }
  }
  return result;
};

/*
Array.prototype.includes

Array 인스턴스의 includes() 메서드는 배열의 항목에 특정 값이 포함되어 있는지를
판단하여 적절히 true 또는 false를 반환합니다.
Same Value Zero 를 따른다

includes(searchElement)
includes(searchElement, fromIndex)
*/

Array.prototype.includesCustom = function (searchElement, fromIndex = 0) {
  /* fromIndex 정수형 변환 */
  if (fromIndex < -this.length) fromIndex = 0;
  if (fromIndex >= this.length) return false;
  fromIndex = fromIndex < 0 ? this.length + fromIndex : fromIndex;

  for (let index = fromIndex; index < this.length; index += 1) {
    const elem = this[index];
    if (elem !== elem && searchElement !== searchElement) return true;
    if (elem === searchElement) return true;
  }
  return false;
};

/*
Array.prototype.indexOf()
Array 인스턴스의 indexOf() 메서드는 배열에서 주어진 요소를 찾을 수 있는 첫 번째 인덱스를 반환하고, 찾을 수 없는 경우 -1을 반환합니다.

indexOf(searchElement)
indexOf(searchElement, fromIndex)
*/

Array.prototype.indexOfCustom = function (searchElement, fromIndex = 0) {
  if (fromIndex < -this.length) fromIndex = 0;
  if (fromIndex >= this.length) return false;
  fromIndex = fromIndex < 0 ? this.length + fromIndex : fromIndex;

  for (let index = fromIndex; index < this.length; index += 1) {
    if (index in this && this[index] === searchElement) return index;
  }
  return -1;
};

/*
Array.isArray()

Array.isArray(value)
*/

Array.isArrayCustom = function isArray(value) {
  try {
    /* Array exotic object 인지 확인하자 */
    if (typeof value !== 'object') return false;
    /* 배열의 메소드지만 현재 커스텀하여 상속시킨 메소드가 많아 이것만 좀 양해 바람 */
    const copiedValue = [...value];
    const { length } = copiedValue;
    const properties = Object.keys(copiedValue);
    /* length 가 정수형이면서 2**32 미만인지 확인하기 */
    if (!Number.isInteger(length) || length >= 2 ** 32) return false;
    /* 객체의 length 와 프로퍼티 개수가 맞는지 확인하기  */
    if (length !== properties.length) return false;
    /* 인덱스 역할을 하는 프로퍼티들이 순차적인 정수형인지 확인하기 */
    for (let index = 0; index < length; index += 1) {
      /* Object.keys 는 문자형으로 생성되기 때문에 얕은 비교 사용 */
      if (index != properties[index]) return false;
    }
    /* 
    값이 추가되고 제거 될 때 length 프로퍼티 값이 변경되는지 확인하기
    */
    const originalLength = length;
    copiedValue.push('temp value');
    if (originalLength !== copiedValue.length - 1) return false;
    copiedValue.pop();
    if (originalLength !== copiedValue.length) return false;
    /* 인덱스 역할을 하는 프로퍼티 키의 최대값이 2 ** 32 -1 미만인지 확인하기 */
    copiedValue[2 ** 32 - 1] = 'temp value';

    if (copiedValue.length !== originalLength) return false;
    return true;
  } catch (e) {
    return false;
  }
};

/*
Array.prototype.join()
Array 인스턴스의 Join() 메서드는 배열의 모든 요소를 쉼표나 지정된 구분 문자열로 구분하여 연결한 새 문자열을 만들어 반환합니다. 
배열에 항목이 하나만 있는 경우, 해당 항목은 구분 기호를 사용하지 않고 반환됩니다.

.join(seperator = '')
*/

Array.prototype.joinCustom = function (seperator = ',') {
  const { length } = this;
  if (!length) return '';

  let result = '';
  for (let index = 0; index < length; index += 1) {
    let item = this[index];
    item = item !== this ? item ?? '' : '';
    result += item + (index < length - 1 ? seperator : '');
  }
  return result;
};

/*
Array.prototype.keys()

Array 인스턴스의 keys() 메서드는 배열의 각 인덱스에 대한 키를 포함하는 새로운 배열 반복자 (en-US) 객체를 반환합니다.
*/

Array.prototype.keysCustom = function () {
  const { length } = this;
  let cur = 0;
  return {
    [Symbol.toStringTag]: 'Array Iterator',
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return {
        value: cur < length ? cur : undefined,
        done: cur++ < length ? false : true,
      };
    },
  };
};

/*
Array.prototype.lastIndexOf
Array 인스턴스의 lastIndexOf() 메서드는 배열에서 특정 요소를 찾을 수 있는 마지막 인덱스를 반환하거나, 
해당 요소가 없으면 -1을 반환합니다. 배열은 fromIndex에서 시작하여 역방향으로 검색됩니다.

lastIndexOf(searchElement)
lastIndexOf(searchElement, fromIndex)
*/

Array.prototype.lastIndexOfCustom = function (
  searchElement,
  fromIndex = this.length - 1,
) {
  const { length } = this;
  fromIndex = Math.floor(fromIndex); /* 정수 형변환 */

  if (fromIndex < -length) return -1;
  fromIndex = fromIndex < 0 ? length + fromIndex : fromIndex; /* 양수 형변환 */
  /* length 보다 길 경우 length - 1 */
  fromIndex = fromIndex > length ? length - 1 : fromIndex;

  for (let index = fromIndex; index > 0; index -= 1) {
    if (this[index] === searchElement) return index;
  }
  return -1;
};

/*
Array.prototype.map()
map() 메서드는 배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환합니다.

arr.map(callback(currentValue[, index[, array]])[, thisArg])
*/

Array.prototype.mapCustom = function (callbackFn, thisArg = this) {
  const { length } = this;

  const resultArr = [];
  for (let index = 0; index < length; index += 1) {
    if (index in thisArg) {
      const elem = thisArg[index];
      resultArr[index] = callbackFn(elem, index, thisArg);
    }
  }
  return resultArr;
};
/*
Array.of()

Array.of() 메서드는 인자의 수나 유형에 관계없이 가변 인자를 갖는 새 Array 인스턴스를 만듭니다.

Array.of()와 Array 생성자의 차이는 정수형 인자의 처리 방법에 있습니다. 
Array.of(7)은 하나의 요소 7을 가진 배열을 생성하지만 
Array(7)은 length 속성이 7인 빈 배열을 생성합니다.
*/

Array.ofCustom = function () {
  const resultArr = [];
  for (let index = 0; index < arguments.length; index += 1) {
    resultArr[index] = arguments[index];
  }
  return resultArr;
};

/*
Array.prototype.pop
Array.prototype.pop()
pop() 메서드는 배열에서 마지막 요소를 제거하고 그 요소를 반환합니다.
*/

Array.prototype.popCustom = function () {
  const { length } = this;
  if (!length) return undefined;

  const lastElement = this[length - 1];
  this.length -= 1;
  return lastElement;
};

/*
Array.prototype.push()
push() 메서드는 배열의 끝에 하나 이상의 요소를 추가하고, 배열의 새로운 길이를 반환합니다.

arr.push(element1[, ...[, elementN]])
*/

Array.prototype.pushCustom = function () {
  const { length: originalLength } = this;
  for (let index = 0; index < arguments.length; index += 1) {
    this[originalLength + index] = arguments[index];
  }
  return this.length;
};

/*
Array.prototype.reduce()

reduce() 메서드는 배열의 각 요소에 대해 주어진 리듀서 (reducer) 함수를 
실행하고, 하나의 결과값을 반환합니다.

arr.reduce(callback[, initialValue])
*/

Array.prototype.reduceCustom = function (callbackFn, initialValue) {
  const { length } = this;
  if (!length) return new Error('This array is empty!');
  let index = initialValue === undefined ? 1 : 0;
  let acc = initialValue === undefined ? this[0] : initialValue;

  for (index; index < this.length; index += 1) {
    if (index in this) {
      const cur = this[index];
      acc = callbackFn(acc, cur, index, this);
    }
  }
  return acc;
};

/*
Array.prototype.reduceRight()

*/

Array.prototype.reduceRightCustom = function (callbackFn, initialValue) {
  const { length } = this;
  if (!length) return new Error('This array is empty!');
  let index = initialValue === undefined ? length - 2 : length - 1;
  let acc = initialValue === undefined ? this[length - 1] : initialValue;

  for (index; index > -1; index -= 1) {
    if (index in this) {
      const cur = this[index];
      acc = callbackFn(acc, cur, index, this);
    }
  }
  return acc;
};

/*
Array.prototype.reverse

reverse() 메서드는 배열의 순서를 반전합니다.
첫 번째 요소는 마지막 요소가 되며 마지막 요소는 첫 번째 요소가 됩니다.
*/

Array.prototype.reverseCustom = function () {
  const { length } = this;
  let firstIndex = 0;
  for (firstIndex; firstIndex < Math.floor(length / 2); firstIndex += 1) {
    const lastIndex = length - 1 - firstIndex;
    /* 희소값인 경우 기억하자 */
    const isEmpty = !(firstIndex in this && lastIndex in this);
    const emptyIndex = firstIndex in this ? firstIndex : lastIndex;

    [this[firstIndex], this[lastIndex]] = [this[lastIndex], this[firstIndex]];

    if (isEmpty) {
      delete this[emptyIndex];
    }
  }
  return this;
};

/*
Array.prototype.shift

shift() 메서드는 배열에서 첫 번째 요소를 제거하고, 제거된 요소를 반환합니다. 이 메서드는 배열의 길이를 변하게 합니다.
*/

Array.prototype.shiftCustom = function () {
  const { length } = this;
  if (!length) return undefined;
  const firstValue = this[0];
  for (let index = 1; index < length; index += 1) {
    this[index - 1] = this[index];
    if (!(index in this)) {
      /* 이동시킨 값이 희소값이라면 제거하여 희소배열 형태 유지하기 */
      delete this[index - 1];
    }
  }
  this.length -= 1;
  return firstValue;
};

/*
Array.prototype.slice

slice() 메서드는 어떤 배열의 begin 부터 end 까지(end 미포함)에 대한 얕은 복사본을 새로운 배열 객체로 반환합니다. 
원본 배열은 바뀌지 않습니다.
*/

Array.prototype.sliceCustom = function (begin = 0, end = this.length) {
  const { length } = this;
  /* 정수 형변환 */
  [begin, end] = [Math.floor(begin), Math.floor(end)];
  /* 양수 형변환 */
  begin = begin < 0 ? length + begin : begin;
  end = end < 0 ? length + end : end;

  if (begin > length) return [];
  const resultArr = [];

  for (let index = 0; index < end - begin; index += 1) {
    resultArr[index] = this[index + begin];
    if (!(index + begin in this)) {
      delete resultArr[index];
    }
  }
  return resultArr;
};

/*
Array.prototype.some 

some() 메서드는 배열 안의 어떤 요소라도 주어진 판별 함수를
적어도 하나라도 통과하는지 테스트합니다. 
만약 배열에서 주어진 함수가 true을 반환하면 true를 반환합니다.
그렇지 않으면 false를 반환합니다. 이 메서드는 배열을 변경하지 않습니다.
*/

Array.prototype.someCustom = function (callbackFn, thisArg = this) {
  const { length } = thisArg;
  if (!length) return false;
  for (let index = 0; index < length; index += 1) {
    if (index in thisArg) {
      if (callbackFn(thisArg[index], index, thisArg)) return true;
    }
  }
  return false;
};

/*
Array.prototype.sort()
sort() 메서드는 배열의 요소를 적절한 위치에 정렬한 후 그 배열을 반환합니다. 
정렬은 stable sort가 아닐 수 있습니다. 기본 정렬 순서는 문자열의 유니코드 코드 포인트를 따릅니다.

정렬 속도와 복잡도는 각 구현방식에 따라 다를 수 있습니다.
*/

Array.prototype.sortCustom = function (callbackFn) {
  callbackFn =
    callbackFn || ((a, b) => a.toString().localeCompare(b.toString()));
  let trial = 0;

  const recursion = (start, end) => {
    for (let index = start; index < end; index += 1) {
      if (callbackFn(this[index], this[index + 1]) <= 0) continue;

      [this[index], this[index + 1]] = [this[index + 1], this[index]];
      trial += end - 1;
      if (start < end - 1) {
        recursion(start, end - 1);
      }
    }
  };
  recursion(0, this.length - 1);
  console.log(`전체 순회 횟수 : ${trial}`);
  return this;
};

// const createRandomArray = (maxLength) => {
//   return Array.from({ length: maxLength }, () =>
//     Math.floor(Math.random() * (maxLength + 1 - 0)),
//   );
// };

// const arr = createRandomArray(10);
// console.log(arr);
// console.log(arr.sortCustom((a, b) => a - b));

/*
Array.prototype.splice()

splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경합니다.
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
*/

Array.prototype.spliceCustom = function (start, deleteCount, ...items) {
  const { length } = this;
  const returnArr = [];

  if (Math.abs(start) > length) {
    start = start > 0 ? length : 0;
  }
  start = start > 0 ? start : length + start;

  deleteCount = deleteCount || length - start;
  deleteCount = deleteCount < 0 ? 0 : deleteCount;
  deleteCount = Math.min(deleteCount, length - start);

  const offset = Math.abs(items.length - deleteCount); // start 이후의 원소들이 이동해야 하는 거리

  /** splice 시킬 배열들을 골라두기 */
  for (let index = 0; index < deleteCount; index += 1) {
    returnArr[index] = this[start + index];
  }

  /** items.length < deleteCount , items.length < deleteCount 경우에 따라 
  기존 원소들의 인덱스 변경 방식 다르게
  */
  if (items.length < deleteCount) {
    for (let index = start; index < length - deleteCount; index += 1) {
      this[index] = this[index + deleteCount];
    }
  }

  if (items.length > deleteCount) {
    for (let index = length - 1; index >= start; index -= 1) {
      this[index + offset] = this[index];
    }
  }
  /** start부터 item 원소 설정해주기 */

  for (let index = 0; index < items.length; index += 1) {
    this[start + index] = items[index];
  }

  /* this.length를 변경하여 배열 설정해주기 */
  if (deleteCount > items.length) this.length -= items.length - deleteCount;
  return returnArr;
};

// const testCustomSplice = () => {
//   const arr = [1, 2, 3, 4, 5];
//   const testCases = [
//     // Case 1: 0 < start < length, deleteCount = 2, items = [7, 8]
//     [2, 2, 7, 8],
//     // Case 2: start < 0 < length, deleteCount = 3, items = [7, 8]
//     [-2, 3, 7, 8],
//     // Case 3: 0 < start < deleteCount < length, deleteCount = 3, items = [7, 8]
//     [1, 3, 7, 8],
//     // Case 4: start < 0 < deleteCount < length, deleteCount = 3, items = [7, 8]
//     [-2, 3, 7, 8],
//     // Case 5: 0 < start < length < deleteCount, deleteCount = 6, items = [7, 8]
//     [1, 6, 7, 8],
//     // Case 6: 0 < length < start < deleteCount, deleteCount = 3, items = [7, 8]
//     [6, 3, 7, 8],
//     // Case 7: 0 < start < length < items.length, deleteCount = 2, items = [7, 8, 9]
//     [2, 2, 7, 8, 9],
//     // Case 8: 0 < start < items.length < length, deleteCount = 2, items = [7, 8]
//     [2, 2, 7, 8],
//     // Case 9: 0 < length < start < items.length, deleteCount = 2, items = [7, 8]
//     [6, 2, 7, 8],
//     // Case 10: start < 0 < length, deleteCount = 2, items = [7, 8]
//     [-2, 2, 7, 8],
//     // Case 11: 0 < start < deleteCount < length, deleteCount = 3, items = [7, 8]
//     [1, 3, 7, 8],
//   ];

//   for (let index = 0; index < testCases.length; index += 1) {
//     const arr1 = [...arr];
//     const arr2 = [...arr];
//     const testCase = testCases[index];
//     const return1 = arr1.splice(...testCase);
//     const return2 = arr2.splice(...testCase);

//     const arrResult = arr1.every((elem, idx) => elem === arr2[idx]);
//     const returnResult = return1.every((elem, idx) => elem === return2[idx]);

//     console.log(
//       `testCase${index + 1} ${arrResult && returnResult ? '통과' : '실패'}`,
//     );
//     console.log(`정답 반환 값 : ${return1} 정답 배열 : ${arr1}`);
//     console.log(`나의 반환 값 : ${return2} 나의 배열 : ${arr2}`);
//   }
// };

// testCustomSplice();
