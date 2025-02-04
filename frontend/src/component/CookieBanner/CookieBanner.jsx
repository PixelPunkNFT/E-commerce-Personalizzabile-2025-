import React from 'react';
import { useDispatch } from 'react-redux';
import './CookieBanner.css';
import { acceptCookies, rejectCookies } from '../../actions/siteAction';

const CookieBanner = () => {
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(acceptCookies());
  };

  const handleReject = () => {
    dispatch(rejectCookies());
  };

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <h3>Informativa sui Cookie</h3>
        <p>
          Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. 
          I cookie sono necessari per il corretto funzionamento del sito e per 
          analizzare come viene utilizzato. Il tuo consenso verrà memorizzato per 12 mesi.
        </p>
        <div className="cookie-buttons">
          <button onClick={handleAccept} className="accept-button">
            Accetta tutti
          </button>
          <button onClick={handleReject} className="reject-button">
            Rifiuta
          </button>
        </div>
        <div className="cookie-links">
          <a href="/policy/privacy" className="cookie-link">Privacy Policy</a>
          <span className="cookie-link-separator">|</span>
          <a href="/terms/conditions" className="cookie-link">Termini e Condizioni</a>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
