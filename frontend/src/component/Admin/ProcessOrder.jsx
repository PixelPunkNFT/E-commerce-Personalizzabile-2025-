import React, { useEffect, useState } from "react";
import "./ProcessOrder.css";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOrder,
  clearErrors,
  getOrderDetails,
} from "../../actions/orderAction";
import { Link, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";

function ProcessOrder() {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.deleteUpdateOrder
  );

  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams();
  const [status, setStatus] = useState("");
  const [shippingCode, setShippingCode] = useState("");
  const [toggle, setToggle] = useState(false);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Ordine aggiornato con successo");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getOrderDetails(params.id));
  }, [dispatch, alert, error, isUpdated, updateError, params.id]);

  useEffect(() => {
    if (order) {
      setShippingCode(order.shippingCode || "");
    }
  }, [order]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    try {
      if (status === "Shipped" && (!shippingCode || shippingCode.trim() === "")) {
        alert.error("Il codice di spedizione è obbligatorio per gli ordini spediti");
        return;
      }

      const orderData = {
        ...(status && { status }),
        ...(shippingCode && shippingCode.trim() !== "" && { shippingCode: shippingCode.trim() })
      };

      if (Object.keys(orderData).length === 0) {
        alert.error("Nessuna modifica da applicare");
        return;
      }

      dispatch(updateOrder(params.id, orderData));
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
      alert.error("Si è verificato un errore durante l'aggiornamento dell'ordine");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "process-order__status--delivered";
      case "Shipped":
        return "process-order__status--shipped";
      default:
        return "process-order__status--processing";
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Gestione Ordine" />
          <div className="process-order">
            <div className={!toggle ? "process-order__sidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="process-order__main">
              <Navbar toggleHandler={toggleHandler} />
              
              <div className="process-order__content">
                <div className="process-order__header">
                  <h1 className="process-order__title">Ordine #{params.id}</h1>
                  <span className={`process-order__status ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus === "Delivered" ? "Consegnato" : 
                     order.orderStatus === "Shipped" ? "Spedito" : "In Elaborazione"}
                  </span>
                </div>

                <div className="process-order__grid">
                  <div className="process-order__section">
                    <h2 className="process-order__section-title">Informazioni Cliente</h2>
                    <div className="process-order__field">
                      <span className="process-order__label">Nome</span>
                      <p className="process-order__value">{order.user && order.user.name}</p>
                    </div>
                    <div className="process-order__field">
                      <span className="process-order__label">Email</span>
                      <p className="process-order__value">{order.user && order.user.email}</p>
                    </div>
                    <div className="process-order__field">
                      <span className="process-order__label">Telefono</span>
                      <p className="process-order__value">{order.shippingInfo && order.shippingInfo.phoneNo}</p>
                    </div>
                  </div>

                  <div className="process-order__section">
                    <h2 className="process-order__section-title">Indirizzo di Spedizione</h2>
                    <div className="process-order__field">
                      <p className="process-order__value">
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="process-order__section">
                  <h2 className="process-order__section-title">Prodotti Ordinati</h2>
                  {order.orderItems && order.orderItems.map((item) => (
                    <div key={item.productId} className="process-order__field" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <img src={item.image} alt={item.name} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px'}} />
                      <div style={{flex: 1}}>
                        <Link to={`/product/${item.productId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                          <p className="process-order__value">{item.name}</p>
                        </Link>
                        <span className="process-order__label">Quantità: {item.quantity} × €{item.price}</span>
                      </div>
                      <p className="process-order__value">€{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="process-order__total">
                  <span className="process-order__total-label">Totale Ordine</span>
                  <span className="process-order__total-value">€{order.totalPrice}</span>
                </div>

                {order.orderStatus !== "Delivered" && (
                  <form className="process-order__form" onSubmit={updateOrderSubmitHandler}>
                    <h2 className="process-order__section-title">Aggiorna Stato</h2>
                    
                    <select 
                      className="process-order__select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Seleziona stato</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Spedito</option>
                      )}
                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Consegnato</option>
                      )}
                    </select>

                    <input
                      type="text"
                      className="process-order__input"
                      placeholder="Codice di spedizione"
                      value={shippingCode}
                      onChange={(e) => setShippingCode(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="process-order__button"
                      disabled={loading || (status === "" && shippingCode === order.shippingCode)}
                    >
                      Aggiorna Ordine
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProcessOrder;
