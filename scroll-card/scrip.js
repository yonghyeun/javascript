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
    const { cards, cardsNum, rotateStart, end, stepLength, rotateRange } = this;

    if (currentScroll < rotateStart || currentScroll > end) return;
    const scrollScaled = ((currentScroll - rotateStart) / rotateRange) * 100;
    const index = Math.floor(scrollScaled / (100 / cardsNum));
    const targetCard = cards[index];
    const stepScaled = currentScroll - rotateStart - stepLength * index;
    const rotateDegree = (180 * stepScaled) / stepLength;

    targetCard.style.transform = `rotateY(${rotateDegree}deg)`;
  }
}

const $sticky = document.querySelector('.sticky-content');
const flip = new FlipCard($sticky);
flip.init();
console.log(flip);

window.addEventListener('scroll', () => {
  flip.move(window.scrollY);
  flip.rotate(window.scrollY);
});
