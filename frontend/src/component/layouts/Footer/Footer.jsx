import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getShopName, getSocialMedia } from "../../../actions/siteAction";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { SiTiktok } from 'react-icons/si';

import "./Footer.css";
const footMenu = [
  {
    id: 1,
    title: "Aiuto",
    menu: [
      {
        id: 1,
        link: "Stato ordine",
        path: "/orders",
      },
      {
        id: 2,
        link: "FAQs",
        path: "/terms/conditions",
      },

      {
        id: 3,
        link: "Cancel Order",
        path: "/policy/return",
      },
      {
        id: 4,
        link: "Return Order",
        path: "/policy/return",
      },
      {
        id: 5,
        link: "Termini",
        path: "/policy/Terms",
      },
    ],
  },
  {
    id: 2,
    title: "Politiche",
    menu: [
      {
        id: 1,
        link: "Ritorna alle Policy",
        path: "/policy/return",
      },
      {
        id: 2,
        link: "Sicurezza",
        path: "/policy/privacy",
      },
      {
        id: 3,
        link: "Informazioni",
        path: "/policy/Terms",
      },
      {
        id: 4,
        link: "Privacy Policy",
        path: "/policy/privacy",
      },
      {
        id: 5,
        link: "T&C",
        path: "/terms/conditions",
      },
    ],
  }

];

const socialIcons = {
  facebook: <FacebookIcon className="facebook_icon" fontSize="large" />,
  instagram: <InstagramIcon className="insta_icon" fontSize="large" />,
  linkedin: <LinkedInIcon className="linkedin_icon" fontSize="large" />,
  tiktok: <SiTiktok className="tiktok_icon" fontSize="large" />
};



const Footer = () => {
  const [subValue, setSubValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubValue("");
    alert("Thankyou, you are subscribed to receive our daily newsletter");
  };

  const dispatch = useDispatch();
  const { shopName } = useSelector((state) => state.shopName);
  const currYear = new Date().getFullYear();

  useEffect(() => {
    dispatch(getShopName());
    dispatch(getSocialMedia());
  }, [dispatch]);

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="wrapper_footer footer_wrapper ">
            <div className="foot_about foot1">
              <div className="foot_logo">
              </div>
            </div>
            <div className="foot_links">
              <div className="foot_dowload_appLink">
                <h5>Seguici sui Social</h5>
              </div>
              <div className="foot_social">
                {Object.entries(useSelector((state) => state.socialMedia?.socialMedia || {}))
                  .filter(([_, data]) => data.isActive)
                  .map(([platform, data]) => (
                    <a
                      href={data.link}
                      key={platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Seguici su ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                    >
                      {socialIcons[platform]}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="separatorFooter"></div>

        <div className="sub_footer_root">
          <div className="container_Footer">
            <div className="sub_footer_wrapper">
              <div className="foot_policyLink">
                <ul>
                  <li className="subfoot_link_text1">
                    <Link to="/policy/privacy">
                      <p className="foot_policyLink_p">PRIVACY POLICY</p>
                    </Link>
                  </li>
                  <li className="subfoot_link_text2">
                    <Link to="/terms/conditions">
                      <p className="foot_policyLink_p">TERMINI & CONDIZIONI</p>
                    </Link>
                  </li>
                  <li className="subfoot_link_text3">
                    <Link to="/policy/Terms">
                      <p className="foot_policyLink_p">TERMINI DI UTILIZZO</p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="foot_copyright">
                <p>
                Copyright &copy;{currYear} {shopName}| All Rights Reserved. 
                  <span>
                    <a href="https://neaweb.netlify.app/"> | Built by NEA </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
