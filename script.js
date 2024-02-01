const randomArray =
  /* 
Array.prototype.at 구현
반환할 배열 요소의 0부터 시작하는 인덱스로, 정수로 변환됩니다. 
음수 인덱스는 배열 끝부터 거슬러 셉니다. index < 0인 경우, index + array.length로 접근합니다.
*/
  (Array.prototype.atCustom = function (index) {
    const indexInteger = ParseInt(index, 10);
    return this[indexInteger < 0 ? this.length - indexInteger : indexInteger];
  });
