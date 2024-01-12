class Person {
  constructor(name) {
    this._name = name; // 다른 이름으로 저장
  }

  get name() {
    return this._name;
  }
}

const tom = new Person('tom');
console.log(tom.name);
