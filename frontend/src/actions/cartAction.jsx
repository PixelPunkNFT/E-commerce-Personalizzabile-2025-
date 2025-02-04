import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  CLEAR_CART, 
} from "../constants/cartConstant";
import axios from "axios";

export const addItemToCart = (id, quantity, selectedSize) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/product/${id}`);

  const existingCartItem = getState().cart.cartItems.find(
    (item) => item.productId === data.Product._id && item.selectedSize === selectedSize
  );

  switch (true) {
    case !!existingCartItem:
      // Se l'oggetto è già presente nel carrello con la stessa selectedSize, verifica se la quantità supera il valore di sizeStock[selectedSize]
      const newSize = existingCartItem.quantity + 1;
      const sizeStockItem = data.Product.sizeStock.find(item => item.size._id === selectedSize);
      if (sizeStockItem && newSize <= sizeStockItem.quantity) {
        dispatch({
          type: ADD_TO_CART,
          payload: {
            productId: data.Product._id,
            name: data.Product.name,
            price: data.Product.price,
            image: data.Product.images[0].url,
            selectedSize,
            sizeName: sizeStockItem.size.name,
            quantity: newSize,
          },
        });
      } else {
        // Alert per l'utente
        alert("Hai raggiunto il limite di disponibilità per la taglia selezionata.");
      }
      break;

    default:
      // Se l'oggetto non è presente nel carrello con la stessa selectedSize, aggiungilo come un nuovo prodotto
      const newSizeStockItem = data.Product.sizeStock.find(item => item.size._id === selectedSize);
      if (newSizeStockItem && quantity <= newSizeStockItem.quantity) {
        dispatch({
          type: ADD_TO_CART,
          payload: {
            productId: data.Product._id,
            name: data.Product.name,
            price: data.Product.price,
            image: data.Product.images[0].url,
            quantity,
            selectedSize,
            sizeName: newSizeStockItem.size.name,
          },
        });
      } else {
        alert("Quantità non disponibile per la taglia selezionata.");
      }
      break;
  }

  // Salva i dati del carrello in localStorage dopo aver emesso l'azione
  localStorage.setItem("cartItem", JSON.stringify(getState().cart.cartItems));
};
export const decreaseQuantityCart = (id, quantity, selectedSize) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/product/${id}`);

  const existingCartItem = getState().cart.cartItems.find(
    (item) => item.productId === data.Product._id && item.selectedSize === selectedSize
  );

  switch (true) {
    case !!existingCartItem:
      const newSize = existingCartItem.quantity - 1;
      const selectedSizeStock = data.Product.sizeStock.find(item => item.size._id === selectedSize);
      if (newSize > 0 && selectedSizeStock) {
        dispatch({
          type: ADD_TO_CART,
          payload: {
            productId: data.Product._id,
            name: data.Product.name,
            price: data.Product.price,
            image: data.Product.images[0].url,
            selectedSize,
            sizeName: selectedSizeStock.size.name,
            quantity: newSize,
          },
        });
      } else {
        
      }
      break;

    default:
      
      break;
  }

  // Salva i dati del carrello in localStorage dopo aver emesso l'azione
  localStorage.setItem("cartItem", JSON.stringify(getState().cart.cartItems));
};


// Remove item from Cart
export const removeItemFromCart = (id, selectedSize) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_CART_ITEM, payload: { id, selectedSize } });

  // Salva i dati del carrello in localStorage dopo aver emesso l'azione
  localStorage.setItem("cartItem", JSON.stringify(getState().cart.cartItems));
};



// Save Shipping Info
export const saveShippingInfo = (data) => async (dispatch, getState) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  // Save shipping info data to localStorage after dispatching the action
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};


// remove all item to cart
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART });

  // Rimuovi anche i dati del carrello dal localStorage
  localStorage.removeItem("cartItem");
};
