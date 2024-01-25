import Component from '../core/Component.js';

export default class ItemAppender extends Component {
  templet() {
    this.$target.innerHTML = `
    <input type = 'text' class = 'appender'placeholder = '아이템을 입력해주세요' ></input>
    `;
  }

  setEvent() {
    const { addItem } = this.$props; // props 에서 전달받은 addItem을 호출

    this.addEvent('keyup', '.appender', ({ key, value }) => {
      if (key !== 'Enter') return;
      addItem(value);
    });
  }
}
