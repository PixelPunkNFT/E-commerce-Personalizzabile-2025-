const express = require("express");
const router = express.Router();
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");
const Session = require('../model/PaymentAdminModel');

// Route per verificare lo stato dell'abbonamento
router.get("/check-subscription", isAuthentictedUser, authorizeRoles("admin"), async (req, res) => {
    try {
        const user_id = req.user.id;
        const currentDate = new Date();
        
        // Recupera la sessione attiva più recente
        const activeSession = await Session.findOne({
            user: user_id,
            isActive: true,
            endDate: { $gt: currentDate },
            lastPaymentStatus: 'paid'
        }).sort({ startDate: -1 });

        if (!activeSession) {
            return res.status(403).json({ 
                status: "invalid", 
                error: "Nessun abbonamento attivo" 
            });
        }

        // Se arriviamo qui, significa che l'abbonamento è valido
        res.status(200).json({ 
            status: "valid",
            subscription: {
                startDate: activeSession.startDate,
                endDate: activeSession.endDate,
                isActive: activeSession.isActive,
                lastPaymentStatus: activeSession.lastPaymentStatus
            }
        });
    } catch (error) {
        console.error('Errore durante la verifica dell\'abbonamento:', error);
        res.status(500).json({ 
            status: "error", 
            error: "Errore durante la verifica dell'abbonamento" 
        });
    }
});

module.exports = router;
