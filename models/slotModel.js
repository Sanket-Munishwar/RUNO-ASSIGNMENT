const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: Date,
  time: String,
  dose: {
    type:String,
    enum:["First", "second"]
  }, // 'First' or 'Second'
  availableDoses: Number,
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Slot', slotSchema);
