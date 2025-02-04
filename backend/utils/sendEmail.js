const nodeMailer = require("nodemailer");
const Smtp = require("../model/smtpModel");

// options are pass as arg from userController
const sendEmail = async (options) => {
    try {
        // Get latest SMTP config from database
        const smtpConfig = await Smtp.findOne().sort({ createdAt: -1 });
        
        if (!smtpConfig) {
            console.error("Nessuna configurazione SMTP trovata nel database");
            throw new Error("Configurazione SMTP non trovata. Perfavore configura le impostazioni SMTP nel pannello admin.");
        }

        console.log("Configurazione SMTP trovata:", {
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            user: smtpConfig.user,
            from: smtpConfig.from
        });

        const transporter = nodeMailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass,
            },
            debug: true, // Abilita il debug
            logger: true // Abilita il logging
        });

        // Verifica la configurazione SMTP
        try {
            await transporter.verify();
            console.log("Verifica della configurazione SMTP completata con successo");
        } catch (verifyError) {
            console.error("Errore nella verifica della configurazione SMTP:", verifyError);
            throw new Error(`Errore nella verifica SMTP: ${verifyError.message}`);
        }

        const mailOptions = {
            from: smtpConfig.from,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        console.log("Tentativo di invio email a:", options.email);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email inviata con successo:", info.messageId);
        return info;
    } catch (error) {
        console.error("Errore dettagliato nell'invio dell'email:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command
        });
        throw error;
    }
}
module.exports = sendEmail;
