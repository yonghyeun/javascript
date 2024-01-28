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

const randomText = Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga iste doloremque ab molestiae molestias aliquam, maxime, facilis possimus voluptas, nobis corrupti dolore corporis quisquam. Maiores iure ipsam hic ullam nobis.