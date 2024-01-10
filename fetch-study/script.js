const $mainContent = document.querySelector('#main-content');
const $buttonWrapper = document.querySelector('#button-wrapper');
let currentId;

const todoSort = (a, b) => {
  if (a.completed !== b.completed) {
    return a.completed - b.completed;
  }
  return b.id - a.id;
};

const showToDoList = (obj) => {
  const $list = document.createElement('div');
  $list.classList.add('list');
  $list.textContent = obj.title;
  $list.style.backgroundColor = obj.completed ? 'green' : '#eee';
  $mainContent.appendChild($list);
};

const buttonFetch = (userId) => {
  const url = `https://jsonplaceholder.typicode.com/todos?userId=${userId}`;
  fetch(url)
    .then((res) => res.json())
    .then((todos) => todos.sort(todoSort)) // 우선순위 별 정렬
    .then((sortedTodo) => {
      $mainContent.innerHTML = ''; // 이미 있는 창 비우기
      return sortedTodo;
    })
    .then((res) => res.forEach(showToDoList)) // main-content에 띄우기
    .catch((e) => {
      console.error(e);
    });
};

$buttonWrapper.addEventListener('click', (event) => {
  const { target } = event;

  if (target.tagName === 'BUTTON' && target.textContent !== currentId) {
    buttonFetch(target.textContent);
    currentId = target.textContent;
  }
});
