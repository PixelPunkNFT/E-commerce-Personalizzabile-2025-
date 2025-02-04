const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome della categoria è obbligatorio'],
    unique: true,
    trim: true
  }
  // Puoi aggiungere altri campi qui se necessario
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
