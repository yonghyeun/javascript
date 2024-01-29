import deque from './deque.js';

export default class APIdeque extends deque {
  constructor() {
    super();
    this.setState();
  }

  setState() {
    /* 서버가 벙렬 처리를 지원하지 않는다. */
    const url = 'https://api.thecatapi.com/v1/images/search';
    if (this.length > 5) return;
    const urlArr = Array.from({ length: 10 }, (_, index) => url);
  }
}
