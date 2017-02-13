const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// this is for any middlewares I need to use
require('./config/middleware.js')(app, express);

require('./config/routes.js')(app, express);

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.end('hey!');
});

mongoose.connect('mongodb://localhost/prayer', (err) => {
  if (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log("Connected to Mongoose database and listening at localhost:" + PORT);
  });
});
