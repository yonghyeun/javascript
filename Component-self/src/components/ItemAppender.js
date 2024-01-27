import Component from '../core/Component.js';

export default class ItemAppender extends Component {
  setEvent() {
    const { appendItem } = this.props;

    this.addEvent('keyup', '.appender', ({ key, target }) => {
      if (key !== 'Enter') return;

      appendItem(target.value);
    });
  }

  templet() {
    return '<input class = "appender" type = "text" placeholder = "아이템을 입력해주세요"}></input>';
  }
}
