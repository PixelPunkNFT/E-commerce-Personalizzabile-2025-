const Size = require("../model/sizeModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");

// Crea una nuova taglia
exports.createSize = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;

  const size = await Size.create({
    name: name.toUpperCase()
  });

  res.status(201).json({
    success: true,
    size
  });
});

// Ottieni tutte le taglie
exports.getAllSizes = asyncWrapper(async (req, res, next) => {
  const sizes = await Size.find();

  res.status(200).json({
    success: true,
    sizes
  });
});

// Elimina una taglia
exports.deleteSize = asyncWrapper(async (req, res, next) => {
  const size = await Size.findById(req.params.id);

  if (!size) {
    return next(new ErrorHandler("Taglia non trovata", 404));
  }

  await size.deleteOne();

  res.status(200).json({
    success: true,
    message: "Taglia eliminata con successo"
  });
});

// Aggiorna una taglia
exports.updateSize = asyncWrapper(async (req, res, next) => {
  let size = await Size.findById(req.params.id);

  if (!size) {
    return next(new ErrorHandler("Taglia non trovata", 404));
  }

  size = await Size.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    size
  });
});
