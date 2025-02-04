import React, { useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { getShopName } from "../../actions/siteAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import HeroSlider from "./HeroSilder";
import FeaturedSlider from "./FeatureSlider";
function Home() {
  // we provided all parameter for react-alert at index.js
  const alert = useAlert();

  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  const { shopName } = useSelector((state) => state.shopName);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  useEffect(() => {
    dispatch(getShopName());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <>
             <MataData title={shopName} />  {/* titolo favicon */}
            <div className="Home_Page">
              <div className="heroSlider_Home">
                <HeroSlider />;
              </div>

              <div className="feature">
                <h2 className="section_title">Prodotti Sponsorizzati</h2>
                {products &&
             
                
                       <FeaturedSlider   products ={products}/> }
                  
                 
              
              </div>

              <h2 className="trending_heading">Prodotti di Tendenza</h2>

              <div className="trending-products">
                {products &&
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </div>
          </>
        </>
      )}
    </>
  );
}

export default Home;
