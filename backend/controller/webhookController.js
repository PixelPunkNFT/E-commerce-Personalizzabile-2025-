const asyncWrapper = require("../middleWare/asyncWrapper");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Session = require('../model/PaymentAdminModel');

exports.stripeWebhook = asyncWrapper(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Trova o crea una nuova sessione di abbonamento
        const subscriptionSession = await Session.findOneAndUpdate(
          { session_id: session.id },
          {
            user: session.client_reference_id, // Assicurati di passare l'user ID come client_reference_id
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 giorni
            isActive: true,
            lastPaymentStatus: 'paid',
            subscription_id: session.subscription,
            customer_id: session.customer
          },
          { upsert: true, new: true }
        );
        
        console.log('Subscription session updated:', subscriptionSession);
      } catch (error) {
        console.error('Error updating subscription session:', error);
      }
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      
      try {
        // Aggiorna la sessione esistente
        const updatedSession = await Session.findOneAndUpdate(
          { subscription_id: invoice.subscription },
          {
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Estendi di 30 giorni
            isActive: true,
            lastPaymentStatus: 'paid'
          },
          { new: true }
        );
        
        console.log('Subscription renewed:', updatedSession);
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      
      try {
        // Marca l'abbonamento come fallito
        const failedSession = await Session.findOneAndUpdate(
          { subscription_id: failedInvoice.subscription },
          {
            isActive: false,
            lastPaymentStatus: 'failed'
          },
          { new: true }
        );
        
        console.log('Subscription payment failed:', failedSession);
      } catch (error) {
        console.error('Error updating failed subscription:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
