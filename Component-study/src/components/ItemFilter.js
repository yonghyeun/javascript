import Component from '../core/Component.js';

export default class ItemFilter extends Component {
  templet() {
    return `
    <button class = 'filterBtn' data-is-filter = '0'>전체보기</button>
    <button class = 'filterBtn' data-is-filter = '1'>활성화보기</button>
    <button class = 'filterBtn' data-is-filter = '2'>비활성화보기</button>`;
  }

  setEvent() {
    const { filterItem } = this.$props;

    this.addEvent('click', '.filterBtn', ({ target }) => {
      filterItem(Number(target.dataset.isFilter));
    });
  }
}
