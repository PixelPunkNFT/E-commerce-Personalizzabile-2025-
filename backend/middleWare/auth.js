const asyncWrapper = require("../middleWare/asyncWrapper");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const Session = require('../model/PaymentAdminModel');
require("dotenv").config({ path: "backend/.env" });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;



exports.checkSubscriptionStatus = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    
    // Recupera la sessione attiva più recente
    const activeSession = await Session.findOne({
      user: user_id,
      isActive: true,
      lastPaymentStatus: 'paid'
    }).sort({ startDate: -1 });
    
    if (!activeSession) {
      return res.status(403).json({ error: "Abbonamento non attivo" });
    }

    const currentDate = new Date();
    if (activeSession.endDate <= currentDate) {
      activeSession.isActive = false;
      await activeSession.save();
      return res.status(402).json({ error: "Abbonamento scaduto" });
    }

    // Verifica lo stato dell'abbonamento su Stripe solo se necessario
    if (activeSession.subscription_id && !req.originalUrl.includes('/webhook')) {
      try {
        const subscription = await stripe.subscriptions.retrieve(activeSession.subscription_id);
        if (subscription.status !== 'active') {
          activeSession.isActive = false;
          activeSession.lastPaymentStatus = 'failed';
          await activeSession.save();
          return res.status(402).json({ error: "Abbonamento non attivo su Stripe" });
        }
      } catch (stripeError) {
        console.error('Errore Stripe:', stripeError);
      }
    }
    
    next();
  } catch (error) {
    console.error('Errore durante la verifica dello stato dell\'abbonamento:', error);
    next(new ErrorHandler('Errore del server', 500));
  }
};



exports.isAuthentictedUser = asyncWrapper(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Per favore effettua il login per accedere a questa risorsa', 401));
    }

    try {
        const deCodeToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(deCodeToken.id);
        
        if (!user) {
            return next(new ErrorHandler('Utente non trovato', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler('Token non valido o scaduto', 401));
    }
});


      // taking role as param and converting it into array using spread operator. for using array method
exports.authorizeRoles = (...roles) =>{
 return (req , res , next) =>{
     if (roles.includes(req.user.role) ===false){ 
        return next(
            new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resouce `,
                403)
        )
     }
   
    next();
 }
}
