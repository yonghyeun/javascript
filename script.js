const obj = {
  name: 'lee',
  age: 16,
};

const obj2 = ({ name, age } = obj);

console.log(obj2);
