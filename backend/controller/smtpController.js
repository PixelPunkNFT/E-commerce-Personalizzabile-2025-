const Smtp = require("../model/smtpModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");

// Get SMTP Configuration
exports.getSmtpConfig = asyncWrapper(async (req, res, next) => {
    const smtp = await Smtp.findOne().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        smtp
    });
});

// Update SMTP Configuration
exports.updateSmtpConfig = asyncWrapper(async (req, res, next) => {
    const { host, port, secure, user, pass, from } = req.body;

    if (!host || !port || !user || !pass || !from) {
        return next(new ErrorHandler("Perfavore compila tutti i campi", 400));
    }

    // Create new config (this ensures we always have the latest config)
    const smtp = await Smtp.create({
        host,
        port,
        secure,
        user,
        pass,
        from
    });

    res.status(200).json({
        success: true,
        smtp
    });
});
