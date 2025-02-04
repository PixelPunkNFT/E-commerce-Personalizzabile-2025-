const mongoose = require('mongoose');

const stripeKeysSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  publishableKey: {
    type: String,
    required: [true, 'Stripe publishable key is required']
  },
  secretKey: {
    type: String,
    required: [true, 'Stripe secret key is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StripeKeys', stripeKeysSchema);
