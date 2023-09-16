const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: Date,
  time: String,
  dose: String, // 'First' or 'Second'
  availableDoses: Number,
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Slot', slotSchema);
