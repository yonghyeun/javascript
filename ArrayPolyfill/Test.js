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
      throw new Error('두 원소값이 같지 않습니다 ! ');
    }
    /* group1 , group2 가 배열이라면 각 값의 길이가 같은지 확인 */
    if (group1.length !== group2.length) {
      throw new Erorr('두 결과값의 길이가 같지 않습니다');
    }

    /* group1 , gorup2의 길이가 같다면 원소가 같은지 확인 */
    for (let i = 0; i < group1.length; i += 1) {
      if (group1[i] !== group2[i]) {
        throw new Erorr('두 결과값의 원소값이 같지 않습니다');
      }
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
    const numTest = 3;
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
