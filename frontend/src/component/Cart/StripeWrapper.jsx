import React, { useState, useEffect } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Payment from './Payment';

const StripeWrapper = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStripeKey = async () => {
      try {
        // Otteniamo il carrello dal localStorage
        const cartItems = localStorage.getItem("cartItem") 
          ? JSON.parse(localStorage.getItem("cartItem")) 
          : [];

        if (cartItems.length > 0) {
          const { data } = await axios.get(
            `/api/v1/payment/stripeapikey?productId=${cartItems[0].productId}`,
            { withCredentials: true }
          );

          const stripe = await loadStripe(data.stripeApiKey);
          setStripePromise(stripe);
        }
      } catch (err) {
        setError("Errore nel caricamento delle chiavi di pagamento");
      }
    };

    getStripeKey();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!stripePromise) {
    return <div>Caricamento...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
};

export default StripeWrapper;
