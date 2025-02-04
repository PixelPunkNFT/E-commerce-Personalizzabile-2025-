import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Sidebar from "./Siderbar";
import {
  updateProduct,
  clearErrors,
  getProductDetails,
} from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import { UPDATE_PRODUCT_RESET } from "../../constants/productsConstatns";
import { useRouteMatch } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CollectionsIcon from "@mui/icons-material/Collections";
import Select from "@material-ui/core/Select";
import InfoIcon from "@mui/icons-material/Info";
import MenuItem from "@material-ui/core/MenuItem";
import Navbar from "./Navbar";
import DeleteIcon from "@mui/icons-material/Delete"; // Icona per la cancellazione
import useStyles from "../User/LoginFromStyle";
import "./UpdateProduct.css";

// #TODO  Risistemare update product lato image, mantenendo aggiornamento taglie. 

function UpdateProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const classes = useStyles();
  const productId = useRouteMatch().params.id;
  const { error, product } = useSelector((state) => state.productDetails);
  
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.deleteUpdateProduct);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isCategory, setIsCategory] = useState(true);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sizeStock, setSizeStock] = useState([]);
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  const fileInputRef = useRef();
  const [toggle, setToggle] = useState(false);

  const [categories, setCategories] = useState([]);
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
  
  // const categories = [
  //   "Magliette",
  //   "Pantaloni",
  //   "Tute",
  //   "Occhiali",
  //   "Calzini",
  //   "Cappelli",
  // ];
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategory(true);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica tutte le taglie disponibili
        const response = await fetch('/api/v1/sizes');
        const data = await response.json();
        setAvailableSizes(data.sizes);

        // Se abbiamo un prodotto, imposta le taglie selezionate e le quantità
        if (product && product.sizeStock && Array.isArray(product.sizeStock)) {
          // Imposta le taglie selezionate
          const selectedIds = product.sizeStock.map(item => item.size._id);
          setSelectedSizes(selectedIds);

          // Imposta le quantità per le taglie selezionate
          const stockData = product.sizeStock.map(item => ({
            size: item.size._id,
            quantity: item.quantity
          }));
          setSizeStock(stockData);
        }
      } catch (error) {
        alert.error('Errore nel caricamento delle taglie');
      }
    };

    fetchData();
  }, [product, alert]);

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setInfo(product.info);
      setOldImages(product.images);
    }
    
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    
    if (isUpdated) {
      alert.success("Prodotto aggiornato correttamente");
      history.push("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    isUpdated,
    productId,
    product,
    updateError,
  ]);
  
  const handleSizeSelect = (sizeId) => {
    const isSelected = selectedSizes.includes(sizeId);
    if (isSelected) {
      setSelectedSizes(selectedSizes.filter(id => id !== sizeId));
      setSizeStock(sizeStock.filter(item => item.size !== sizeId));
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
      setSizeStock([...sizeStock, { size: sizeId, quantity: 0 }]);
    }
  };

  const handleSizeQuantityChange = (sizeId, quantity) => {
    const parsedQuantity = parseInt(quantity) || 0;
    setSizeStock(prevStock => 
      prevStock.map(item => 
        item.size === sizeId ? { ...item, quantity: parsedQuantity } : item
      )
    );
  };
  
  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("sizeStock", JSON.stringify(sizeStock));
    myForm.set("info", info);
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });
    
    dispatch(updateProduct(productId, myForm));
  };
  
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };  

  const handleRemoveImage = (imageIndex) => {
    // Rimuovi l'immagine dalla preview utilizzando l'indice
    setImagesPreview((oldPreviews) =>
      oldPreviews.filter((_, index) => index !== imageIndex)
    );

    // Rimuovi l'immagine dall'array delle immagini utilizzando l'indice
    setImages((oldImages) =>
      oldImages.filter((_, index) => index !== imageIndex)
    );
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    const loadImage = (index) => {
      if (index >= files.length) {
        // Tutte le immagini sono state caricate
        return;
      }

      const file = files[index];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          // Aggiungi l'immagine corrente alla lista delle immagini
          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, reader.result]);

          // Continua a caricare la prossima immagine
          loadImage(index + 1);
        }
      };

      reader.readAsDataURL(file);
    };

    // Inizia il caricamento della prima immagine
    loadImage(0);
  };

  
  

  // togle handler =>
  const toggleHandler = () => {
    console.log("toggle");
    setToggle(!toggle);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <>
            <MetaData title="Product" />
            <div className={classes.updateProduct}>
              <div
                className={
                  !toggle ? `${classes.firstBox1}` : `${classes.toggleBox1}`
                }
              >
                <Sidebar />
              </div>
              <div className={classes.secondBox1}>
                <div className={classes.navBar1}>
                  <Navbar toggleHandler={toggleHandler} />
                </div>

                <div
                  className={`${classes.formContainer} ${classes.formContainer2}`}
                >
                  <form
                    className={`${classes.form} ${classes.form2}`}
                    encType="multipart/form-data"
                    onSubmit={createProductSubmitHandler}
                  >
                    <Avatar className={classes.avatar}>
                      <AddCircleOutlineIcon />
                    </Avatar>
                    <Typography
                      variant="h5"
                      component="h1"
                      className={classes.heading}
                    >
                      Prodotto
                    </Typography>
                    {/* SpellcheckIcon */}
                    <TextField
                      variant="outlined"
                      fullWidth
                      className={`${classes.nameInput} ${classes.textField}`}
                      label="Nome Prodotto"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <ShoppingCartOutlinedIcon
                              style={{
                                fontSize: 20,
                                color: "#414141",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      variant="standard"
                      label="Prezzo"
                      value={price}
                      required
                      fullWidth
                      className={`${classes.passwordInput} ${classes.textField}`}
                      onChange={(e) => setPrice(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{
                              fontSize: 20,
                              color: "#414141",
                            }}
                          >
                            <AttachMoneyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      variant="outlined"
                      label="Info Prodotto"
                      value={info}
                      required
                      className={`${classes.passwordInput} ${classes.textField}`}
                      onChange={(e) => setInfo(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{
                              fontSize: 20,
                              color: "#414141",
                            }}
                          >
                            <InfoIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <div className={classes.selectOption}>
                      {!isCategory && (
                        <Typography
                          variant="body2"
                          className={classes.labelText}
                        >
                          Scegli la categoria
                        </Typography>
                      )}
                      <FormControl className={classes.formControl}>
                        <Select
                          variant="outlined"
                          fullWidth
                          value={category}
                          onChange={handleCategoryChange}
                          className={classes.select}
                          inputProps={{
                            name: "Categoria",
                            id: "category-select",
                          }}
                          MenuProps={{
                            classes: {
                              paper: classes.menu,
                            },
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left",
                            },
                            getContentAnchorEl: null,
                          }}
                        >
                          {!category && (
                            <MenuItem value="">
                              <em>Scegli la categoria</em>
                            </MenuItem>
                          )}
                          {categories.map((cate) => (
                            <MenuItem key={cate} value={cate}>
                              {cate}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <TextField
                      variant="outlined"
                      fullWidth
                      className={classes.descriptionInput}
                      label="Descrizione Prodotto"
                      multiline
                      rows={1}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <DescriptionIcon
                              className={classes.descriptionIcon}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />

<div className={classes.root}>
                      <div className={classes.imgIcon}>
                        <CollectionsIcon
                          fontSize="large"
                          style={{ fontSize: 40 }}
                        />
                      </div>

                      <input
                        type="file"
                        name="avatar"
                        className={classes.input}
                        accept="image/*"
                        onChange={updateProductImagesChange}
                        multiple
                        style={{ display: "none" }}
                        ref={fileInputRef}
                      />
                      <label htmlFor="avatar-input">
                        <Button
                          variant="outlined"
                          color="default"
                          className={classes.uploadAvatarButton}
                          startIcon={
                            <CloudUploadIcon
                              style={{
                                color: "#FFFFFF",
                              }}
                            />
                          }
                          onClick={handleImageUpload}
                        >
                          <p className={classes.uploadAvatarText}>
                            Carica un immagine
                          </p>
                        </Button>
                      </label>
                    </div>
                    <Box className={classes.imageArea}>
                      {imagesPreview.length > 0 ? (
                        <Box className={classes.imageArea}>
                          {imagesPreview &&
                            imagesPreview.map((image, index) => (
                              <div key={index} className={classes.imageContainer}>
                                <img
                                  src={image}
                                  alt="Product Preview"
                                  className={classes.image}
                                />
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => handleRemoveImage(index)}
                                  startIcon={<DeleteIcon />}
                                >
                                  Rimuovi
                                </Button>
                              </div>
                            ))}
                        </Box>
                      ) : (
                        <div className={classes.imageArea}>
                          {oldImages &&
                            oldImages.map((image, index) => (
                              <div key={index} className={classes.imageContainer}>
                                <img
                                  src={image.url}
                                  alt="Old Product Preview"
                                  className={classes.image}
                                />
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => handleRemoveImage(index)}
                                  startIcon={<DeleteIcon />}
                                >
                                  Rimuovi
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </Box>

                    <Typography variant="h5" component="h3" className={`${classes.passwordInput} ${classes.heading}`}>
                      Taglie e Quantità
                    </Typography>

                    <div className={classes.sizesContainer}>
                      {availableSizes.map((size) => (
                        <div key={size._id} className={classes.sizeRow}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedSizes.includes(size._id)}
                                onChange={() => handleSizeSelect(size._id)}
                                color="primary"
                              />
                            }
                            label={size.name}
                          />
                          {selectedSizes.includes(size._id) && (
                            <TextField
                              variant="outlined"
                              label={`Quantità ${size.name}`}
                              type="number"
                              value={sizeStock.find(item => item.size === size._id)?.quantity || 0}
                              onChange={(e) => handleSizeQuantityChange(size._id, e.target.value)}
                              className={classes.quantityInput}
                              style={{ marginLeft: '1rem' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="contained"
                      className={classes.loginButton}
                      fullWidth
                      type="submit"
                      startIcon={<StorageIcon />}
                      disabled={loading ? true : false}
                      style={{ marginTop: "5vh" }}
                    >
                      Aggiorna
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </>
        </>
      )}
    </>
  );
}
export default UpdateProduct;
