class Validator {
  constructor() {
    this.emailRegex = new RegExp(
      "^([!#-'*+/-9=?A-Z^-~-]+(\\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\\(\\[\\]!#-[^-~ \\t]|(\\\\[\\t -~]))+@([!#-'*+/-9=?A-Z^-~-]+(\\.[!#-'*+/-9=?A-Z^-~-]+)*|\\[[\\t -Z^-~]*])$",
    );

    this.passwordRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,13}$',
    );
  }

  checkEmpty(email, password) {
    return email.length + password.length !== 0;
  }

  checkEmail(email) {
    return this.emailRegex.test(email);
  }

  checkPassword(password) {
    return this.passwordRegex.test(password);
  }
}

const formChild = {
  $email: document.querySelector('#email'),
  $password: document.querySelector('#password'),
  $remember: document.querySelector('#remember'),
};

const Tags = {
  $container: document.querySelector('.container'),
  $error: document.querySelector('.error'),
};

const $loginButton = document.querySelector('#login-button');

const wrongInput = (text) => {
  const DELAY = 1000;
  const { $container, $error } = Tags;

  setTimeout(() => {
    $container.classList.remove('wrong');
    $error.classList.add('hidden');
  }, DELAY);
  $container.classList.add('wrong');

  $error.textContent = text;
  $error.classList.remove('hidden');
};

const validator = new Validator();

$loginButton.addEventListener('click', () => {
  const { $email, $password, $remember } = formChild;
  const [email, password, remember] = [
    $email.value,
    $password.value,
    $remember.checked,
  ];

  if (!validator.checkEmpty(email, password)) {
    wrongInput('아이디와 비밀번호를 모두 입력해주세요');
    return;
  }
  if (!validator.checkEmail(email)) {
    wrongInput('이메일 형식을 다시 확인해주세요');
    return;
  }
  if (!validator.checkPassword(password)) {
    wrongInput('비밀번호 형식을 다시 확인해주세요');
    return;
  }
});
