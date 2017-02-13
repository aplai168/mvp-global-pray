const mongoose = require('mongoose');
const Q = require('q');
const Bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  salt: String
});

UserSchema.methods.comparePasswords = function(candidatePassword) {
  var savedPassword = this.password;
  return Q.Promise((resolve, reject) => {
    Bcrypt.compare(candidatePassword, savedPassword, (err, boolean) => {
      if(err) {
        reject(err)
      } else {
        resolve(boolean);
      }
    });
  });
}
