import React  from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Input,
} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import {
  dispalyMoney,
  generateDiscountedPrice,

} from "../DisplayMoney/DisplayMoney";


const useStyles = makeStyles((theme) => ({
  roots11: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem",
    width: "100%",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    margin: "0.5rem 0",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transform: "translateY(-2px)",
    },
    [theme.breakpoints.down(899)]: {
      padding: "1.5rem",
    },
    [theme.breakpoints.down(699)]: {
      padding: "1rem",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  root11: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem",
    width: "100%",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    margin: "0.5rem 0",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transform: "translateY(-2px)",
    },
    [theme.breakpoints.down(899)]: {
      padding: "1.5rem",
    },
    [theme.breakpoints.down(699)]: {
      padding: "1rem",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  media: {
    width: "160px",
    height: "200px",
    marginRight: "1.5rem",
    borderRadius: "8px",
    objectFit: "cover",
    [theme.breakpoints.down(699)]: {
      width: "100%",
      height: "240px",
      marginRight: 0,
      marginBottom: "1rem",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "fit-content",

    [theme.breakpoints.down(699)]: {
      padding: "0",
      width: "fit-content",
    },
    [theme.breakpoints.down(599)]: {
      padding: "0",
      width: "fit-content",
    },
  },
  cartHeader: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  title: {
    width: "90%",
    fontSize: "1rem",
    fontWeight: 600,
    marginLeft: "1rem",
    [theme.breakpoints.down(599)]: {
      fontSize: "14px",
      marginLeft: "0",
    },
    "& .MuiTypography-subtitle1 ": {
      [theme.breakpoints.down(599)]: {
        fontSize: "14px",
      },
    },
  },

  cartDeleteIcon: {
    color: "#666",
    padding: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#ed1c24",
      background: "#fef2f2",
      transform: "scale(1.1)",
    },
  },

  priceItem: {
    display: "flex",
    alignItems: "baseline",
    gap: "1rem",
    marginLeft: "1.2rem",
    [theme.breakpoints.down(599)]: {
      marginLeft: "0rem",
      marginRight: "-1rem",
    },
  },

  cartSubHeadings: {
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "#666",
    letterSpacing: "0.5px",
  },
  itemPrice: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  itemOldPrice: {
    marginLeft: "-8px",
    fontSize: "14px",
    fontWeight: 400,

    [theme.breakpoints.down(499)]: {
      fontSize: "12px",
    },
  },

  contentBottom: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "1rem",
    alignItems: "baseline",
    width: "fit-content",
    flexDirection: "column",
    [theme.breakpoints.down(599)]: {
      marginLeft: "0rem",
      marginRight: "-1rem",
    },
    [theme.breakpoints.down(550)]: {
      position: "relative",
      marginLeft: "0rem",
    },
  },
 
}));




function CartItem({
  deleteCartItems,
  item,
  decreaseQuantity,
  increaseQuantity,
  length,
  selectedSize,
}) {
  const classes = useStyles();

  /// calculate price after discount

  let finalPrice = generateDiscountedPrice(item.price);
  let discountedPrice = item.price - finalPrice;
  discountedPrice = dispalyMoney(discountedPrice);
  let total = finalPrice * item.quantity;
  total = dispalyMoney(total);
  finalPrice = dispalyMoney(finalPrice);
  return (
    <Card className={length < 2 ? classes.root11 : classes.roots11}>
      <CardMedia
        className={classes.media}
        image={item.image}
        title={item.name}
      />
      <CardContent className={classes.content}>
        <div className={classes.contentTop}>
          <div className={classes.cartHeader}>
            <Typography variant="subtitle1" className={classes.title}>
              {item.name}
            </Typography>


            <IconButton
              aria-label="delete"
              className={classes.cartDeleteIcon}
              onClick={() => deleteCartItems(item.productId)}
            >
              <DeleteIcon />
            </IconButton>
          </div>

          <div className={classes.priceItem}>
            <Typography className={classes.cartSubHeadings} variant="body2">
              Prezzo:
            </Typography>
            <Typography variant="subtitle1" className={classes.itemPrice}>
              {finalPrice}
            </Typography>
            {discountedPrice > 0 && (
            <Typography
              variant="caption"
              component="span"
              color="black"
              className={classes.itemOldPrice}
            >
              <del>{discountedPrice}</del>
            </Typography>
             )}
          </div>
        </div>
        <div className={classes.contentBottom}>
            <Typography className={classes.cartSubHeadings} variant="body2">
            Taglia: {item.sizeName}
            </Typography>
          <Typography className="prod_details_additem">          
            Quantità:
            <div className="additem">
              <IconButton
                onClick={() => decreaseQuantity(item.productId, item.quantity, item.selectedSize)}
                className="additem_decrease"
              >
                <RemoveIcon />
              </IconButton>
              <Input
                readOnly
                type="number"
                value={item.quantity}
                className="input"
              />
              <IconButton
                onClick={() =>
                  increaseQuantity(item.productId, item.quantity, item.selectedSize)
                }
                className="additem_increase"
              >
                <AddIcon />
              </IconButton>
            </div>
          </Typography>

          <div className={classes.priceItem}>
            <Typography variant="body2" className={classes.cartSubHeadings}>
              TOTALE:
            </Typography>
            <Typography variant="subtitle1" className={classes.price}>
              {total}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
