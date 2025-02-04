const mongoose = require("mongoose");

const whatsAppSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, "Per favore inserisci il numero di telefono"],
    default: "+391234567890"
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("WhatsApp", whatsAppSchema);
