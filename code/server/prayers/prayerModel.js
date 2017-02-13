const mongoose = require('mongoose');
const Schema = mongoose.schema;

var PrayerSchema = new Schema({
  title:  String,
  username: String,
  requestMessage: [{
    type: String,
    date: Date
  }],
  date: {type: Date, default: Date.now},
  hidden: Boolean,
  meta: {
    prayed: Number
  }
});

module.exports = mongoose.model('prayer', PrayerSchema);
