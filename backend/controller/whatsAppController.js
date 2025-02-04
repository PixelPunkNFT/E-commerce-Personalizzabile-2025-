const WhatsApp = require("../model/whatsAppModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");

const getWhatsAppNumber = asyncWrapper(async (req, res, next) => {
  let whatsApp = await WhatsApp.findOne();
  
  if (!whatsApp) {
    // Se non esiste, crea un nuovo record con il numero di default
    whatsApp = await WhatsApp.create({ phoneNumber: "+391234567890" });
  }

  res.status(200).json({
    success: true,
    whatsApp,
  });
});

const updateWhatsAppNumber = asyncWrapper(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new ErrorHandler("Per favore inserisci il numero di telefono", 400));
  }

  // Valida il formato del numero
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return next(new ErrorHandler("Formato numero di telefono non valido. Usa il formato internazionale (es. +393801234567)", 400));
  }

  let whatsApp = await WhatsApp.findOne();

  if (!whatsApp) {
    whatsApp = await WhatsApp.create({ phoneNumber });
  } else {
    whatsApp.phoneNumber = phoneNumber;
    whatsApp.updatedAt = Date.now();
    await whatsApp.save();
  }

  res.status(200).json({
    success: true,
    whatsApp,
  });
});

module.exports = {
  getWhatsAppNumber,
  updateWhatsAppNumber
};
