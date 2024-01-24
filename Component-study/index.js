class Component {
  $target;
  $state;

  constructor($target, $state) {
    this.$target = $target;
    this.$state = $state;
    this.setup();
    this.render();
  }

  templet() {
    return '';
  }

  setup() {}

  render() {
    this.$target.innerHTML = this.templet();
    this.setEvent();
  }

  setState(newState) {
    /**
    newState 도 객체 형태이며
    스프레드 문법을 이용하여 this.state 객체를 새로 생성 
    newState 에도 동일한 프로퍼티가 있을 경우 
    newState 의 프로퍼티가 덮어씌워짐 (OverRiding)
     */
    this.state = { ...this.state, ...newState };
    this.render();
  }

  setEvent() {}
}

class App extends Component {
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
    const $button = this.$target.querySelector('button');
    $button.addEventListener('click', () => {
      const { items } = this.state;
      this.setState({
        items: [...items, `item${items.length + 1}`],
      });
    });
  }
}

class AppKorean extends App {
  setup() {
    this.state = { items: ['아이템1', '아이템2'] };
  }

  setEvent() {
    const $button = this.$target.querySelector('button');
    $button.addEventListener('click', () => {
      const { items } = this.state;
      this.setState({
        items: [...items, `아이템${items.length + 1}`],
      });
    });
  }
}

new App(document.querySelector('.app'));
new AppKorean(document.querySelector('.app-korean'));
