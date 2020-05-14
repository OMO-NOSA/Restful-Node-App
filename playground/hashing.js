const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
// let message = "I am not you";
// let hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);
const bcrypt = require('bcryptjs');
let data = {
    id: 10
};

let token = jwt.sign(data, '123bbc');
console.log(token);
let verify = jwt.verify(token, "123bbc");
console.log(verify);
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
});
let password = '123456654321';