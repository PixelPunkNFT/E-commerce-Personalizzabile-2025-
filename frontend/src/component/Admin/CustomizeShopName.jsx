import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { getShopName, updateShopName, clearErrors } from "../../actions/siteAction";
import { UPDATE_SHOP_NAME_RESET } from "../../constants/siteConstant";
import "./CustomizePayments.css";

const CustomizeShopName = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const { shopName, loading, error, success } = useSelector((state) => state.shopName);

  useEffect(() => {
    dispatch(getShopName());
  }, [dispatch]);

  useEffect(() => {
    if (shopName && !isEditing) {
      setName(shopName);
    } else if (!shopName && !isEditing) {
      setName('');
    }
  }, [shopName, isEditing]);

  useEffect(() => {
    if (error) {
      if (error.includes('non autorizzato') || 
          error.includes('unauthorized') || 
          error.includes('Token') || 
          error.includes('login') ||
          error.includes('amministratori')) {
        setMessage({ type: 'error', content: 'Accesso non autorizzato. Verrai reindirizzato alla pagina di login.' });
        setTimeout(() => {
          history.push('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', content: error });
      }
      dispatch(clearErrors());
    }
  }, [error, dispatch, history]);

  useEffect(() => {
    if (success) {
      setMessage({ type: 'success', content: 'Nome dello shop aggiornato con successo' });
      setIsEditing(false);
      dispatch({ type: UPDATE_SHOP_NAME_RESET });
    }
  }, [success, dispatch]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', content: '' });
  };

  const handleSave = () => {
    dispatch(updateShopName(name));
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader />
    </div>;
  }

  return (
    <>
      <MetaData title="Personalizza Nome Shop - Admin Panel" />
      <div className="customize-payments">
        <div className="customize-payments-first-box">
          <Sidebar />
        </div>

        <div className="customize-payments-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <Typography variant="h4" style={{ margin: "20px 0" }}>
            Personalizza Nome Shop
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

          <div className="customize-payments-content">
            <Typography variant="h6" style={{ marginBottom: "20px" }}>
              Nome dello Shop
            </Typography>

            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Nome dello shop"
                  variant="outlined"
                  placeholder="Inserisci il nome dello shop"
                  fullWidth
                  style={{ marginBottom: "20px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading}
                  style={{ marginBottom: "20px" }}
                >
                  Salva
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Typography variant="body1" style={{ flex: 1 }}>
                  {name}
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
              Questo nome verrà visualizzato nel footer, nell'header e nel titolo della pagina.
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeShopName;
