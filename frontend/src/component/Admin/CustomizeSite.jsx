import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaymentIcon from "@mui/icons-material/Payment";
import StoreIcon from "@mui/icons-material/Store";
import ShareIcon from "@mui/icons-material/Share";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";

import "./CustomizeSite.css";

function CustomizeSite() {
  const [toggle, setToggle] = React.useState(false);

  const customizeOptions = [
    {
      title: "Personalizzazione stripe per pagamenti utente",
      icon: <PaymentIcon />,
      path: "/admin/customize/payments"
    },
    {
      title: "Personalizzazione Email e WhatsApp",
      icon: <PaymentIcon />,
      path: "/admin/customize/whatsapp"
    },
    {
      title: "Personalizzazione E-commerce immagini",
      icon: <ImageIcon />,
      path: "/admin/customize/images"
    },
    {
      title: "Personalizzazione E-commerce testi",
      icon: <TextFieldsIcon />,
      path: "/admin/customize/texts"
    },
    {
      title: "Personalizzazione Nome Shop",
      icon: <StoreIcon />,
      path: "/admin/customize/shop-name"
    },
    {
      title: "Personalizzazione Social Media",
      icon: <ShareIcon />,
      path: "/admin/customize/socials"
    }
  ];

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <MetaData title="Personalizza Sito - Admin Panel" />
      <div className="customize-dashboard">
        <div className="customize-first-box">
          <Sidebar />
        </div>

        <div className="customize-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <Typography variant="h4" className="customize-title">
            Personalizzazione Sito
          </Typography>

          <div className="customize-cards">
            {customizeOptions.map((option, index) => (
              <Link 
                to={option.path} 
                key={index} 
                style={{ textDecoration: "none" }}
              >
                <div className="customize-card">
                  <div className="customize-card-icon">
                    {option.icon}
                  </div>
                  <div className="customize-card-title">
                    {option.title}
                  </div>
                  <div className="customize-card-description">
                    {option.title === "Personalizzazione E-commerce immagini" && 
                      "Gestisci logo, banner e immagini del tuo e-commerce"}
                    {option.title === "Personalizzazione E-commerce testi" && 
                      "Personalizza testi, descrizioni e contenuti del sito"}
                    {option.title === "Personalizzazione stripe per pagamenti utente" && 
                      "Configura le opzioni di pagamento e checkout dei tuoi prodotti"}
                    {option.title === "Personalizzazione Email e WhatsApp" && 
                      "Configura i servizi  whats-app ed Email per il tuo negozio"}
                    {option.title === "Personalizzazione Nome Shop" && 
                      "Personalizza il nome del tuo shop in tutto il sito"}
                    {option.title === "Personalizzazione Social Media" && 
                      "Gestisci i link e la visibilità dei social media nel footer"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeSite;
