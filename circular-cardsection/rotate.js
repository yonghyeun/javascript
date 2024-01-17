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
