const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const cloudinary = require("cloudinary");

// Configura dotenv prima di tutto
dotenv.config();

// Gestione degli errori non catturati
process.on("uncaughtException", (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

// Funzione principale asincrona per avviare il server
async function startServer() {
    try {
        // Connessione al database
        await connectDB();
        console.log('Database connesso con successo');

        // Configurazione Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Avvio del server
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`
            🚀 Server avviato in modalità ${process.env.NODE_ENV}
            🔊 In ascolto sulla porta ${PORT}
            🌐 URL Frontend: ${process.env.FRONTEND_URL}
            `);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`⛔ La porta ${PORT} è già in uso. Prova a:
                1. Chiudere altri processi che potrebbero usare la porta ${PORT}
                2. Usare una porta diversa modificando la variabile PORT nel file .env
                3. Eseguire 'npx kill-port ${PORT}' per terminare il processo`);
                process.exit(1);
            } else {
                throw err;
            }
        });

        // Gestione delle promise non gestite
        process.on("unhandledRejection", (err) => {
            console.error('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            console.error(err.stack);
            server.close(() => {
                process.exit(1);
            });
        });

        // Gestione della terminazione graceful
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('💥 Process terminated!');
            });
        });

        // Gestione di CTRL+C
        process.on('SIGINT', () => {
            console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('💥 Process terminated!');
                process.exit(0);
            });
        });

    } catch (err) {
        console.error('Errore durante l\'avvio del server:', err);
        process.exit(1);
    }
}

// Avvio del server
startServer();
