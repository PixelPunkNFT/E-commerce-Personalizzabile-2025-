const mongoose = require("mongoose");

const smtpSchema = new mongoose.Schema({
    host: {
        type: String,
        required: [true, "Perfavore Inserisci SMTP host"]
    },
    port: {
        type: Number,
        required: [true, "Perfavore Inserisci SMTP port"]
    },
    secure: {
        type: Boolean,
        default: true
    },
    user: {
        type: String,
        required: [true, "Perfavore Inserisci SMTP user"]
    },
    pass: {
        type: String,
        required: [true, "Perfavore Inserisci password"]
    },
    from: {
        type: String,
        required: [true, "Perfavore Inserisci from email"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Smtp", smtpSchema);
