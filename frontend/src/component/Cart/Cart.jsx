import React, { useState } from "react";
import "./Cart.css";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
// import { useNavigate } from "react-router-dom";
import { addItemToCart, decreaseQuantityCart } from "../../actions/cartAction";
import { useHistory } from "react-router-dom";
import CartItem from "./CartItem";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";
const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);


  const increaseQuantity = (id, quantity, selectedSize) => {
    const newQty = quantity + 1;
    if (selectedSize <= quantity) {
      return;
    } else {
      dispatch(addItemToCart(id, newQty, selectedSize));
    }
  };

  const decreaseQuantity = (id, quantity, selectedSize) => {
    const newQty = quantity - 1;
    if (newQty <= 0) {
      // Evita che la quantità diventi negativa o zero
      return;
    } else {
      dispatch(decreaseQuantityCart(id, newQty, selectedSize));
    }
  };

  


  const handleApplyCoupon = () => {
    // handle apply coupon logic
    setIsValid(false);
  };

  const handleFocus = (event) => {
    setIsFocused(event.target.value !== "");
  };

  // new code end
  const deleteCartItems = (id, selectedSize) => {
    dispatch(removeItemFromCart(id, selectedSize));
  };
  

  const checkoutHandler = () => {
   
    history.push("/login?redirect=/shipping");
  };

  // claculte price after discount
  let totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let final = totalPrice - totalDiscount;
  final = dispalyMoney(final);
  totalDiscount = dispalyMoney(totalDiscount);
  totalPrice = dispalyMoney(totalPrice);

  return (
    <>
      <div className="cartPage">
        <MetaData title="Your Cart" />
        <h1 className="mainCartTitle">CARRELLO</h1>
        <div className="cart_HeaderTop">
          <div className="headerLeft">
            <Typography variant="h5" component="h1" className="cartHeading">
              Carrello
            </Typography>
            <Typography variant="body2" className="cartText3">
              TOTAL ({cartItems.length} item) <b>{final}</b>
            </Typography>
          </div>
          <Typography
            variant="body2"
            className="cartText2"
            onClick={() => history.push("/products")}
          >
            Torna ai prodotti
          </Typography>
        </div>

        <div className="separator_cart2"></div>

        {cartItems.length === 0 ? (
          <div className="emptyCartContainer">
            <RemoveShoppingCartIcon className="cartIcon" />

            <Typography variant="h5" component="h1" className="cartHeading">
              Il tuo carrello è vuoto
            </Typography>
            <Typography variant="body1" className="cartText">
              Niente da vedere qui.
            </Typography>
            <Typography variant="body1" className="cartText">
              Andiamo a fare shopping!
            </Typography>
            <Link to="/products">
              <Button className="shopNowButton">Acquistare ora</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart_content_wrapper">
              <div className="cart_left_container">
                {cartItems &&
                  cartItems.map((item) => (
                    <div key={`${item.productId}-${item.selectedSize}`}>
                      <CartItem
                        key={`${item.productId}-${item.selectedSize}`}
                        item={item}
                        deleteCartItems={() =>
                          deleteCartItems(item.productId, item.selectedSize)
                        }
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        length={cartItems.length}
                        id={item.productId}
                      />
                    </div>
                  ))}
              </div>

              <div className="separator_cart3"></div>
              <div className="cart_right_container">
                <div className="order_summary">
                  <Typography variant="h6" component="h4" style={{ marginBottom: '1rem' }}>
                    Riepilogo dell'ordine ({cartItems.length} {cartItems.length > 1 ? "items" : "item"})
                  </Typography>
                  <div className="order_summary_details">
                    <div className="price order_Summary_Item">
                      <span>Prezzo originale</span>
                      {/* ORIGINAL PRICE TOATAL */}
                      <p>{totalPrice}</p>
                    </div>

                    {totalDiscount !== "€0" && (
                      <div className="discount order_Summary_Item">
                        <span>Sconto</span>
                        <p>
                          <del>{totalDiscount}</del>
                        </p>
                      </div>
                    )}

                    <div className="delivery order_Summary_Item">
                      <span>Consegna</span>
                      <p>
                        <b>Gratuita</b>
                      </p>
                    </div>

                    <div className="separator_cart"></div>
                    <div className="total_price order_Summary_Item">
                      <div>
                        <Typography variant="h6" component="h4" style={{ marginBottom: '0.25rem' }}>
                          Prezzo Totale
                        </Typography>
                        <Typography variant="caption" style={{ color: '#666' }}>
                          (Incluse tutte le tasse)
                        </Typography>
                      </div>
                      <p>
                        <b>{final}</b>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="separator"></div>

                <div className="coupon-box-wrapper">
                  <div
                    className={`coupon-box-content ${
                      isFocused ? "focused" : ""
                    }`}
                  >
                    <TextField
                      label="Inserisci codice coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={() => setIsFocused(false)}
                      error={!isValid}
                      helperText={!isValid && "Invalid coupon code"}
                      variant="outlined"
                      size="small"
                      style={{ width: "200px", marginRight: "1rem" }}
                    />
                    <Button
                      variant="contained"
                      color="textPrimary"
                      className="coupon-box-apply-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <Button
                  variant="contained"
                  className="btn-custom"
                  onClick={checkoutHandler}
                >
                  Checkout
                </Button>

                <div className="paymentLogoImg">
                  <img
                    src={require("../../Image/cart/cart_img.png")}
                    alt="payemnt-icons"
                    className="paymentImg"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
