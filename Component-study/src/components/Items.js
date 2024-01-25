import Component from '../core/Component.js';

export default class Items extends Component {
  /**
    상속을 통해 인스턴스와 메소드 상속
    일부 메소드는 오버라이딩하자
   */

  get filteredItems() {
    /*
    조건에 따른 아이템 필터링
    전체보기일 경우엔 모든 아이템을 보고 
    활성화 보기 일때에는 활성화된 아이템만 보고 
    비활성화 보기 일 때에는 비활성화된 아이템만 보기
    */
    const { isFilter, items } = this.state;
    return items.filter(
      ({ active }) =>
        isFilter === 0 ||
        (isFilter === 1 && active === true) ||
        (isFilter === 2 && active === false),
    );
  }

  templet() {
    // App 컴포넌트의 기본 템플릿

    return `
    <header><input type = 'text' class = 'appender' placeholder = '아이템 내용 입력'></header>
    <main>  
    <ul>
        ${this.filteredItems
          .map(
            ({ seq, content, active }) =>
              `<li data-seq = ${seq}>${content}
              <button class = 'toggleBtn' style = 'color : ${
                active ? 'red' : 'blue'
              }'>${active ? '활성화' : '비활성화'}</button>
              <button class = 'deleteBtn'>삭제</button>
              </li>`,
          )
          .join('')}
      </ul></main>
      <footer>
      <button class = 'filterBtn' data-is-filter = '0'>전체보기</button>
      <button class = 'filterBtn' data-is-filter = '1'>활성화보기</button>
      <button class = 'filterBtn' data-is-filter = '2'>비활성화보기</button>

      </footer>
      `;
  }

  setup() {
    this.state = {
      isFilter: 0,
      items: [
        {
          seq: 1,
          content: 'item1',
          active: false,
        },
        { seq: 2, content: 'item2', active: true },
      ],
    };
  }

  setEvent() {
    // input 에 대한 이벤트 핸들러 등록
    this.addEvent('keyup', '.appender', ({ key, target }) => {
      if (key !== 'Enter') return;

      const { items } = this.state;
      // 다음 seq 넘버는 현재 아이템의 seq 넘버들의 최대값보다 1커야함
      const seq = Math.max(...items.map((v) => v.seq)) + 1;
      const content = target.value;
      const active = false; // active 상태의 디폴트 값은 false

      this.setState({
        items: [...items, { seq, content, active }],
      });
    });
    // deleteButton 에 대한 이벤트 핸들러 등록
    this.addEvent('click', '.deleteBtn', ({ target }) => {
      const { items } = this.state;
      const targetSeq = Number(target.closest('[data-seq]').dataset.seq);
      const targetIndex = items.findIndex((v) => v.seq === targetSeq);

      items.splice(targetIndex, 1);
      this.setState({ items });
    });
    // togleBtn 에 대한 이벤트 핸들러 등록
    this.addEvent('click', '.toggleBtn', ({ target }) => {
      const { items } = this.state;
      const targetSeq = Number(target.closest('[data-seq]').dataset.seq);
      const targetIndex = items.findIndex((v) => v.seq === targetSeq);
      items[targetIndex].active = !items[targetIndex].active;

      this.setState({ items });
    });
    // filterBtn 에 대한 이벤트 핸들러 등록
    this.addEvent('click', '.filterBtn', ({ target }) => {
      this.setState({ isFilter: Number(target.dataset.isFilter) });
    });
  }
}
