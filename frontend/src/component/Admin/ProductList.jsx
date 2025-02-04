import React, { useState, useEffect } from "react";
import "./ProductList.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../actions/productAction";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert"; 

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_PRODUCT_RESET } from "../../constants/productsConstatns";

function ProductList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);

  const { error, products, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateProduct
  );
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
   
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Prodotto eliminato con successo");
    
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, alert, deleteError, history, isDeleted]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  // togle handler =>
  const toggleHandler = () => {

    setToggle(!toggle);
  };

  // to close the sidebar when the screen size is greater than 1000px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      

      }
    };
       
          
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`ALL PRODUCTS - Admin`} />

          <div className="product-list" style={{ marginTop: 0 }}>
            <div className={!toggle ? "listSidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="list-table">
              <Navbar toggleHandler={toggleHandler} />
              <div className="productListContainer">
                <h4 id="productListHeading">TUTTI I PRODOTTI</h4>
                
                <div className="products-container">
                  {/* Lista prodotti a sinistra */}
                  <div className="products-list">
                    {products.map((product) => (
                      <div 
                        key={product._id}
                        className={`product-item ${selectedProduct?._id === product._id ? 'selected' : ''}`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img 
                          src={product.images[0]?.url || 'placeholder.jpg'} 
                          alt={product.name}
                        />
                        <div>
                          <h3>{product.name}</h3>
                          <p>€{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dettagli prodotto a destra */}
                  <div className="product-details">
                    {selectedProduct ? (
                      <>
                        <div className="product-details-header">
                          <h2>{selectedProduct.name}</h2>
                          <div>
                            <Link to={`/admin/product/${selectedProduct._id}`}>
                              <EditIcon className="icon-" />
                            </Link>
                            <DeleteIcon 
                              className="iconbtn" 
                              onClick={() => deleteProductHandler(selectedProduct._id)}
                            />
                          </div>
                        </div>
                        <div className="product-details-content">
                          <div>
                            <img 
                              src={selectedProduct.images[0]?.url} 
                              alt={selectedProduct.name}
                              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          </div>
                          <div>
                            <h3>Prezzo: €{selectedProduct.price}</h3>
                            <h3>Taglie disponibili:</h3>
                            <div className="sizes-grid">
                              {selectedProduct.sizeStock.map((item, index) => (
                                <div key={index} className="size-item">
                                  <div className="size-name">{item.size.name}</div>
                                  <div>Quantità: {item.quantity}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="no-product-selected">
                        Seleziona un prodotto per vedere i dettagli
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductList;
