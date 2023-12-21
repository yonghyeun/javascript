// 다른 작업자가 만들어둔 클래스

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    Object.entries(this).forEach(([property, value]) => {
      console.log(`${property} : ${value}`);
    });
  }
}

class newPerson extends Person {
  constructor(name, age, password) {
    super(name, age),
      (this[Symbol('password')] = password),
      (this[Symbol('birthCalcul')] = () => {
        const currentDate = new Date();
        return currentDate.getFullYear() - this.age;
      });
  }
}

const tom = new newPerson('tom', 16, 1234);
tom.introduce();
