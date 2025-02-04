import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productsReducer,
  productDetailsReducer,
  newReviewReducer,
  newProductReducer,
  deleteUpdateReducer,
   getALLReviewReducer,
   deleteReviewReducer
} from "./reducers/productReducers";
import { stripeKeysReducer } from "./reducers/stripeKeysReducer";
import { whatsAppReducer, updateWhatsAppReducer } from "./reducers/whatsAppReducer";
import {
  profileReducer,
  userReducer,
  forgetPasswordReducer,
  userDetailsReducer,
  allUsersReducer,
} from "./reducers/userReducer";
import { 
  siteLogoReducer,
  heroSlidesReducer,
  heroSlideAddReducer,
  heroSlideUpdateReducer,
  heroSlideDeleteReducer,
  shopNameReducer,
  contactInfoReducer,
  cookieConsentReducer,
  socialMediaReducer,
  aboutInfoReducer
} from "./reducers/siteReducer";

import {
  sizesReducer,
  newSizeReducer,
  sizeReducer
} from "./reducers/sizeReducer";

import {
  smtpReducer,
  updateSmtpReducer
} from "./reducers/smtpReducer";

import { cartReducer } from "./reducers/cartReducer";
import {
  newOrderReducer,
  myOrderReducer,
  orderDetialsReducer,
  allOrdersReducer,
  deletUpdateOrderReducer,
  

} from "./reducers/orderReducer";

const rootReducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  userData: userReducer,
  profileData: profileReducer,
  forgetPassword: forgetPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrder: myOrderReducer,
  orderDetails: orderDetialsReducer,
  addNewReview: newReviewReducer,
  addNewProduct: newProductReducer,
  deleteUpdateProduct: deleteUpdateReducer,
  allOrders: allOrdersReducer,
  deleteUpdateOrder: deletUpdateOrderReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  deleteReview :deleteReviewReducer,
  getAllReview : getALLReviewReducer,
  stripeKeys: stripeKeysReducer,
  whatsApp: whatsAppReducer,
  updateWhatsApp: updateWhatsAppReducer,
  shopName: shopNameReducer,
  siteLogo: siteLogoReducer,
  heroSlides: heroSlidesReducer,
  heroSlideAdd: heroSlideAddReducer,
  heroSlideUpdate: heroSlideUpdateReducer,
  heroSlideDelete: heroSlideDeleteReducer,
  sizes: sizesReducer,
  newSize: newSizeReducer,
  size: sizeReducer,
  contactInfo: contactInfoReducer,
  cookieConsent: cookieConsentReducer,
  socialMedia: socialMediaReducer,
  aboutInfo: aboutInfoReducer,
  smtp: smtpReducer,
  updateSmtp: updateSmtpReducer
});

// // get all Cart values from local storage and pass this initial state into store
// let initialState = {
//   cart: {
//     cartItems: localStorage.getItem("cartItem")
//       ? JSON.parse(localStorage.getItem("cartItem"))
//       : [],
//     shippingInfo: localStorage.getItem("shippingInfo")
//       ? JSON.parse(localStorage.getItem("shippingInfo"))
//       : [],
//   },
// };


// const middleware = [thunk];

// const store = createStore(
//   rootReducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;

// get all Cart values from local storage and pass this initial state into store
let initialState = {
  cart: {
    cartItems: [],
    shippingInfo: [],
  },
  cookieConsent: {
    consent: localStorage.getItem('cookieConsent') || null,
    timestamp: localStorage.getItem('cookieConsentTimestamp') || null
  }
};

// Verifica se ci sono dati salvati in localStorage prima di fare il parsing JSON
if (localStorage.getItem("cartItem")) {
  try {
    initialState.cart.cartItems = JSON.parse(localStorage.getItem("cartItem"));
  } catch (error) {
    console.error("Errore durante il parsing JSON per 'cartItem':", error);
  }
}

if (localStorage.getItem("shippingInfo")) {
  try {
    initialState.cart.shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  } catch (error) {
    console.error("Errore durante il parsing JSON per 'shippingInfo':", error);
  }
}

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
