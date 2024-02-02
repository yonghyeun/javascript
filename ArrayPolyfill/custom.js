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
    if (!this[index]) continue;
    if (!callbackFn(this[index], index, thisArg)) return false;
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
