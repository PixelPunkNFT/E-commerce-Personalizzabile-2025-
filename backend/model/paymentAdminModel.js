const mongoose = require('mongoose');

// Definisci uno schema per il modello
const sessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
  },
  subscription_id: {
    type: String,
  },
  customer_id: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  lastPaymentStatus: {
    type: String,
    enum: ['paid', 'failed', 'pending'],
    default: 'pending'
  }



}, {
  timestamps: true
});

// Aggiungi indici per migliorare le prestazioni delle query
sessionSchema.index({ user: 1, isActive: 1 });
sessionSchema.index({ session_id: 1 });
sessionSchema.index({ endDate: 1 });

// Crea un modello utilizzando lo schema
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
