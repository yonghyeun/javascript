import Component from '../core/Component.js';

export default class Items extends Component {
  /**
    상속을 통해 인스턴스와 메소드 상속
    일부 메소드는 오버라이딩하자
   */
  templet() {
    // App 컴포넌트의 기본 템플릿
    const { items } = this.state;

    return `
      <ul>
        ${items.map((item) => `<li>${item}</li>`).join('')}
      </ul>
      <button>추가</button>`;
  }

  setup() {
    this.state = { items: ['item1', 'item2'] };
  }

  setEvent() {
    const addItem = () => {
      const { items } = this.state;
      this.setState({
        items: [...items, `item${items.length + 1}`],
      });
    };

    this.addEvent('click', 'button', addItem);
  }
}
