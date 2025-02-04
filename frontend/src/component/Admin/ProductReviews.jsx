import React, { useEffect, useState } from "react";
import "./ProductReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import {
  getAllreviews,
  clearErrors,
  deleteProductReview,
  getAdminProducts,
} from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import StarRateIcon from "@material-ui/icons/StarRate";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import { DELETE_REVIEW_RESET } from "../../constants/productsConstatns";

function ProductReviews() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);
  const { error, reviews, loading } = useSelector((state) => state.getAllReview);
  const { error: deleteError, isDeleted } = useSelector((state) => state.deleteReview);
  const { products } = useSelector((state) => state.products);
  const [productId, setProductId] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    dispatch(getAdminProducts());
    
    if (productId) {
      dispatch(getAllreviews(productId));
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Recensione Eliminata Con Successo");
      setSelectedReview(null);
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, alert, deleteError, isDeleted, productId, history]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  const deleteReviewHandler = (reviewId) => {
    if (window.confirm("Sei sicuro di voler eliminare questa recensione?")) {
      dispatch(deleteProductReview(reviewId, productId));
    }
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    if (productId) {
      dispatch(getAllreviews(productId));
      setSelectedReview(null);
    } else {
      alert.error("Seleziona un prodotto");
    }
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon 
        key={index}
        style={{ 
          color: index < rating ? '#ffc107' : '#e4e5e9',
          fontSize: '1rem'
        }}
      />
    ));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Recensioni Prodotti" />
          <div className="reviews-page">
            <div className={!toggle ? "process-order__sidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="reviews-main">
              <Navbar toggleHandler={toggleHandler} />
              
              <div className="reviews-content">
                <div className="reviews-header">
                  <div className="reviews-title">
                    <StarRateIcon style={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                    Recensioni Prodotti
                  </div>
                </div>

                <div className="reviews-select">
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  >
                    <option value="">Seleziona un prodotto</option>
                    {products && products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={productReviewsSubmitHandler}
                    className="review-button"
                    style={{
                      marginTop: '1rem',
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      width: '100%'
                    }}
                    disabled={!productId}
                  >
                    Cerca Recensioni
                  </button>
                </div>

                {reviews && reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div 
                        key={review._id} 
                        className={`review-item ${selectedReview?._id === review._id ? 'selected' : ''}`}
                        onClick={() => setSelectedReview(review)}
                      >
                        <div className="review-header">
                          <div className="review-user">
                            <span className="review-user-name">{review.name}</span>
                            <div className={`review-rating ${review.ratings >= 3 ? 'high' : 'low'}`}>
                              {renderStars(review.ratings)}
                            </div>
                          </div>
                          <span 
                            className={`review-recommend ${review.recommend ? 'yes' : 'no'}`}
                          >
                            {review.recommend ? 'Consigliato' : 'Non Consigliato'}
                          </span>
                        </div>
                        
                        <div className="review-comment">
                          {review.comment}
                        </div>

                        <div className="review-actions">
                          <button
                            onClick={() => deleteReviewHandler(review._id)}
                            className="review-button review-button--delete"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    {productId ? 
                      "Nessuna recensione per questo prodotto" : 
                      "Seleziona un prodotto per vedere le recensioni"
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductReviews;
