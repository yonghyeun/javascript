import Component from '../core/Component.js';

export default class Items extends Component {
  templet() {
    const { filteredItems } = this.$props;

    return `
    <ul>
    ${filteredItems.map(
      ({ seq, content, active }) =>
        `<li data-seq = "${seq}">${content}<button class = 'toggleBtn' style = 'color : ${
          active ? 'red' : 'blue'
        }'>${
          active ? '활성화' : '비활성화'
        }</button><button class = 'deleteBtn'>삭제</button></li>`,
    )}
    </ul>`;
  }

  setEvent() {
    const { deleteItem, toggleItem } = this.$props;
    const $button = document.querySelector('.deleteBtn');
    console.log($button.closest('[data-seq]'));
    console.log(document.querySelector('[data-seq]'));

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
