const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  age: Number,
  pincode: String,
  aadharNo: String,
  password: String, // You should hash passwords before storing them
});

module.exports = mongoose.model('User', userSchema);
