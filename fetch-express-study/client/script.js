const url = 'http://localhost:3000/api/todo';
const $content = document.querySelector('.content');
const $form = document.querySelector('form');
// get 요청으로 할 일 가져오기

const appendToDo = (todoArr) => {
  todoArr.forEach((todo) => {
    const { id, text, done } = todo;
    const $p = document.createElement('p');
    $p.textContent =
      `${id}. ` +
      `할 일 : ${text} ` +
      `실행 여부 : ${done ? '완료' : '미완료'}`;
    $content.appendChild($p);
  });
};

fetch(url)
  .then((res) => res.json())
  .then(appendToDo);

// post 요청으로 할일 제출하기

const onSubmitHandler = (event) => {
  event.preventDefault();
  const text = event.target.text.value;
  const done = event.target.done.checked;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      done,
    }),
  })
    // post 요청 하고 나면 결과값 로그하기
    .then((res) => res.text())
    // 포스트 한 후엔 GET 요청 하여 업데이트 하기
    .then(() => {
      fetch(url)
        .then((res) => res.json())
        .then(appendToDo);
    })
    .then(console.log)
    .catch(console.error);
};

$form.addEventListener('submit', onSubmitHandler);
