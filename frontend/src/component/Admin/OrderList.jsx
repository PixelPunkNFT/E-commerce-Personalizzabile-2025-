import React, { useState, useEffect } from "react";
import "./OrderList.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders, clearErrors, deleteOrder } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";

function OrderList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { error, loading, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateOrder
  );

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Ordine eliminato con successo");
      dispatch({ type: DELETE_ORDER_RESET });
      setSelectedOrder(null);
    }
    dispatch(getAllOrders());
  }, [dispatch, error, alert, isDeleted, deleteError]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`ALL Orders - Admin`} />

          <div className="order-list" style={{ marginTop: 0 }}>
            <div className={!toggle ? "listSidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="list-table">
              <Navbar toggleHandler={toggleHandler} />
              <div className="productListContainer">
                <h4 id="productListHeading">TUTTI GLI ORDINI</h4>

                <div className="orders-container">
                  {/* Lista ordini a sinistra */}
                  <div className="orders-list">
                    {orders && orders.map((order) => (
                      <div
                        key={order._id}
                        className={`order-item ${selectedOrder?._id === order._id ? 'selected' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="order-info">
                          <h3>Ordine #{order._id}</h3>
                          <p>€{order.totalPrice}</p>
                          <span className={`order-status ${order.orderStatus}`}>
                            {order.orderStatus === "Delivered" ? "Consegnato" : "In Elaborazione"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dettagli ordine a destra */}
                  <div className="order-details">
                    {selectedOrder ? (
                      <>
                        <div className="order-details-header">
                          <h2>Ordine #{selectedOrder._id}</h2>
                          <div>
                            <Link to={`/admin/order/${selectedOrder._id}`}>
                              <EditIcon className="icon-" />
                            </Link>
                            <DeleteIcon
                              className="iconbtn"
                              onClick={() => deleteOrderHandler(selectedOrder._id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <div className="order-details-content">
                          <div className="order-field">
                            <label>Stato</label>
                            <span className={`order-status ${selectedOrder.orderStatus}`}>
                              {selectedOrder.orderStatus === "Delivered" ? "Consegnato" : "In Elaborazione"}
                            </span>
                          </div>
                          <div className="order-field">
                            <label>Codice Spedizione</label>
                            <p>{selectedOrder.shippingCode || "-"}</p>
                          </div>
                          <div className="order-field">
                            <label>Prodotti</label>
                            <p>{selectedOrder.orderItems.length} prodotti</p>
                          </div>
                          <div className="order-field">
                            <label>Prezzo Totale</label>
                            <p>€{selectedOrder.totalPrice}</p>
                          </div>
                          <div className="order-field">
                            <label>Indirizzo di Spedizione</label>
                            <p>
                              {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.pinCode}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="no-order-selected">
                        Seleziona un ordine per vedere i dettagli
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderList;
