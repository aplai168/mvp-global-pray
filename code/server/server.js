const express = require('express');
const app = express();
const mongoose = require('mongoose');
var PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/prayer', (err, database) => {
  if (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log('Connected to Mongoose database and listening at localhost:' + PORT);
  });
});
