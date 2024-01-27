import Component from '../core/Component.js';

export default class Items extends Component {
  templet() {
    const { getFilteredItems } = this.props;
    const filteredItems = getFilteredItems();

    const toggleBtn = (active) => {
      return `<button class = 'toggleBtn' style = "color : ${
        active ? 'blue' : 'red'
      }">
      ${active ? '활성화' : '비활성화'}
      </button>`;
    };
    const deleteBtn = '<button class = "deleteBtn">삭제</button>';

    return `<ul>
    ${filteredItems
      .map(
        ({ seq, content, active }) =>
          `<li data-seq = "${seq}">${content}${toggleBtn(
            active,
          )}${deleteBtn}</li>`,
      )
      .join('')}
    </ul>`;
  }

  setEvent() {
    const { toggleFunc, deleteFunc } = this.props;

    this.addEvent('click', '.toggleBtn', (event) => {
      toggleFunc(event);
    });

    this.addEvent('click', '.deleteBtn', (event) => {
      deleteFunc(event);
    });
  }
}
