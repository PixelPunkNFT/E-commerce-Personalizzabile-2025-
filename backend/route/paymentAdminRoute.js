const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "backend/.env" });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;

const Session = require('../model/PaymentAdminModel');
const userController = require('../middleWare/auth');
const { checkSubscriptionStatus } = require('../middleWare/auth');

router.use(cookieParser());

// Configura il middleware raw solo per la route webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Errore webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        await Session.create({
          session_id: session.id,
          subscription_id: session.subscription,
          customer_id: session.customer,
          user: session.client_reference_id,
          startDate,
          endDate,
          isActive: true,
          lastPaymentStatus: 'paid'
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await Session.updateMany(
          { subscription_id: subscription.id },
          { 
            isActive: false,
            lastPaymentStatus: 'canceled',
            endDate: new Date()
          }
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await Session.updateMany(
          { customer_id: invoice.customer },
          { 
            isActive: false,
            lastPaymentStatus: 'failed'
          }
        );
        break;
      }
    }

    res.json({received: true});
  } catch (error) {
    console.error('Errore durante la gestione dell\'evento:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Route per creare una sessione di checkout
router.post('/create-checkout-session', userController.isAuthentictedUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const currentDate = new Date();

    // Verifica se esiste già un abbonamento attivo
    const activeSession = await Session.findOne({
      user: user_id,
      isActive: true,
      endDate: { $gt: currentDate },
      lastPaymentStatus: 'paid'
    });

    if (activeSession) {
      return res.json({ 
        url: `${FRONTEND_URL}/admin/dashboard`,
        message: 'Abbonamento già attivo'
      });
    }

    // Crea una nuova sessione di checkout
    const stripeSession = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: process.env.SUBSCRIPTION_PRICE,
          quantity: 1,
        },
      ],
      client_reference_id: user_id,
      mode: 'subscription',
      success_url: `${FRONTEND_URL}/admin/dashboard?success=true`,
      cancel_url: `${FRONTEND_URL}/admin/abbonamento?canceled=true`,
    });

    res.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Errore durante la creazione della sessione di checkout:', error);
    res.status(500).json({ error: 'Errore durante la creazione della sessione' });
  }
});

// Route per il portale clienti
router.post('/create-portal-session', userController.isAuthentictedUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const activeSession = await Session.findOne({
      user: user_id,
      isActive: true,
      lastPaymentStatus: 'paid'
    }).sort({ startDate: -1 });

    if (!activeSession) {
      return res.status(404).json({ error: 'Nessun abbonamento attivo trovato' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: activeSession.customer_id,
      return_url: `${FRONTEND_URL}/admin/dashboard`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Errore durante la creazione della sessione del portale:', error);
    res.status(500).json({ error: 'Errore durante la creazione della sessione del portale' });
  }
});

module.exports = router;
