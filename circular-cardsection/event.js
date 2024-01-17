class Swiper {
  constructor(eventArea) {
    this.eventArea = eventArea;
    this.partialLength = 1;
    this.width = 0;
    this.isClick = false;
    this.initalPoint = 0;
  }

  init(numPartial = 6) {
    this.width = this.eventArea.offsetWidth;
    this.partialLength = this.width / numPartial;
  }

  setInitalPoint(e) {
    this.initalPoint = e.clientX;
  }

  changeIsClick() {
    this.isClick = !this.isClick;
  }

  calculateDistance(e) {
    const isMoveRight = this.initalPoint < e.clientX;
    const distance = isMoveRight
      ? e.clientX - this.initalPoint
      : this.initalPoint - e.clientX;

    return [isMoveRight, distance];
  }

  rotateObject(e, rotCard) {
    // click 상태가 아니면 early return
    if (!this.isClick) return;

    // target 은 RotateCards 객체여야 함
    if (!(rotCard instanceof RotateCards)) {
      throw new Error(
        'Target object must be an instance of the RotateCards class!',
      );
    }

    const [isMoveRight, distance] = this.calculateDistance(e);
    const { partialLength } = this;
    if (distance < partialLength) return;

    if (isMoveRight) {
      rotCard.moveRight();
    } else {
      rotCard.moveLeft();
    }

    this.changeIsClick();
  }
}

const cards = document.querySelectorAll('.card');
const cardSequnce = [
  'first-card',
  'second-card',
  'third-card',
  'fourth-card',
  'fifth-card',
  'sixth-card',
];
const rotateCards = new RotateCards([...cards], cardSequnce);
const $container = document.querySelector('.container');
const swiper = new Swiper($container);

swiper.init();

$container.addEventListener('mousedown', (e) => {
  swiper.changeIsClick();
  swiper.setInitalPoint(e);
});

$container.addEventListener('mousemove', (e) => {
  swiper.rotateObject(e, rotateCards);
});
