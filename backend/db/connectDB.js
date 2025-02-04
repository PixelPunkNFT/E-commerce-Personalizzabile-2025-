const mongoose = require("mongoose");
require("dotenv").config({ path: "backend/.env" })
async function connectDB() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.DB_LINK);
        console.log("DB_connected");
    } catch (err) {
        console.error("Errore di connessione al database:", err);
        throw err; // Rilanciamo l'errore per gestirlo nel server.js
    }
}

module.exports = connectDB
