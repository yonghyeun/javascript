import Component from '../core/Component.js';

export default class Items extends Component {
  templet() {
    const { items } = this;

    this.$target.innerHTML = `
    <ul>
    ${items.map(
      ({ seq, content, active }) => `<li data-seq = "${seq}">${content}</li>
      <button class = 'toggleBtn' style = 'color : ${
        active ? 'red' : 'blue'
      }'>${
        active ? '활성화' : '비활성화'
      }</button><button class = 'deleteBtn'>삭제</button>`,
    )}
    </ul>
    `;
  }

  setEvent() {
    const { deleteItem, toggleItem } = this.$props;

    this.addEvent('click', '.deleteBtn', ({ target }) => {
      const targetSeq = Number(target.closest('[data-seq]').dataset.seq);
      deleteItem(targetSeq);
    });

    this.addEvent('click', '.toggleBtn', ({ target }) => {
      const targetSeq = Number(target.closest('[data-seq]').dataset.seq);
      toggleItem(targetSeq);
    });
  }
}
