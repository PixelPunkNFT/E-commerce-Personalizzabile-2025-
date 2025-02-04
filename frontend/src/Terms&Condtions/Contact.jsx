import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactInfo } from "../actions/siteAction";
import {
  Divider,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import MetaData from "../component/layouts/MataData/MataData";
const useStyles = makeStyles((theme) => ({
  root_contactus: {
    padding: "8rem 0",
    backgroundColor: "white",
    width: "100%",
    overflow: "hidden",
  },
  contact_Container_contactus: {
    width: "70%",
    margin: "0 auto",
  },
  title_contact_us: {
    color: "#414141",
    fontSize: "1.5rem !important",
    padding: "1rem 3rem",
    fontFamily: "Roboto",
    fontWeight: "700 !important",
    letterSpacing: "2px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px ",
      padding: "1rem 0",
    },
  },
  divider_contact: {
    width: "90%",
    backgroundColor: "#b6b6b6",
    margin: "2rem 0 !important",
  },
  helpTitle_contact_us: {
    fontSize: "18px",
    color: "black",
    padding: "2rem 0",
  },
  para_contact: {
    paddingBottom: "3rem",
    marginLeft: "0.5rem",
    color: "#414141",
    lineHeight: "1.5rem",
    fontSize: "16px !important",
    width: "90%",
    letterSpacing: "2px",
    [theme.breakpoints.down("sm")] :{
      width : "100%"
    }
  },
  address_contacts: {
    paddingBottom: "3rem",
    marginLeft: "0.5rem",
    color: "#414141",
    lineHeight: "1.5rem",
    fontSize: "16px !important",
    width: "90%",
    letterSpacing: "2px",
  },
  buttonGroup: {
    "& > *": {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
    },
  },
  supportButton: {
    backgroundColor: "#292929 !important",
    color: "white !important",
    width: "fit-content !important",
    padding: "0.8rem 2rem   !important",
    marginLeft: "3.3rem !important",
    borderRadius: "5px !important",
    "&:hover": {
      backgroundColor: "#ed1c24 !important",
      color: "white !important",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "15px !important",
    },
  },
  callButton: {
    backgroundColor: "#292929 !important",
    color: "white   !important",
    width: "fit-content     !important",
    padding: "0.8rem 2rem   !important",
    marginLeft: "1.3rem !important",
    borderRadius: "5px !important",
    "&:hover": {
      backgroundColor: "#ed1c24 !important",
      color: "white !important",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0.8rem 3.4rem   !important",
    },
  },
  formContainer_container: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  formField_contact: {
    // marginBottom: "2rem",
    width: "100%",
  },
  submitButtons: {
    alignSelf: "flex-start",
    backgroundColor: "#292929 !important",
    color: "white   !important",
    width: "fit-content     !important",
    padding: "1rem 3rem   !important",
    borderRadius: "5px !important",
    "&:hover": {
      backgroundColor: "#ed1c24 !important",
      color: "white !important",
    },
  },
  SelectOption_contact: {
    width: "100%",
    marginBottom: "2rem",
    "& .MuiOutlinedInput-root_contactus": {
      "& fieldset": {
        borderColor: "#000",
        borderRadius: "none !important",
      },
      "&:hover fieldset": {
        borderColor: "#000",
        "&.Mui-focused fieldset": {
          borderColor: "#000",
        },
      },
    },
    "& .MuiSelect-root_contactus": {
      backgroundColor: "white",
      color: "black",
    },
    "& .MuiSelect-icon": {
      color: "black",
    },
    "& .MuiList-root_contactus": {
      backgroundColor: "white",
      color: "black",
    },
  },
  lableText_contact: {
    color: "#000",
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "1rem",
  },
  menu_contact: {
    "& .MuiList-root_contactus": {
      backgroundColor: "white",
      color: "black",
    },
  },
}));

const ContactForm = () => {
  const classes = useStyles();
  const alert = useAlert();
  const history = useHistory();
  const dispatch = useDispatch();
  const { contactInfo } = useSelector((state) => state.contactInfo);

  useEffect(() => {
    dispatch(getContactInfo());
  }, [dispatch]);

  const handleCall = () => {
    if (contactInfo && contactInfo.phoneNumber) {
      window.location.href = `tel:+${contactInfo.phoneNumber}`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert.success("Il tuo messaggio è stato inviato con successo");
    history.push("/");
  };

  return (
    <Box className={classes.root_contactus}>
      <MetaData  title={"Contact Us"}/>
      <div className={classes.contact_Container_contactus}>
        <Typography variant="h2" className={classes.title_contact_us}>
        Contattaci
        </Typography>

        <Divider className={classes.divider_contact} />

        <Typography variant="h4" className={classes.helpTitle_contact_us}>
        Hai bisogno di aiuto?
        </Typography>

        <Typography variant="body2" className={classes.para_contact}>
        Abbiamo a disposizione la chat dal vivo, cerca l'icona della chat in basso a destra
          nell'angolo della mano di questa pagina. Se non è presente, chiamaci al{" "}
          <strong
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleCall}
          >
            {contactInfo?.phoneNumber }
          </strong>
          .
        </Typography>

        <Typography variant="body2" className={classes.para_contact}>
          {contactInfo?.businessHours && (
            <>
              <span className={classes.para2}>Lunedì: {contactInfo.businessHours.monday}</span>
              <br />
              <span className={classes.para2}>Martedì: {contactInfo.businessHours.tuesday}</span>
              <br />
              <span className={classes.para2}>Mercoledì: {contactInfo.businessHours.wednesday}</span>
              <br />
              <span className={classes.para2}>Giovedì: {contactInfo.businessHours.thursday}</span>
              <br />
              <span className={classes.para2}>Venerdì: {contactInfo.businessHours.friday}</span>
              <br />
              <span className={classes.para2}>Sabato: {contactInfo.businessHours.saturday}</span>
              <br />
              <span className={classes.para2}>Domenica: {contactInfo.businessHours.sunday}</span>
            </>
          )}
        </Typography>

        

        <Typography variant="body2" className={classes.address_contacts}>
          {contactInfo?.businessDetails && (
            <>
              <span style={{ fontWeight: "500", paddingBottom: "0.5rem", display: "block" }}>
                {contactInfo.businessDetails.shopName}
              </span>
              <span style={{ display: "block" }}>
                {contactInfo.businessDetails.address}
              </span>
              <span style={{ display: "block" }}>
                {contactInfo.businessDetails.postalCode} {contactInfo.businessDetails.city}
              </span>
              <span style={{ display: "block" }}>
                {contactInfo.businessDetails.country}
              </span>
              {contactInfo.businessDetails.vatNumber && (
                <span style={{ display: "block", marginTop: "1rem" }}>
                  P.IVA: {contactInfo.businessDetails.vatNumber}
                </span>
              )}
            </>
          )}
        </Typography>
      </div>
    </Box>
  );
};

export default ContactForm;
