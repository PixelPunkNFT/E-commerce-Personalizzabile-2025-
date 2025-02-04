const mongoose  = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Inserisci il nome del prodotto"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Inserisci la descrizione del prodotto"],
  },
  price: {
    type: Number,
    required: [true, "Inserisci il prezzo del prodotto"],
    maxLength: [8, "Il prezzo non può superare i 9 caratteri"],
  },
  info: {
    type: String,
    required: [true, "Inserisci le informazioni sul prodotto"],
  },

  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      product_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Inserisci la categoria prodotto"],
  },


  sizeStock: [{
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  
  
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      ratings: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      recommend: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      avatar: {
        type: String,
        required: true,
      },
    },
  ],
  // when two admins are there. tab ye pta chalgea kiss admin ne product add kiya hai
  user: {
    type: mongoose.Schema.ObjectId, //  this is for admin who will add the prduct to the db
    ref: "userModel",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel  = mongoose.model("ProductModel" , productSchema);
module.exports =ProductModel
