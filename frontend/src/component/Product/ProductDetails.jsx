import React, { useEffect, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import Rating from "@material-ui/lab/Rating";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { generateDiscountedPrice, calculateDiscount, dispalyMoney } from "../DisplayMoney/DisplayMoney";
import useActive from "../hook/useActive";
import ReviewCard from "./ReviewCard";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { addItemToCart } from "../../actions/cartAction";
import { PRODUCT_DETAILS_RESET } from "../../constants/productsConstatns";
import MetaData from "../layouts/MataData/MataData";
import ShopLoader from "../layouts/loader/Loader";
import "./ProductDetails.css";

const ProductDetails = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity] = useState(1);
  const history = useHistory();



  const [selectedSize, setSelectedSize] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { handleActive, activeClass } = useActive(0);

  const { product, loading, error, success } = useSelector((state) => state.productDetails);


useEffect(() => {
  if (error) {
    alert.error(error);
    dispatch(clearErrors);
  }
  if (success) {
    setPreviewImg(product.images[0].url);

    handleActive(0);
    dispatch({ type: PRODUCT_DETAILS_RESET });
  }
  dispatch(getProductDetails(match.params.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  dispatch,
  error,
  alert,
  success,
  match.params.id,

]);


  // Gestione aggiunta al carrello
  const handleAddItem = async () => {
    if (!selectedSize) {
      alert.error("Seleziona una taglia prima di aggiungere al carrello");
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addItemToCart(match.params.id, quantity, selectedSize));
      alert.success("Prodotto aggiunto al carrello");
      history.push("/cart");
    } catch (error) {
      alert.error("Errore nell'aggiunta al carrello");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  
  




  // handling Preview image
  const handlePreviewImg = (images, i) => {
   
    setPreviewImg(images[i].url);
    handleActive(i);
  };

  

  // calculating Prices
  const finalPrice = generateDiscountedPrice(product.price);
  const discountedPrice = product.price - finalPrice;
  const newPrice = dispalyMoney(finalPrice);
  const oldPrice = dispalyMoney(product.price);
  const savedPrice = dispalyMoney(discountedPrice);
  const savedDiscount = calculateDiscount(discountedPrice, product.price);

  return (
    <>
      {loading ? (
        <ShopLoader />
      ) : (
        <>
          <div className="prodcutDetialsContainer">
            <MetaData title={product.name} />
            <section
              id="product_details"
              style={{ height: "auto" }}
              className="section"
            >
              <div className="product_container">
                <div className="wrapper prod_details_wrapper">
                  {/*=== Product Details Left-content ===*/}
                  <div className="prod_details_left_col">
                    <div className="prod_details_tabs">
                      {product.images &&
                        product.images.map((img, i) => (
                          <div
                            key={i}
                            className={`tabs_item ${activeClass(i)}`}
                            onClick={() => handlePreviewImg(product.images, i)}
                          >
                            <img src={img.url} alt="product-img" />
                          </div>
                        ))}
                    </div>
                    <figure className="prod_details_img">
                      <img src={previewImg} alt="product-img" />
                    </figure>
                  </div>

                  {/*=== Product Details Right-content ===*/}
                  <div className="prod_details_right_col_001">
                    <h1 className="prod_details_title">{product.name}</h1>
                    <h4 className="prod_details_info">
                      {product.info && product.info}
                    </h4>

                    <div className="prod_details_ratings">
                      <Rating
                        value={product.ratings}
                        precision={0.5}
                        readOnly
                        style={{ color: "black", fontSize: 16 }}
                      />
                      <span>|</span>
                      <Link
                        to="#"
                        style={{ textDecoration: "none", color: "#414141" }}
                      >
                        {product.numOfReviews} Giudizi
                      </Link>
                    </div>

                    <div className="prod_details_price">
                      <div className="price_box">
                        <h2 className="price">
                          {newPrice} &nbsp;
                          
                          <small className="del_price">
                          {oldPrice !== newPrice && (
                            <del>{oldPrice}</del>
                          )}
                          </small>
                        </h2>
                        {oldPrice !== newPrice && (
                        <p className="saved_price">
                          Risparmi: {savedPrice} ({savedDiscount}%)
                        </p>
                          )}
                        <span className="tax_txt">
                          (Incluso tutte le tasse)
                        </span>
                      </div>

                      <div className="badge">
                        {product.sizeStock &&
                        product.sizeStock.some(
                          (sizeItem) => sizeItem.quantity > 0
                        ) ? (
                          <span className="instock">
                            <DoneIcon /> In magazzino
                          </span>
                        ) : (
                          <span className="outofstock">
                            <CloseIcon />
                            Esaurito
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="seprator2"></div>

                    <div className="productDescription">
                      <div className="productDiscriptiopn_text">
                        <h4>Descrizione :</h4>
                        <p>{product.description}</p>
                      </div>
                     
                      <div className="deliveryText">
                        <LocalShippingOutlinedIcon />
                        Consegne Express! Dì solo quando e come.
                      </div>
                    </div>
                    <div className="seprator2"></div>

                    <div className="prod_details_sizes">
                      <h5>Scegli la taglia:</h5>
                      <FormControl component="fieldset" className="size-selector">
                        <RadioGroup 
                          value={selectedSize} 
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="size-options"
                        >
                          {product.sizeStock &&
                            product.sizeStock.map((sizeItem) => (
                              <FormControlLabel
                                key={sizeItem.size._id}
                                value={sizeItem.size._id}
                                control={<Radio />}
                                label={sizeItem.size.name}
                                disabled={sizeItem.quantity === 0}
                                className={`size-option ${sizeItem.quantity === 0 ? 'sold-out' : ''}`}
                              />
                            ))}
                        </RadioGroup>
                      </FormControl>
                    </div>

                    <div className="prod_details_actions">
                      <button
                        className="prod_details_addtocart_btn"
                        onClick={handleAddItem}
                        disabled={!product.sizeStock || !product.sizeStock.some(item => item.quantity > 0) || isAddingToCart || !selectedSize}
                      >
                        <ShoppingCartIcon className="cart-icon" />
                        {isAddingToCart ? "Aggiunta in corso..." : "Aggiungi al carrello"}
                      </button>
                      {!selectedSize && (
                        <p className="size-warning">Seleziona una taglia per procedere all'acquisto</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="reviewCard">
              <ReviewCard product={product} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
