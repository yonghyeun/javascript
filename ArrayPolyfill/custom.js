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
