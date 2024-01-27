export default class Component {
  constructor(target, props) {
    this.target = target;
    this.props = props;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {
    /* state 프로퍼티 설정 */
  }

  templet() {
    /* target 노드 하위 요소들의 태그 내용 */
  }

  render() {
    this.target.innerHTML = this.templet();
    this.mounted();
  }

  mounted() {
    /* 렌더링 이후 실행되는 메소드 */
  }

  setState(newState) {
    /* state 를 변경하는 함수 */
    this.state = { ...this.state, ...newState };
    this.render();
  }

  setEvent() {
    /* 이벤트 핸들러들을 등록하는 메소드 */
  }

  addEvent(eventType, selector, callback) {
    /* 이벤트 위임을 통해 이벤트 핸들링을 등록하는 함수 */
    this.target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return;
      callback(event);
    });
  }
}
