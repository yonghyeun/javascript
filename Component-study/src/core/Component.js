export default class Component {
  $target;
  $props;

  constructor($target, $props) {
    this.$target = $target;
    this.$props = $props; // + 추가 , props를 이용해 하위 컴포넌트에 정보 전달
    this.setup();
    this.render();
    this.setEvent();
  }

  templet() {
    return '';
  }

  setup() {}

  mounted() {}

  render() {
    this.$target.innerHTML = this.templet();
    this.mounted(); // 렌더링 된 이후 실행되는 메소드
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
