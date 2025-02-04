const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome della taglia è obbligatorio'],
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Size = mongoose.model('Size', sizeSchema);

module.exports = Size;
