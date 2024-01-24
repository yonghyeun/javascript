export default class Component {
  $target;
  $state;

  constructor($target, $state) {
    this.$target = $target;
    this.$state = $state;
    this.setup();
    this.render();
    this.setEvent();
  }

  templet() {
    return '';
  }

  setup() {}

  render() {
    this.$target.innerHTML = this.templet();
  }

  setState(newState) {
    /**
    newState 도 객체 형태이며
    스프레드 문법을 이용하여 this.state 객체를 새로 생성 
    newState 에도 동일한 프로퍼티가 있을 경우 
    newState 의 프로퍼티가 덮어씌워짐 (OverRiding)
     */
    this.state = { ...this.state, ...newState };
    this.render(); // 상태가 변화되면 새롭게 렌더링 되도록
  }

  setEvent() {}

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;

      callback(event);
    });
  }
}
