function Casino() {
  this.setup = function () {
    this.dice = Math.floor(Math.random(0, 0.6) * 10);
  };

  this.rollDice = function () {
    setTimeout(
      function () {
        this.setup();
        console.log(this.dice);
      }.bind(this),
      1000,
    );
  };
}

const myCasino = new Casino();
myCasino.rollDice();
