const asyncWrapper = require("../middleWare/asyncWrapper");
const orderModel = require("../model/orderModel");
const ProductModel = require("../model/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const SiteCustomization = require("../model/siteCustomizationModel");

//>>>>>>>>>>>>>>>  create a order    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.newOrder = asyncWrapper(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Verifica e aggiorna le quantità per ogni prodotto nell'ordine
  for (const item of orderItems) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      return next(new ErrorHandler(`Prodotto non trovato con ID: ${item.productId}`, 404));
    }

    const { selectedSize, quantity } = item;
    
    // Trova l'elemento sizeStock corrispondente alla taglia selezionata
    const sizeStockIndex = product.sizeStock.findIndex(
      s => s.size.toString() === selectedSize
    );

    if (sizeStockIndex === -1) {
      return next(new ErrorHandler(`Taglia non trovata per il prodotto: ${product.name}`, 400));
    }

    // Verifica se c'è disponibilità sufficiente
    if (product.sizeStock[sizeStockIndex].quantity < quantity) {
      return next(new ErrorHandler(
        `Quantità non disponibile per il prodotto: ${product.name} taglia: ${item.sizeName}`,
        400
      ));
    }

    // Aggiorna la quantità
    product.sizeStock[sizeStockIndex].quantity -= quantity;
    await product.save();
  }

  const order = await orderModel.create({  
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});


//>>>>>>>>>>>> getSingleOrder >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getSingleOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({ path: "user", select: "name email" });
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// >>>>>>>>>>>>>>>> getUsers all orders >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.myOrders = asyncWrapper(async (req, res) => {
  const userOrders = await orderModel.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    userOrders,
  });
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>> get all Orders -- Admin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = asyncWrapper(async (req, res, next) => {
  try {
    console.log("Update Order Request Body:", req.body);
    console.log("Update Order Params:", req.params);
    console.log("User:", req.user);

    const order = await orderModel.findById(req.params.id).populate('user', 'email');
      
    if (!order) {
      return next(new ErrorHandler("Ordine non trovato", 400));
    }

    console.log("Current Order Status:", order.orderStatus);
    console.log("Current Shipping Code:", order.shippingCode);

    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("L'ordine è già stato consegnato", 400));
    }

    // Validazione dei dati in ingresso
    if (!req.body.status && !req.body.shippingCode) {
      return next(new ErrorHandler("Nessun dato da aggiornare fornito", 400));
    }

    // Verifica che il codice di spedizione sia presente quando lo stato è "Shipped"
    if (req.body.status === "Shipped") {
      if (!req.body.shippingCode || req.body.shippingCode.trim() === "") {
        return next(new ErrorHandler("Il codice di spedizione è obbligatorio per gli ordini spediti", 400));
      }
    }

    // Aggiorna il codice di spedizione se fornito
    if (req.body.shippingCode !== undefined) {
      if (typeof req.body.shippingCode !== 'string') {
        return next(new ErrorHandler("Il codice di spedizione deve essere una stringa", 400));
      }
      order.shippingCode = req.body.shippingCode;
    }

    // Aggiorna lo stato dell'ordine se fornito
    if (req.body.status) {
      // Verifica che lo stato sia valido
      const validStatuses = ["Processing", "Shipped", "Delivered"];
      if (!validStatuses.includes(req.body.status)) {
        return next(new ErrorHandler("Stato dell'ordine non valido", 400));
      }

      // Se si sta impostando lo stato a "Shipped", il codice di spedizione è obbligatorio
      if (req.body.status === "Shipped" && (!order.shippingCode || order.shippingCode.trim() === "")) {
        return next(new ErrorHandler("Il codice di spedizione è obbligatorio per gli ordini spediti", 400));
      }

      order.orderStatus = req.body.status;
      if (order.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
      }
    }

    await order.save({ validateBeforeSave: false });

    // Invia email se lo stato è cambiato a "Shipped"
    if (req.body.status === "Shipped") {
      const siteInfo = await SiteCustomization.findOne();
      const shopName = siteInfo?.shopName || 'E-commerce';
      
      // Crea il template HTML per l'email
      const message = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            ${siteInfo.logoUrl ? `<img src="${siteInfo.logoUrl}" alt="${shopName}" style="max-width: 200px;">` : ''}
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1a237e; margin-bottom: 20px; text-align: center;">Il Tuo Ordine è Stato Spedito!</h1>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 18px;">Dettagli dell'Ordine:</h2>
              <p style="margin: 5px 0;">Numero Ordine: #${order._id}</p>
              <p style="margin: 5px 0;">Data Ordine: ${new Date(order.createdAt).toLocaleDateString('it-IT')}</p>
              <p style="margin: 5px 0;">Codice Spedizione: ${order.shippingCode}</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 18px;">Prodotti Ordinati:</h2>
              ${order.orderItems.map(item => `
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                  <img src="${item.image}" alt="${item.name}" style="max-width: 100px; margin-right: 10px;">
                  <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
                  <p style="margin: 5px 0;">Quantità: ${item.quantity}</p>
                  <p style="margin: 5px 0;">Taglia: ${item.selectedSize}</p>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <p style="font-size: 14px; color: #666;">
                Grazie per aver scelto ${shopName}!<br>
                Per qualsiasi domanda, non esitare a contattarci.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${shopName}. Tutti i diritti riservati.</p>
          </div>
        </div>
      `;

      await sendEmail({
        email: order.user.email,
        subject: `${shopName} - Il Tuo Ordine è Stato Spedito!`,
        message,
      });
    }
    
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'ordine:", error);
    return next(new ErrorHandler(error.message || "Errore durante l'aggiornamento dell'ordine", 400));
  }
});

// Funzione per aggiornare lo stock di un prodotto
async function updateStock(id, selectedSize, quantity) {
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new ErrorHandler("Prodotto non trovato", 404);
    }

    // Trova l'elemento sizeStock corrispondente alla taglia selezionata
    const sizeStockIndex = product.sizeStock.findIndex(
      s => s.size && selectedSize && s.size.toString() === selectedSize.toString()
    );

    if (sizeStockIndex === -1) {
      // Se non troviamo la taglia, non generiamo un errore quando si aggiorna lo stato a "Shipped"
      // perché le quantità sono già state aggiornate al momento dell'ordine
      return;
    }

    // Non è necessario aggiornare le quantità qui perché sono già state aggiornate
    // quando l'ordine è stato creato
    return;
  } catch (error) {
    console.error("Errore in updateStock:", error);
    throw new ErrorHandler(error.message, error.statusCode || 500);
  }
}

//>>>>>>>>>>>>>>>>>>>>> delete Order -- Admin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.deleteOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with given Id", 400));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
