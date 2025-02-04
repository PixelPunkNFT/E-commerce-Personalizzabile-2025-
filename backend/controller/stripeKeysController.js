const StripeKeys = require('../model/stripeKeysModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncWrapper = require('../middleWare/asyncWrapper');

// Salva o aggiorna le chiavi Stripe
exports.saveStripeKeys = asyncWrapper(async (req, res, next) => {
    const { publishableKey, secretKey } = req.body;

    if (!publishableKey || !secretKey) {
        return next(new ErrorHandler('Please provide both publishable and secret keys', 400));
    }

    const stripeKeys = await StripeKeys.findOneAndUpdate(
        { user: req.user.id },
        {
            publishableKey,
            secretKey,
            user: req.user.id
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        stripeKeys: {
            publishableKey: stripeKeys.publishableKey
        }
    });
});

// Ottieni le chiavi Stripe dell'admin
exports.getStripeKeys = asyncWrapper(async (req, res, next) => {
    const stripeKeys = await StripeKeys.findOne({ user: req.user.id });

    if (!stripeKeys) {
        return next(new ErrorHandler('Stripe keys not found', 404));
    }

    res.status(200).json({
        success: true,
        stripeKeys: {
            publishableKey: stripeKeys.publishableKey
        }
    });
});
