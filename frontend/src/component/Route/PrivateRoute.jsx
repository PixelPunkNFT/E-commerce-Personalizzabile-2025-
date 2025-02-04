import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { load_UserProfile } from "../../actions/userAction";
import ShopLoader from "../layouts/loader/Loader";
import axios from "axios";
function PrivateRoute({ isAdmin, component: Component, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    dispatch(load_UserProfile());
  }, [dispatch]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (isAdmin && user && user.role === "admin") {
        try {
          // Verifica se siamo appena tornati dal pagamento
          const urlParams = new URLSearchParams(window.location.search);
          const success = urlParams.get('success');
          
          if (success === 'true') {
            // Rimuovi i parametri dall'URL senza ricaricare la pagina
            window.history.replaceState({}, '', window.location.pathname);
            setCheckingSubscription(false);
            return;
          }

          const response = await axios.get("/api/v1/check-subscription");
          if (response.data.status === "valid") {
            setSubscriptionStatus("valid");
            // Se l'abbonamento è valido, salva i dettagli nel localStorage
            localStorage.setItem('subscriptionDetails', JSON.stringify(response.data.subscription));
          } else {
            setSubscriptionStatus("invalid");
            localStorage.removeItem('subscriptionDetails');
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 403 || error.response.status === 402) {
              setSubscriptionStatus("invalid");
              localStorage.removeItem('subscriptionDetails');
            } else {
              console.error('Errore durante la verifica dell\'abbonamento:', error.response.data);
              setSubscriptionStatus("error");
            }
          } else {
            console.error('Errore di rete:', error);
            setSubscriptionStatus("error");
          }
        }
      }
      setCheckingSubscription(false);
    };

    if (user) {
      checkSubscription();
    }
  }, [user, isAdmin]);

  // Pulisci i parametri dell'URL quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (window.location.search) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
  }, []);

  if (loading || (isAdmin && checkingSubscription)) {
    return <ShopLoader />; 
  }

  // If the user data failed to load or the user is not authenticated, redirect to the login page
  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  // If isAdmin is true and the user is not an admin, redirect to the login page
  if (isAdmin && user.role !== "admin") {
    return <Redirect to="/login" />;
  }

  // Se siamo appena tornati dal pagamento con successo, attendiamo la verifica
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  if (success === 'true' && checkingSubscription) {
    return <ShopLoader />;
  }

  // Gestione degli stati dell'abbonamento
  if (isAdmin) {
    if (subscriptionStatus === "invalid") {
      return <Redirect to="/admin/abbonamento" />;
    } else if (subscriptionStatus === "error") {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>Errore durante la verifica dell'abbonamento</div>
          <button onClick={() => window.location.reload()} style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Riprova
          </button>
        </div>
      );
    }
  }

  // If the user is authenticated and all checks are passed, render the specified component
  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default PrivateRoute;
