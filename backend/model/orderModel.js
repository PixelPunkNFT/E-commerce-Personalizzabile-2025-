const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  // order shiping address
  shippingInfo: {
    firstName : {
      type: String,
      required: true,
    },
    lastName : {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true, // if only add here default value india
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    email : {
      type: String,
      required: true,
    },
    
  },

  // order item details array
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      image: {
        type: String,
        required: true,
      },

      selectedSize: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
        required: true,
      },
      sizeName: {
        type: String,
        required: true,
      },
    

      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductModel", 
        required: true,
      },
    },
  ],

  // user who orderd
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: true,
  },
  // payment status of product :
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  // payment timing
  paidAt: {
    type: Date,
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  // total price will some of all of three above
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  // order pending or delilverd or confirm
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },

  shippingCode: {
    type: String,
    default: "",
    trim: true,
    validate: {
      validator: function(value) {
        // Se lo stato è "Shipped", il codice di spedizione è obbligatorio
        if (this.orderStatus === "Shipped") {
          return value && value.trim().length > 0;
        }
        return true;
      },
      message: "Il codice di spedizione è obbligatorio per gli ordini spediti"
    }
  },

  deliveredAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrdersModel" , orderSchema);
