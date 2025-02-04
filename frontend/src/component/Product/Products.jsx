import React, { useEffect,useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { useRouteMatch } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InventoryIcon from "@mui/icons-material/Inventory";


import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";


import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";



function Products() {
  const [categories, setCategories] = useState([]);
  const match = useRouteMatch();
  const keyword = match.params.keyword;
  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
  } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  // Effetto per gestire gli errori e caricare i prodotti
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error, alert]);

  // Gestori degli eventi
  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
    setIsFiltersApplied(true);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
    setSelectedCategory(category);
    setIsFiltersApplied(true);
    setCurrentPage(1);
  };

  const [selectedRating, setSelectedRating] = React.useState("all");

  const handleRatingChange = (event) => {
    const value = event.target.value;
    setRatings(value);
    setSelectedRating(value);
    setIsFiltersApplied(true);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setSelectedCategory("");
    setRatings(0);
    setSelectedRating("all");
    setIsFiltersApplied(false);
    setCurrentPage(1);
  };

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories'); // Assicurati che l'URL corrisponda all'endpoint del server
      const data = await response.json();
      setCategories(data.map(cat => cat.name)); // Assumendo che 'data' sia un array di oggetti categoria
    } catch (error) {
      alert.error('Impossibile caricare le categorie');
    }
  };

  fetchCategories();
}, [alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="PRODUCTS --Ecart" />
          <h1 className="mainProductTitle">PRODOTTI</h1>
          {products === undefined || products.length === 0 ? (
            <div className="emptyCartContainer" style={{ marginTop: "5rem", background: "white", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
              <InventoryIcon style={{ fontSize: "4rem", color: "#3182ce", marginBottom: "1rem" }} />
              
              <Typography variant="h5" component="h1" style={{ marginBottom: "1rem", color: "#2d3748", fontWeight: "600" }}>
                {isFiltersApplied ? "Nessun prodotto corrisponde ai filtri selezionati" : "Nessun prodotto trovato"}
              </Typography>
              
              {isFiltersApplied ? (
                <Button
                  variant="contained"
                  onClick={resetFilters}
                  style={{
                    backgroundColor: "#3182ce",
                    color: "white",
                    marginTop: "1rem",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "500"
                  }}
                >
                  Rimuovi filtri
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: "#3182ce",
                    color: "white",
                    marginTop: "1rem",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "500"
                  }}
                >
                  Ricarica
                </Button>
              )}
            </div>
          ) : (
            <div className="productPage">
              <div className="prodcutPageTop">
                <div className="filterBox">
                  {/* Categories */}
                  <div className="categoriesFilter">
                    <Typography
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                        fontWeight: 700,
                        color: "#414141",
                      }}
                    >
                      Categorie
                    </Typography>
                    <ul className="categoryBox">
                      {categories.map((category, index) => (
                        <li className="category-link" key={index}>
                          <label
                            htmlFor={`category-${index}`}
                            className="category-label"
                          >
                            <input
                              type="checkbox"
                              id={`category-${index}`}
                              className="category-checkbox"
                              value={category}
                              checked={category === selectedCategory}
                              onChange={() => handleCategoryChange(category)}
                            />
                            {category}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="filter_divider"></div>
                  {/* Ratings */}
                  <div className="ratingsFilter">
                    <Typography
                      style={{
                        fontSize: "18px",
                        padding: "10px",
                        fontWeight: 700,
                        color: "#414141",
                      }}
                    >
                      Valutazioni
                    </Typography>
                    <RadioGroup
                      value={selectedRating}
                      onChange={handleRatingChange}
                      row
                      className="ratingsBox"
                    >
                      <FormControlLabel
                        value="4"
                        control={<Radio />}
                        label=" Da 4★ in Su"
                      />
                      <FormControlLabel
                        value="3"
                        control={<Radio />}
                        label="Da 3★ in Su"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Da 2★ in Su"
                      />
                    </RadioGroup>
                  </div>
                  <div className="filter_divider"></div>
                  {/* Clear Filters */}
                </div>

                <div
                  className={products.length < 2 ? "products1" : "products"}
                >
                  {products &&
                    products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                </div>
              </div>

              {/* Pagination */}
       
                <div className="paginationBox">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNoHandler}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                  />
                </div>
             
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Products;
