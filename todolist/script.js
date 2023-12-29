const $input = document.querySelector('#input');
const $submit = document.querySelector('#text-submit');
const $content = document.querySelector('#content');

// 목표 인수로 받아 typed-goal 태그를 만드는 함수
const createTypedGoal = (goal) => {
  const $typedGoal = document.createElement('div');
  $typedGoal.classList.add('typed-goal');
  $typedGoal.textContent = goal;
  return $typedGoal;
};

// O , X 버튼을 담을 div 태그와 버튼을 만드는 함수
const createButtons = () => {
  const $buttonWrapper = document.createElement('div');
  $buttonWrapper.classList.add('button-wrapper');

  const $confirm = document.createElement('button');
  const $delete = document.createElement('button');
  const idList = ['confirm', 'delete'];
  [$confirm.textContent, $delete.textContent] = ['⭕', '❌️'];

  [$confirm, $delete].forEach((button, idx) => {
    button.id = idList[idx];
    $buttonWrapper.appendChild(button);
  });

  return $buttonWrapper;
};

const createList = (goal) => {
  const $innerWrapper = document.createElement('div');
  $innerWrapper.classList.add('inner-wrapper');

  const $typedGoal = createTypedGoal(goal);
  const $buttonWrapper = createButtons();

  [$typedGoal, $buttonWrapper].forEach((tag) => {
    $innerWrapper.appendChild(tag);
  });

  return $innerWrapper;
};

// input 에서 enter 를 누르면 submit 버튼을 누르고 초기화 하는 함수
const enterTosubmit = (event) => {
  if (event.key !== 'Enter') return;
  $submit.click();
};

// submit 버튼을 누르면 생성된 태그를 board에 append 하는 함수
const submitGoal = () => {
  if ($input.value === '') return;
  const $innerWrapper = createList($input.value);
  $input.value = '';

  $content.appendChild($innerWrapper);
};

// submit 버튼이 click 되면 그림자가 퍼지는 함수
// submit 버튼이 click 되면 그림자가 퍼지는 함수

const shadowSubmit = () => {
  $submit.style.boxShadow = '0 0 10px #ab5edb';

  setTimeout(() => {
    $submit.style.boxShadow = '';
  }, 500);
};

$input.addEventListener('keyup', enterTosubmit);
$submit.addEventListener('click', submitGoal);
$submit.addEventListener('click', shadowSubmit);
