const asyncWrapper = require("../middleWare/asyncWrapper");
const Product = require("../model/ProductModel");
const StripeKeys = require("../model/stripeKeysModel");
const ErrorHandler = require("../utils/errorHandler");

// process the payment
exports.processPayment = asyncWrapper(async (req, res, next) => {
  const { amount, productId } = req.body;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  // Trova il prodotto e l'admin associato
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Trova le chiavi Stripe dell'admin
  const adminStripeKeys = await StripeKeys.findOne({ user: product.user });
  if (!adminStripeKeys) {
    return next(new ErrorHandler("Admin's Stripe keys not found", 404));
  }

  const stripe = require("stripe")(adminStripeKeys.secretKey);

  const myPayment = await stripe.paymentIntents.create({
    amount: amount,
    currency: "eur",
    metadata: {
      company: "Ecommerce",
      productId: productId,
      adminId: product.user.toString()
    },
  });

  res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

// send STRIPE_API_KEY to user
exports.sendStripeApiKey = asyncWrapper(async (req, res, next) => {
  const { productId } = req.query;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  // Trova il prodotto e l'admin associato
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Trova le chiavi Stripe dell'admin
  const adminStripeKeys = await StripeKeys.findOne({ user: product.user });
  if (!adminStripeKeys) {
    return next(new ErrorHandler("Admin's Stripe keys not found", 404));
  }

  res.status(200).json({ stripeApiKey: adminStripeKeys.publishableKey });
});
