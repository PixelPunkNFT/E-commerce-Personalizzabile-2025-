import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { saveStripeKeys, getStripeKeys, clearErrors } from "../../actions/stripeKeysAction";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import "./CustomizePayments.css";

function CustomizePayments() {
  const [toggle, setToggle] = React.useState(false);
  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, stripeKeys } = useSelector((state) => state.stripeKeys);

  useEffect(() => {
    dispatch(getStripeKeys());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearErrors());
      }, 3000);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (stripeKeys && stripeKeys.publishableKey) {
      setPublishableKey(stripeKeys.publishableKey);
    }
  }, [stripeKeys]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveStripeKeys(publishableKey, secretKey));
    setSecretKey(""); // Pulisci la chiave segreta dopo il salvataggio
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      <MetaData title="Personalizza Pagamenti - Admin Panel" />
      <div className="customize-payments">
        <div className="customize-payments-first-box">
          <Sidebar />
        </div>

        <div className="customize-payments-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <div className="customize-payments-content">
            <Typography variant="h4" className="customize-payments-title">
              Personalizzazione Pagamenti Stripe
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Chiave Pubblica Stripe"
                variant="outlined"
                value={publishableKey}
                onChange={(e) => setPublishableKey(e.target.value)}
                margin="normal"
                required
                helperText="La chiave publica per modalita test stripe inizia con 'pk_test' .  E per modalità reale 'pk_live'"
              />
              
              <TextField
                fullWidth
                label="Chiave Segreta Stripe"
                variant="outlined"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                margin="normal"
                required
                type="password"
                helperText="La chiave segreta per modalita test stripe inizia con 'sk_test' .  E per modalità reale 'sk_live' "
              />

              <Button 
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Salvataggio..." : "Salva Chiavi"}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {showSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Chiavi Stripe salvate con successo!
                </Alert>
              )}
            </Box>

            <Typography variant="body2" color="textSecondary" sx={{ mt: 4, lineHeight: 1.6 }}>
              <Box sx={{ mb: 2 }}>
                Queste chiavi sono necessarie per processare i pagamenti dei tuoi prodotti. 
                Puoi trovarle nel tuo dashboard Stripe sotto "Developers - API keys".
              </Box>
              
              <Box sx={{ mb: 3 }}>
                Segui questi passaggi per ottenerle:
                <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Accedi al tuo account Stripe su <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>https://dashboard.stripe.com</a>.</li>
                  <li>Nel menu a sinistra, clicca su "Developers".</li>
                  <li>Seleziona "API keys" dal sottomenu.</li>
                  <li>Troverai le tue chiavi pubbliche e segrete nella sezione "API keys".</li>
                </ol>
              </Box>

              <Box sx={{ mb: 3 }}>
                Una volta recuperate le chiavi, puoi usarle nel tuo codice:
                <Box sx={{ 
                  bgcolor: 'grey.100', 
                  p: 2, 
                  borderRadius: 1,
                  mt: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  {`// Chiave pubblica (client-side)
const stripe = Stripe('your-publishable-key-here');

// Chiave segreta (server-side)
const stripe = require('stripe')('your-secret-key-here');`}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" component="span" sx={{ color: 'warning.main', display: 'block', mb: 1 }}>
                  Attenzione:
                </Typography>
                Se stai utilizzando l'ambiente di <strong>test</strong> di Stripe, i pagamenti che effettuerai non saranno reali. 
                Puoi utilizzare l'<strong>API di test</strong> per simulare transazioni senza che venga effettivamente effettuato un pagamento.
              </Box>

              <Box sx={{ mb: 3 }}>
                Quando sei pronto per accettare pagamenti reali, passa da <strong>Test</strong> a <strong>Live</strong> nel tuo dashboard Stripe. 
                In modalità <strong>Live</strong>, le transazioni saranno effettivamente processate e gli importi verranno addebitati.
              </Box>

              <Box>
                Assicurati di utilizzare le API giuste in base all'ambiente in cui ti trovi:
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li><strong>API di test</strong>: Utilizza le chiavi API visibili nella sezione "Test data" nel dashboard.</li>
                  <li><strong>API live</strong>: Usa le chiavi API nella sezione "Live data" per effettuare pagamenti reali.</li>
                </ul>
              </Box>
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizePayments;
