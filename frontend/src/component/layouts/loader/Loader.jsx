import React from "react";
import { ReactComponent as ShopSpinner } from "../../../Image/Loader-svg/logo.svg";
import "./Loader.css";

const ShopLoader = () => (
  <div className="shop-loader">
    <ShopSpinner className="spinner" />
  </div>
);

export default ShopLoader;
