import Component from '../core/Component.js';

export default class ItemFilter extends Component {
  templet() {
    return `<button class = 'filterBtn'data-filter-version = '0'>전체보기</button>
    <button class ='filterBtn' data-filter-version = '1'>활성화보기</button>
    <button class = 'filterBtn' data-filter-version = '2'>비활성화보기</button>`;
  }

  setEvent() {
    this.addEvent('click', '.filterBtn', (event) => {
      const { filterItems } = this.props;
      const newFilterVersion = Number(event.target.dataset.filterVersion);

      filterItems(newFilterVersion);
    });
  }
}
