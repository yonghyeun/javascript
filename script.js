class Person {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log(`hi i am ${this.name}`);
  }
}

class Korean extends Person {}

let leedongdong = new Korean('leedongdong');

leedongdong.sayHi();
