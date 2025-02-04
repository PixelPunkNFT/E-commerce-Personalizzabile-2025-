import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getWhatsAppNumber, updateWhatsAppNumber, clearErrors as clearWhatsAppErrors } from "../../actions/whatsAppAction";
import { getSmtpConfig, updateSmtpConfig, clearErrors as clearSmtpErrors } from "../../actions/smtpAction";
import { UPDATE_WHATSAPP_RESET } from "../../constants/whatsAppConstant";
import { UPDATE_SMTP_CONFIG_RESET } from "../../constants/smtpConstant";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import "./CustomizePayments.css";

function CustomizeWhatsApp() {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  
  // SMTP states
  const [smtpData, setSmtpData] = useState({
    host: "",
    port: "",
    secure: true,
    user: "",
    pass: "",
    from: ""
  });
  const [isEditingSmtp, setIsEditingSmtp] = useState(false);

  const { whatsApp, loading, error: whatsAppError } = useSelector((state) => state.whatsApp);
  const { isUpdated: whatsAppUpdated, error: whatsAppUpdateError } = useSelector((state) => state.updateWhatsApp);
  
  const { smtp, error: smtpError } = useSelector((state) => state.smtp);
  const { success: smtpUpdated, error: smtpUpdateError } = useSelector((state) => state.updateSmtp);

  useEffect(() => {
    dispatch(getWhatsAppNumber());
    dispatch(getSmtpConfig());
  }, [dispatch]);

  // Carica i dati WhatsApp
  useEffect(() => {
    if (whatsApp && whatsApp.phoneNumber && !isEditing) {
      setPhoneNumber(whatsApp.phoneNumber || "");
    }
  }, [whatsApp, isEditing]);

  useEffect(() => {
    if (whatsAppError) {
      setMessage({ type: "error", content: whatsAppError });
      dispatch(clearWhatsAppErrors());
    }

    if (whatsAppUpdateError) {
      setMessage({ type: "error", content: whatsAppUpdateError });
      dispatch(clearWhatsAppErrors());
    }

    if (whatsAppUpdated) {
      setMessage({ type: "success", content: "Numero WhatsApp aggiornato con successo" });
      setIsEditing(false);
      dispatch({ type: UPDATE_WHATSAPP_RESET });
      dispatch(getWhatsAppNumber());
    }
  }, [dispatch, whatsAppError, whatsAppUpdateError, whatsAppUpdated]);

  useEffect(() => {
    if (smtp && !isEditingSmtp) {
      const smtpConfig = smtp;
      setSmtpData({
        host: smtpConfig.host || "",
        port: smtpConfig.port || "",
        secure: smtpConfig.secure !== undefined ? smtpConfig.secure : true,
        user: smtpConfig.user || "",
        pass: smtpConfig.pass || "",
        from: smtpConfig.from || ""
      });
    }

    if (smtpError) {
      setMessage({ type: "error", content: smtpError });
      dispatch(clearSmtpErrors());
    }

    if (smtpUpdateError) {
      setMessage({ type: "error", content: smtpUpdateError });
      dispatch(clearSmtpErrors());
    }

    if (smtpUpdated) {
      setMessage({ type: "success", content: "Configurazione SMTP aggiornata con successo" });
      setIsEditingSmtp(false);
      dispatch({ type: UPDATE_SMTP_CONFIG_RESET });
      dispatch(getSmtpConfig());
    }
  }, [dispatch, smtp, smtpError, smtpUpdateError, smtpUpdated, isEditingSmtp]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: "", content: "" });
  };

  const handleEditSmtp = () => {
    setIsEditingSmtp(true);
    setMessage({ type: "", content: "" });
  };

  const handleSave = () => {
    if (!phoneNumber.trim()) {
      setMessage({ type: "error", content: "Il numero di telefono non può essere vuoto" });
      return;
    }
    dispatch(updateWhatsAppNumber({ phoneNumber }));
  };

  const handleSaveSmtp = () => {
    // Se la porta è 587, imposta secure a false automaticamente
    const updatedSmtpData = {
      ...smtpData,
      secure: smtpData.port === "587" ? false : smtpData.secure
    };
    dispatch(updateSmtpConfig(updatedSmtpData));
  };

  const handleSmtpChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "port") {
      // Se la porta viene cambiata a 587, imposta automaticamente secure a false
      setSmtpData(prev => ({
        ...prev,
        [name]: value,
        secure: value === "587" ? false : prev.secure
      }));
    } else {
      setSmtpData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  return (
    <>
      <MetaData title="Personalizza WhatsApp - Admin Panel" />
      <div className="customize-payments">
        <div className="customize-payments-first-box">
          <Sidebar />
        </div>

        <div className="customize-payments-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <Typography variant="h4" style={{ margin: "20px 0" }}>
            Personalizza Numero WhatsApp e Email SMTP
          </Typography>

          {message.content && (
            <Alert 
              severity={message.type} 
              onClose={() => setMessage({ type: '', content: '' })}
              style={{ marginBottom: "20px" }}
            >
              {message.content}
            </Alert>
          )}

          <div className="customize-payments-content" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {loading ? (
              <Typography>Caricamento...</Typography>
            ) : (
              <>
                {/* Sezione WhatsApp */}
                <div>
                  <Typography variant="h6" style={{ marginBottom: "20px" }}>
                    Numero WhatsApp per Assistenza Clienti
                  </Typography>

                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <TextField
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        label="Numero di telefono"
                        variant="outlined"
                        placeholder="+39XXXXXXXXXX"
                        fullWidth
                        style={{ marginBottom: "20px" }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        style={{ marginBottom: "20px" }}
                      >
                        Salva
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Typography variant="body1" style={{ flex: 1 }}>
                        {phoneNumber}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleEdit}
                      >
                        Modifica
                      </Button>
                    </div>
                  )}

                  <Typography variant="body2" color="textSecondary" style={{ marginTop: "20px" }}>
                    Questo numero verrà utilizzato per la chat WhatsApp di assistenza clienti.
                    Assicurati di inserire il numero con il prefisso internazionale (es. +39 per l'Italia).
                  </Typography>
                </div>

                {/* SMTP Configuration Section */}
                <div>
                  <Typography variant="h6" style={{ marginBottom: "20px" }}>
                    Configurazione SMTP per Email
                  </Typography>

                  {isEditingSmtp ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <TextField
                    name="host"
                    value={smtpData.host}
                    onChange={handleSmtpChange}
                    label="Host SMTP"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    name="port"
                    value={smtpData.port}
                    onChange={handleSmtpChange}
                    label="Porta SMTP"
                    variant="outlined"
                    type="number"
                    fullWidth
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="checkbox"
                        name="secure"
                        checked={smtpData.secure}
                        onChange={handleSmtpChange}
                      />
                      <Typography>Usa connessione sicura (SSL/TLS)</Typography>
                    </div>
          
                  </div>
                  <TextField
                    name="user"
                    value={smtpData.user}
                    onChange={handleSmtpChange}
                    label="Username SMTP"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    name="pass"
                    value={smtpData.pass}
                    onChange={handleSmtpChange}
                    label="Password SMTP"
                    variant="outlined"
                    type="password"
                    fullWidth
                  />
                  <TextField
                    name="from"
                    value={smtpData.from}
                    onChange={handleSmtpChange}
                    label="Email mittente"
                    variant="outlined"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveSmtp}
                  >
                    Salva Configurazione SMTP
                  </Button>
                </div>
                  ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Typography><strong>Host:</strong> {smtpData.host}</Typography>
                  <Typography><strong>Porta:</strong> {smtpData.port}</Typography>
                  <Typography><strong>Connessione sicura:</strong> {smtpData.secure ? "Sì" : "No"}</Typography>
                  <Typography><strong>Username:</strong> {smtpData.user}</Typography>
                  <Typography><strong>Email mittente:</strong> {smtpData.from}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEditSmtp}
                    style={{ marginTop: "10px" }}
                  >
                    Modifica Configurazione SMTP
                  </Button>
                </div>
              )}

                  <div style={{ 
                marginTop: "30px", 
                padding: "20px", 
                backgroundColor: "#f5f5f5", 
                borderRadius: "10px",
                border: "1px solid #e0e0e0" 
              }}>
                <Typography variant="h6" style={{ marginBottom: "15px", color: "#1a237e" }}>
                  📧 Guida alla Configurazione Email SMTP con Gmail
                </Typography>

                <div style={{ marginBottom: "20px" }}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", marginBottom: "10px", color: "#2196f3" }}>
                    Passo 1: Impostazioni SMTP per Gmail
                  </Typography>
                  <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px", marginBottom: "10px" }}>
                    <Typography>• Host: <strong>smtp.gmail.com</strong></Typography>
                    <Typography>• Porta: <strong>587</strong></Typography>
                    <Typography>• SSL/TLS: <strong>Disattivato</strong> (importante per la porta 587)</Typography>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", marginBottom: "10px", color: "#2196f3" }}>
                    Passo 2: Preparare il tuo Account Google
                  </Typography>
                  <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px", marginBottom: "10px" }}>
                    <Typography style={{ marginBottom: "10px" }}>
                      1. Vai su <strong>Google Account</strong> → <strong>Sicurezza</strong>
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      2. Attiva la <strong>Verifica in due passaggi</strong> se non è già attiva
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      3. Cerca <strong>"Password per le app"</strong> nella sezione sicurezza
                    </Typography>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", marginBottom: "10px", color: "#2196f3" }}>
                    Passo 3: Generare la Password per l'App
                  </Typography>
                  <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px", marginBottom: "10px" }}>
                    <Typography style={{ marginBottom: "10px" }}>
                      1. In "Password per le app", seleziona <strong>"Altra"</strong> dal menu a tendina
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      2. Dai un nome all'app (es. "SMTP E-commerce")
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      3. Clicca su <strong>"Genera"</strong>
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      4. Google mostrerà una password di 16 caratteri - <strong>Questa è la tua password SMTP</strong>
                    </Typography>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", marginBottom: "10px", color: "#2196f3" }}>
                    Passo 4: Configurazione Finale
                  </Typography>
                  <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px" }}>
                    <Typography style={{ marginBottom: "10px" }}>
                      • Username SMTP: <strong>Il tuo indirizzo Gmail completo</strong>
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      • Password SMTP: <strong>La password di 16 caratteri generata</strong>
                    </Typography>
                    <Typography style={{ marginBottom: "10px" }}>
                      • Email mittente: <strong>Il tuo indirizzo Gmail</strong>
                    </Typography>
                  </div>
                </div>

                <Typography variant="body2" style={{ 
                  backgroundColor: "#e3f2fd", 
                  padding: "10px", 
                  borderRadius: "5px",
                  marginTop: "15px"
                }}>
                  ⚠️ <strong>Importante:</strong> Non usare mai la password normale del tuo account Gmail. 
                  Usa sempre la "Password per le app" generata appositamente per questa configurazione.
                </Typography>
                </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeWhatsApp;
