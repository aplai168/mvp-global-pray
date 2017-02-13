const mongoose = require('mongoose');
const Q = require('q');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const saltFactor = 10;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  salt: String,
});

UserSchema.methods.comparePasswords = (candidatePassword) => {
  const savedPassword = this.password;
  return Q.Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, savedPassword, (err, boolean) => {
      if (err) {
        reject(err);
      } else {
        resolve(boolean);
      }
    });
  });
};
// pre is a middleware as opposed to post
UserSchema.pre('save', (next) => {
  const user = this;
  // has the password if new or different
  if (!user.isModified('password')) {
    // pass it forward if not modified
    return next();
  }
  bcrypt.genSalt(saltFactor, (err, salt) => {
    if (err) {
      return next(err);
    }
    // hash the password along with the salt
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      user.salt = salt;
      return next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
