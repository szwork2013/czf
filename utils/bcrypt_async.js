'use strict';

import log from './log';
import bcrypt from 'bcrypt';
import SHA256 from 'crypto-js/sha256';


const bcryptHash = async (password, saltLength = 10) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltLength, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        return resolve(hash);
      })
    })
  })
};
exports.bcryptHash = bcryptHash;


const getPasswordString = (password) => {                    
  if (typeof password === "string") {                      
    password = SHA256(password).toString();                           
  } else {
    if (password.algorithm !== "sha-256") {                
      throw new Error("Invalid password hash algorithm. Only 'sha-256' is allowed.");       
    }                                                      
    password = password.digest;                            
  }                                                        
  return password;                                         
}; 
exports.getPasswordString = getPasswordString;


const comparePassword = async (data, encrypted) => {
  return new Promise((resolve, reject) => {
    let password = getPasswordString(data)
    bcrypt.compare(password, encrypted, (err, same) => {
      if (err) {
        return reject(err);
      }
      return resolve(same);
    })
  })
};
exports.comparePassword = comparePassword;



const hashPassword = async (password) => {                         
  password = getPasswordString(password);    
  let hash = await bcryptHash(password, 10);  
  return hash;   
};
exports.hashPassword = hashPassword;
