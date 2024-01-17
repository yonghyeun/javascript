class RotateCards {
  constructor(cards, cardSequnce) {
    this.cards = cards;
    this.cardSequnce = cardSequnce;
  }

  shuffle() {
    this.cards.forEach((item, index) => {
      const card = item;
      card.id = this.cardSequnce[index];
    });
  }

  moveLeft() {
    const value = this.cardSequnce.pop();
    this.cardSequnce.unshift(value);

    this.shuffle();
  }

  moveRight() {
    const value = this.cardSequnce.shift();
    this.cardSequnce.push(value);
    this.shuffle();
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
const leftButton = document.querySelector('#left');
const rightButton = document.querySelector('#right');

const rotateCards = new RotateCards([...cards], cardSequnce);

leftButton.addEventListener('click', () => {
  rotateCards.moveLeft();
});

rightButton.addEventListener('click', () => {
  rotateCards.moveRight();
});
