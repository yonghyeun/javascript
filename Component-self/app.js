import Component from './src/core/Component.js';
import ItemAppender from './src/components/ItemAppender.js';
import Items from './src/components/Items.js';
import ItemFilter from './src/components/ItemFilter.js';

export default class App extends Component {
  setup() {
    /* 컴포넌트에서 관리해야 하는 상태 정의 */
    this.state = {
      filterVersion: 0,
      items: [
        { seq: 1, content: 'item1', active: true },
        { seq: 2, content: 'item2', active: false },
      ],
    };
  }

  templet() {
    return `<header class = "appender-fild"></header>
    <main class = "item-fild"></main>
    <footer class = "filter-fild"></footer>`;
  }

  mounted() {
    /* 하위 컴포넌트들에 전달 해줄 영역 선택 */
    const $appenderFild = this.target.querySelector('.appender-fild');
    const $itemFild = this.target.querySelector('.item-fild');
    const $filterFild = this.target.querySelector('.filter-fild');

    /* 하위 컴포넌트들에 전달 해준 메소드 생성 */
    /* itemAppender 컴포넌트에게 전달해줄 메소드 */
    const appendItem = (content) => {
      const { items } = this.state;
      const seq = Math.max(...items.map((v) => v.seq)) + 1;
      const active = false;
      this.setState({ items: [...items, { seq, content, active }] });
    };
    /* Items 컴포넌트에게 전달해줄 메소드 */
    const toggleFunc = ({ target }) => {
      const { items } = this.state;
      const targetSeq = target.closest('[data-seq]').dataset.seq;
      const targetIdx = items.findIndex((v) => v.seq === Number(targetSeq));

      items[targetIdx].active = !items[targetIdx].active;

      this.setState({ items });
    };
    const deleteFunc = ({ target }) => {
      const { items } = this.state;
      const targetSeq = target.closest('[data-seq]').dataset.seq;
      const targetIdx = items.findIndex((v) => v.seq === targetSeq);
      items.splice(targetIdx, 1);

      this.setState({ items });
    };

    const getFilteredItems = () => {
      const { items, filterVersion } = this.state;
      return items.filter(({ active }) => {
        return (
          filterVersion === 0 ||
          (filterVersion === 1 && active) ||
          (filterVersion === 2 && !active)
        );
      });
    };

    /* itemFilter에 전달해줄 메소드 */
    const filterItems = (filterVersion) => {
      this.setState({ filterVersion });
    };

    /* 렌더링 이후 하위 컴포넌트들 생성 */
    /* this 를 binding 해주는 이유는 메소드 내에서 상태를 관리할 state가 
    App 컴포넌트의 state 이기 때문 */

    new ItemAppender($appenderFild, {
      appendItem: appendItem.bind(this),
    });
    new Items($itemFild, {
      getFilteredItems: getFilteredItems.bind(this),
      toggleFunc: toggleFunc.bind(this),
      deleteFunc: deleteFunc.bind(this),
    });
    new ItemFilter($filterFild, {
      filterItems: filterItems.bind(this),
    });
  }
}
