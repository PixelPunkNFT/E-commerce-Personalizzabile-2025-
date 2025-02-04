import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { FitScreen } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {dispalyMoney, generateDiscountedPrice} from "../DisplayMoney/DisplayMoney"
import { addItemToCart } from "../../actions/cartAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllSizes } from "../../actions/sizeAction";

const useStyles = makeStyles((theme) => ({
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '6px 12px',
    borderRadius: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 500,
    zIndex: 1,
    backdropFilter: 'blur(4px)',
  },
  root: {
    width: "100%",
    height: FitScreen,
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }
  },
  media: {
    height: 300,
    width: "100%",
    objectFit: "cover",
    transition: "all 0.5s ease",
    "&:hover": {
      transform: "scale(1.03)"
    }
  },
  content: {
    padding: "1.25rem !important"
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "0.5rem",
    lineHeight: 1.3
  },
  ratingContainer: {
    marginBottom: "0.75rem"
  },
  rating: {
    color: "#ed1c24",
    fontSize: "1rem"
  },
  reviews: {
    color: "#666",
    fontSize: "0.875rem",
    marginLeft: "0.5rem"
  },
  description: {
    fontSize: "0.875rem",
    color: "#666",
    marginBottom: "1rem",
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: 1.5
  },
  priceContainer: {
    marginBottom: "1rem"
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#666",
    marginRight: "0.75rem",
    fontSize: "0.875rem"
  },
  price: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1a1a1a"
  },
  button: {
    backgroundColor: "#1a1a1a",
    color: "white",
    borderRadius: 8,
    fontWeight: 500,
    width: "100%",
    height: 44,
    textTransform: "none",
    letterSpacing: "0.3px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#ed1c24",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(237, 28, 36, 0.15)"
    }
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: '2rem',
    width: '90%',
    maxWidth: 400,
    margin: '0 auto'
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: '1rem'
  },
  modalText: {
    color: "#666",
    fontSize: "0.875rem",
    marginBottom: "1.5rem"
  },
  sizeContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  sizeButton: {
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover:not(:disabled)': {
      borderColor: '#1a1a1a',
      backgroundColor: '#f9fafb'
    },
    '&:disabled': {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    '&.selected': {
      backgroundColor: '#1a1a1a',
      borderColor: '#1a1a1a',
      color: 'white'
    }
  },
  error: {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginBottom: "1rem"
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  cancelButton: {
    color: "#666",
    padding: '0.5rem 1rem',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  addButton: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: '0.5rem 1rem',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    "&:hover:not(:disabled)": {
      backgroundColor: "#ed1c24"
    },
    "&:disabled": {
      backgroundColor: "#e5e7eb",
      color: "#9ca3af",
      cursor: 'not-allowed'
    }
  }
}));

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(""); 
  const classes = useStyles();
  let discountPrice = generateDiscountedPrice(product.price);
  discountPrice = dispalyMoney(discountPrice);
  const oldPrice = dispalyMoney(product.price);

  const { sizes } = useSelector((state) => state.sizes);
  
  useEffect(() => {
    dispatch(getAllSizes());
  }, [dispatch]);

  const [error, setError] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSize("");
    setError("");
  };

  const handleSizeSelect = (sizeName) => {
    // Trova la taglia selezionata per ottenere il suo ID
    const selectedSizeObj = sizes.find(s => s.name.toLowerCase() === sizeName.toLowerCase());
    if (selectedSizeObj) {
      setSelectedSize(selectedSize === selectedSizeObj._id ? "" : selectedSizeObj._id);
      setError("");
    }
  };

  const truncated = product.description.split(" ").slice(0, 5).join(" ") + "...";
  const nameTruncated = product.name.split(" ").slice(0, 3).join(" ") + "...";

  const getSizeStock = (sizeNameOrId) => {
    try {
      if (!product.sizeStock || !Array.isArray(product.sizeStock)) return 0;
      if (!sizes || !Array.isArray(sizes)) return 0;

      let sizeId;
      // Se sizeNameOrId è un ID, usalo direttamente
      if (sizes.some(s => s._id === sizeNameOrId)) {
        sizeId = sizeNameOrId;
      } else {
        // Altrimenti cerca la taglia per nome e usa il suo ID
        const size = sizes.find(s => s.name.toLowerCase() === sizeNameOrId.toLowerCase());
        if (!size) return 0;
        sizeId = size._id;
      }

      // Trova lo stock corrispondente
      const sizeStock = product.sizeStock.find(s => {
        if (!s || !s.size) return false;
        const stockSizeId = (typeof s.size === 'string' ? s.size : s.size._id).toString();
        return stockSizeId === sizeId.toString();
      });

      return sizeStock?.quantity || 0;
    } catch (error) {
      console.error('Error in getSizeStock:', error);
      return 0;
    }
  };

  const addTocartHandler = (id, qty) => {
    if (!selectedSize) {
      setError("Per favore seleziona una taglia");
      return;
    }
    
    // Usa l'ID della taglia per verificare la disponibilità
    const sizeStock = getSizeStock(selectedSize);
    console.log('Verifica disponibilità per ID:', selectedSize, 'Stock:', sizeStock);
    
    if (sizeStock <= 0) {
      setError("Quantità non disponibile per la taglia selezionata");
      return;
    }
    if (qty > sizeStock) {
      setError(`Solo ${sizeStock} pezzi disponibili per questa taglia`);
      return;
    }
    
    dispatch(addItemToCart(id, qty, selectedSize));
    handleCloseModal();
  };

  const isOutOfStock = product.sizeStock.every(s => s.quantity === 0);

  return (
    <Card className={classes.root} style={{ position: 'relative' }}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
        <CardActionArea>
          <CardMedia className={classes.media} image={product.images[0].url} />
          {isOutOfStock && (
            <div className={classes.stockBadge}>Esaurito</div>
          )}
          <CardContent className={classes.content}>
            <Typography className={classes.title}>
              {nameTruncated}
            </Typography>
            <Box display="flex" alignItems="center" className={classes.ratingContainer}>
              <Rating
                name="rating"
                value={product.ratings}
                precision={0.1}
                readOnly
                size="small"
                className={classes.rating}
              />
              <Typography className={classes.reviews}>
                ({product.numOfReviews})
              </Typography>
            </Box>
            <Typography className={classes.description}>
              {truncated}
            </Typography>
            <Box display="flex" alignItems="center" className={classes.priceContainer}>
              {oldPrice !== discountPrice && (
                <Typography className={classes.oldPrice}>
                  {oldPrice}
                </Typography>
              )}
              <Typography className={classes.price}>
                {discountPrice}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
      <Box p={2}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleOpenModal}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Esaurito" : "Aggiungi al carrello"}
        </Button>
      </Box>

      {isModalOpen && (
        <div className={classes.modal} onClick={handleCloseModal}>
          <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={classes.modalTitle}>
              Seleziona la taglia
            </h2>
            <p className={classes.modalText}>
              Scegli la taglia desiderata per {product.name}
            </p>
            <div className={classes.sizeContainer}>
              {sizes && sizes.map((size) => {
                const stock = getSizeStock(size.name);
                return (
                  <button
                    key={size._id}
                    onClick={() => handleSizeSelect(size.name)}
                    disabled={!stock}
                    className={`${classes.sizeButton} ${selectedSize === size._id ? 'selected' : ''}`}
                  >
                    {size.name.toUpperCase()}
                    <br />
                    <small>
                      {stock ? `(${stock})` : 'Non disponibile'}
                    </small>
                  </button>
                );
              })}
            </div>
            {error && (
              <p className={classes.error}>
                {error}
              </p>
            )}
            <div className={classes.modalButtons}>
              <button onClick={handleCloseModal} className={classes.cancelButton}>
                Annulla
              </button>
              <button
                onClick={() => addTocartHandler(product._id, 1)}
                className={classes.addButton}
                disabled={!selectedSize || !getSizeStock(selectedSize)}
              >
                Aggiungi al carrello
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;
