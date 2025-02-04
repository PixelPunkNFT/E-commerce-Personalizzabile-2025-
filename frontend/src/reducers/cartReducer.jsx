import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstant";

export function cartReducer(
  state = { cartItems: [], shippingInfo: {} },
  action
) {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      // find if product exist in cartItem already
      const isExist = state.cartItems.find((cartItem) => {
        return (
          cartItem.productId === item.productId &&
          cartItem.selectedSize === item.selectedSize
        );
      });

      console.log(action.payload);
      // if exist alerady then replace same product
      if (isExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) => {
            return cartItem.productId === item.productId &&
            cartItem.selectedSize === item.selectedSize ? item : cartItem;
          }),
        };
      }
      // if not exist then add new item value into cartItem
      else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

      case REMOVE_CART_ITEM:
        const { id, selectedSize } = action.payload;
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) => !(item.productId === id && item.selectedSize === selectedSize)
          ),
        };
      

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
}
