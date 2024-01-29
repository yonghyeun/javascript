const obj = { firstName: 'lee', lastName: 'dongdong' };
const obj2 = { age: 16, address: 'korea' };

const [{ firstName, lastName }, { age, address }] = [obj, obj2];
