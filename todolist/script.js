const $input = document.querySelector('#input');
const $submit = document.querySelector('#text-submit');
const $content = document.querySelector('#content');
const $progressTotal = document.querySelector('#progress-total');
const $progressText = document.querySelector('#progress-text');
const $progressBar = document.querySelector('#progress-bar');
let totalGoals = document.getElementsByClassName('typed-goal').length; // 설정한 목표 개수
let completedGoals = 0; // 성취한 목표 개수

$progressText.textContent = `${completedGoals}/${totalGoals}`;

// content의 내용이 변할 때 ProgressText가 변경되는 함수
const updateProgressText = () => {
  $progressText.textContent = `${completedGoals}/${totalGoals}`;
};

// content의 내용이 변할 때 ProgressBar가 변경되는 함수
// 성취도가 100%면 ProgressBar에서 빨간 불빛이 나게 하자

const updateProgressBar = () => {
  const accomplish = Math.round((completedGoals / totalGoals) * 100);
  $progressBar.style.width = `${!accomplish ? 0 : accomplish}%`;
  $progressBar.textContent = `${accomplish}%`;

  if (!accomplish) {
    $progressBar.textContent = '';
    $progressTotal.style.boxShadow = '';
  } else if (accomplish === 100) {
    $progressTotal.style.boxShadow = '0 0 10px red';
  } else {
    $progressTotal.style.boxShadow = '';
  }
};

// inner-wrapper 를 생성하여 천천히 content 에 띄우는 함수
const createInnerWrapper = () => {
  const $innerWrapper = document.createElement('div');
  $innerWrapper.classList.add('inner-wrapper');
  $content.appendChild($innerWrapper);

  requestAnimationFrame(() => {
    $innerWrapper.style.width = '90%';
    $innerWrapper.style.height = '30px';
  });

  return $innerWrapper;
};

// 목표를 설정하면 설정되어 있는 목표가 typed-goal 에 적히는 함수

const createTypedGoal = (innerWrapper) => {
  const $innerWrapper = innerWrapper;
  const $typedGoal = document.createElement('div');

  $typedGoal.classList.add('typed-goal');
  $typedGoal.id = 'uncompleted';
  $typedGoal.textContent = $input.value;
  $innerWrapper.appendChild($typedGoal);

  requestAnimationFrame(() => {
    $typedGoal.style.opacity = '1';
  });
};

// button-wrapper 를 생성하여 천천히 inner-wrapper에 띄우는 함수

const createButtonWrapper = (innerWrapper) => {
  const $buttonWrapper = document.createElement('div');
  $buttonWrapper.classList.add('button-wrapper');

  innerWrapper.appendChild($buttonWrapper);

  const $complete = document.createElement('button');
  const $delete = document.createElement('button');

  [$complete.textContent, $delete.textContent] = ['⭕', '❌️'];
  [$complete.id, $delete.id] = ['complete', 'delete'];

  [$complete, $delete].forEach((button) => {
    const $button = button;
    $buttonWrapper.appendChild($button);

    requestAnimationFrame(() => {
      $buttonWrapper.style.opacity = '1';
    });
  });
};

// submit 버튼이 click 되면 input 의 글을 가지고 content의 자식 노드를 생성하는 함수
// 목표가 설정되면 전체 목표 개수가 1 올라가고 ProgressText 의 변화를 주기
const setGoal = () => {
  if ($input.value === '') return; // 적힌 값이 없으면 early return

  const $newGoal = createInnerWrapper();
  createTypedGoal($newGoal);
  createButtonWrapper($newGoal);
  totalGoals += 1;
  updateProgressText();
  updateProgressBar();
  $input.value = ''; // 태그를 추가한 후에는 input 값 초기화
};

// submit 버튼이 click 되면 그림자가 퍼지는 함수

const shadowSubmit = () => {
  setTimeout(() => {
    $submit.style.boxShadow = '';
  }, 500);
  $submit.style.boxShadow = '0 0 10px red';
};

// input 에서 enter 가 눌리면 submit 버튼이 클릭되게 만드는 함수

const enterToSubmit = (event) => {
  if (event.key !== 'Enter') return;
  $submit.click();
};

// button-wrapper 내의 O 버튼이 눌리면 completedGoals를 올리고
// typed-goal의 텍스트를 수정하는 함수 (완료 선 긋기, id = completed 로 변경)
// 완료된 목표의 innerWrapper 에서 불빛이 나게 하자

const goalComplete = (event) => {
  const $button = event.target;
  const $buttonWrapper = event.target.parentNode;
  const $typedGoal = $buttonWrapper.previousSibling;
  const $innerWrapper = $typedGoal.parentNode;

  $typedGoal.id = 'completed';
  $innerWrapper.style.boxShadow = '0px 0px 5px blue';

  completedGoals += 1;
  $typedGoal.style.textDecoration = 'line-through';
  $typedGoal.style.color = '#aaa';
  $button.id = '';
};

// button-wrapper 내의 X 버튼이 눌리면 totalGoals를 내리고
// 해당 버튼이 존재하는 노드를 삭제하는 함수

const goalDelete = (event) => {
  const $buttonWrapper = event.target.parentNode;
  const $typedGoal = $buttonWrapper.previousSibling;
  const $innerWrapper = $buttonWrapper.parentNode;

  if ($typedGoal.id === 'completed') {
    completedGoals -= 1;
  }
  totalGoals -= 1;

  // 삭제 될 때 애니메이션을 추가하자
  $typedGoal.style.transition = 'opacity 1.5s ease';
  $buttonWrapper.style.transition = 'opacity 1.5s ease';

  setTimeout(() => {
    $content.removeChild($innerWrapper);
  }, 3000);
  requestAnimationFrame(() => {
    $buttonWrapper.style.opacity = '0';
    $typedGoal.style.opacity = '0';
  });
  $innerWrapper.removeChild($buttonWrapper);
  $innerWrapper.removeChild($typedGoal);
  $innerWrapper.style.padding = '0px';
  requestAnimationFrame(() => {
    $innerWrapper.style.width = '0%';
    $innerWrapper.style.height = '0%';
  });
};

//  O , X 버튼이 눌릴 때 빨간색 그림자가 나오게 하는 함수

const shadowButton = (event) => {
  const $button = event.target;
  setTimeout(() => {
    $button.style.boxShadow = '';
  }, 500);
  $button.style.boxShadow = '0 0 10px red';
};

// 버튼이 눌릴 때의 함수를 하나의 함수로 만들어보자
const changeGoal = (event) => {
  if (event.target.tagName !== 'BUTTON') return;
  shadowButton(event);
  if (event.target.id === 'complete') {
    goalComplete(event);
  } else if (event.target.id === 'delete') {
    goalDelete(event);
  }
  updateProgressText();
  updateProgressBar();
};

$submit.addEventListener('click', setGoal);
$submit.addEventListener('click', shadowSubmit);
$input.addEventListener('keyup', enterToSubmit);
$content.addEventListener('click', changeGoal);
