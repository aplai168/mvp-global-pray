const Q = require('q');
const jwt = require('jwt-simple');
const User = require('./userModel.js');


// Promisify a few mongoose methods with the `q` promise library
const findUser = Q.nbind(User.findOne, User);
const createUser = Q.nbind(User.create, User);

module.exports = {
  signin: (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    findUser({ username }) // property shorthand
      .then((user) => {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then((foundUser) => {
              if (foundUser) {
                const token = jwt.encode(user, 'secret');
                res.json({ token: token });
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail((error) => {
        next(error);
      });
  },

  signup: function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    // check to see if user already exists
    findUser({ username: username })
      .then((user) => {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          // make a new user if not one
          return createUser({
            username,
            password,
          });
        }
      })
      .then(function (user) {
        // create token to send back for auth
        const token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {

    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    console.log('checkauth');
    const token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      const user = jwt.decode(token, 'secret');
      findUser({ username: user.username })
        .then((foundUser) => {
          if (foundUser) {
            res.sendStatus(200);
          } else {
            res.sendStatus(401);
          }
        })
        .fail((error) => {
          console.log('error');
          next(error);
        });
    }
  },
};
