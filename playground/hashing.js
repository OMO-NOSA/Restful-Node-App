const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
// let message = "I am not you";
// let hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);

let data = {
    id: 10
};

let token = jwt.sign(data, '123bbc');
console.log(token);
let verify = jwt.verify(token, "123bbc");
console.log(verify);