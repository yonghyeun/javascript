// 노드 선택

const $input = document.querySelector('#input');
const $submit = document.querySelector('#text-submit');
const $content = document.querySelector('#content');

$content.innerHTML += `          <div class="inner-wrapper">
<div class="typed-goal">하루에 치킨 열번 먹기</div>
<span class="button-wrapper">
  <button id="confirm">⭕</button>
  <button id="delete">❌️</button>
</span>
</div>`;
