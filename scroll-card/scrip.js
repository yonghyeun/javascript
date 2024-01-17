class FlipCard {
  constructor(sticky) {
    this.sticky = sticky;
    this.wrapper = sticky.firstElementChild;
    this.cards = this.wrapper.children;
    this.cardsNum = this.cards.length;
    this.section = this.sticky.parentNode;
    this.start = 0;
    this.end = 0;
  }

  init() {
    this.start = document.querySelector('.before-content').offsetHeight;
    this.end = this.section.offsetHeight;
    this.stepLength = this.end / 8;
    this.rotateStart = this.stepLength * 4;
    this.rotateRange = this.end - this.rotateStart;
  }

  move(currentScroll) {
    const { start, sticky, end } = this;
    const viewHeight = sticky.offsetHeight;
    let moveRatio;
    if (currentScroll < start) {
      moveRatio = ((currentScroll + viewHeight - start) / end) * 100;
    } else {
      moveRatio = (currentScroll / end) * 100;
    }
    const offset = Math.min(moveRatio, 100);
    this.wrapper.style.transform = `translateX(${100 - offset}%)`;
  }

  rotate(currentScroll) {
    // eslint-disable-next-line object-curly-newline
    const { cards, cardsNum, rotateStart, end, stepLength, rotateRange } = this;

    if (currentScroll < rotateStart) {
      // 스크롤이 시작 지점보다 위에 있을 땐 첫 번째 카드 초기화
      cards[0].style.transform = 'rotateY(0deg)';
      return;
    }
    if (currentScroll > end) {
      // 스크롤이 종료 지점보다 아래에 있을 땐 마지막 카드 모두 뒤집어두기
      cards[cardsNum - 1].style.transform = 'rotateY(180deg)';
      return;
    }
    const scrollScaled = ((currentScroll - rotateStart) / rotateRange) * 100;
    const index = Math.floor(scrollScaled / (100 / cardsNum));
    const targetCard = cards[index];
    const stepScaled = currentScroll - rotateStart - stepLength * index;
    const rotateDegree = (180 * stepScaled) / stepLength;

    targetCard.style.transform = `rotateY(${rotateDegree}deg)`;

    if (index !== 0) {
      // 현재 뒤집어지고 있는 카드의 이전은 180도로 모두 돌려두기
      cards[index - 1].style.transform = 'rotateY(180deg)';
    }
    if (index !== cardsNum - 1) {
      // 현재 뒤집어지고 있는 카드의 다음 카드는 0도로 돌려두기
      cards[index + 1].style.transform = 'rotateY(0deg)';
    }
  }
}

const $sticky = document.querySelector('.sticky-content');
const flipCard = new FlipCard($sticky);
flipCard.init();

window.addEventListener('scroll', () => {
  flipCard.move(window.scrollY);
  flipCard.rotate(window.scrollY);
});

window.addEventListener('resize', () => {
  flipCard.init();
});
