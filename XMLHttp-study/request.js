// request를 보내는 콜백 함수 생성
const $button = document.querySelector('button');
const request = new XMLHttpRequest();
const URL =
  'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';

const sendRequest = () => {
  // HTTP 요청 초기화
  request.open('GET', URL);
  // HTTP 수신 설정
  request.responseType = 'json';
  // HTTP 요청 보내기
  request.send();
};

// 버튼이 눌리면 JSON 파일이 있는 URL에 GET 요청을 보내 JSON 파일을 가져옴

$button.addEventListener('click', () => {
  if (request.readyState !== 0) return;
  sendRequest();
});

// 요청이 완료되면 파싱해온 객체를 로그하자

request.addEventListener('load', () => {
  console.log(request.response);
});

// 기존 html 에 존재하는 header 태그 가져오기
const $header = document.querySelector('header');

// JSON의 프로퍼티로 접근하여 header에 내용 붙이기
const populateHeader = (jsonObj) => {
  const $h1 = document.createElement('h1');
  $h1.textContent = jsonObj.squadName;
  $header.appendChild($h1);

  const $p = document.createElement('p');
  $p.textContent = `Hometown : ${jsonObj.homeTown} // Formed : ${jsonObj.formed} `;

  $header.appendChild($p);
};

// JSON의 프로퍼티에 접근하여 article에 내용 붙이기

const showHeroes = (jsonObj) => {
  const heroes = jsonObj.members; // json 내의 members의 프로퍼티 값은 유사배열 객체
  const $section = document.querySelector('section');
  [...heroes].forEach((hero) => {
    const $div = document.createElement('div');
    const $h2 = document.createElement('h2');
    const $p1 = document.createElement('p');
    const $p2 = document.createElement('p');
    const $p3 = document.createElement('p');
    const $ul = document.createElement('ul');

    $h2.textContent = hero.name;
    $p1.textContent = `Secret identity : ${hero.secretidentity}`;
    $p2.textContent = `Age : ${hero.age}`;
    $p3.textContent = 'SuperPowers:';

    const superPowers = hero.powers; // hero.power 는 배열

    superPowers.forEach((power) => {
      const $li = document.createElement('li');
      $li.textContent = power;
      $ul.appendChild($li);
    });

    [$h2, $p1, $p2, $p3, $ul].forEach((tag) => $div.appendChild(tag));
    $section.appendChild($div);
  });
};

// 요청이 완료되면 요청한 불러온 JSON 파일을 이용하여 태그 생성하기
request.addEventListener('load', () => {
  const superHeroes = request.response;
  populateHeader(superHeroes);
  showHeroes(superHeroes);
});
