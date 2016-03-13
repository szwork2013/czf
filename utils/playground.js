import log from './log';
// import bcrypt from 'bcrypt';


// const hashPassword = async (password) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.genSalt(10, (err, salt) => {
//       if (err) {
//         return reject(err);
//       }
//       bcrypt.hash(password, salt, (err, hash) => {
//         if (err) {
//           return reject(err);
//         }
//         return resolve(hash);
//       })
//     })
//   })
// };

// const comparePassword = async (data, encrypted) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(data, encrypted, (err, same) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(same);
//     })
//   })
// };

// import SHA256 from 'crypto-js/sha256';

// const test = async () => {


//   var password1 = SHA256('abcde12345').toString();
//   log.trace('sha256:', password1);

//   var password2 = SHA256('abcde123457').toString();
//   log.trace('sha256:', password2)

//   var encryptedPassword = await hashPassword(password1);
//   log.trace(encryptedPassword);

//   var same = await comparePassword(password2, encryptedPassword);
//   log.trace(same);

// }

// test();


