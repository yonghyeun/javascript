import Component from './src/core/Component.js';
import Items from './src/components/Items.js';
import ItemFilter from './src/components/ItemFilter.js';
import Itemappender from './src/components/Itemappender.js';

export default class App extends Component {
  setup() {
    this.state = {
      isFilter: 0,
      items: [
        {
          seq: 1,
          content: 'item1',
          active: true,
        },
        {
          seq: 2,
          content: 'item2',
          active: false,
        },
      ],
    };
  }

  templet() {
    // 다양한 컴포넌트들이 구성할 기본 레이웃만 가지고 있음
    this.$target.innerHTML = `
    <header data-component = 'item-appender'></header>
    <main data-component = 'items'></main>
    <footer data-component = 'item-filter'></footer>
    `;
  }

  addItem(content) {
    const { items } = this.state;
    const seq = Math.max(...items.map((v) => v.seq)) + 1;
    const active = false;

    this.setState({
      items: [...items, { seq, content, active }],
    });
  }

  get filteredItems() {
    const { isFilter, items } = this.state;
    return items.filter(({ active }) => {
      isFilter === 0 ||
        (isFilter === 1 && active) ||
        (isFilter === 2 && !active);
    });
  }

  filterItems(isFilter) {
    this.setState(isFilter);
  }

  deleteItem(seq) {
    const { items } = this;
    const targetIndex = items.findIndex((v) => v.seq === seq);
    items.splice(targetIndex, 1);
    this.setState({ items });
  }

  toggleItem(seq) {
    const { items } = this;
    const targetIndex = items.findIndex((v) => v.seq === seq);
    items[targetIndex].active = !items[targetIndex].active;
    this.setState({ items });
  }

  mounted() {
    const { addItem, filterItems, deleteItem, toggleItem } = this;
    const $itemAppender = this.$target.querySelector(
      '[data-component = "item-appender"]',
    );
    const $items = this.$target.querySelector('[data-component = "items"]');
    const $itemFilter = this.$target.querySelector(
      '[data-component = "item-filter"]',
    );

    new Itemappender($itemAppender, {
      addItem: addItem.bind(this),
    });

    new Items($items, {
      deleteItem: deleteItem.bind(this),
      toggleItem: toggleItem.bind(this),
    });

    new ItemFilter($itemFilter, {
      filterItems: filterItems.bind(this),
    });
  }
}
