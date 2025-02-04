import React, { useEffect, useRef, useState } from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Modal, Avatar } from "@material-ui/core";
import { AccountCircle as AccountCircleIcon } from "@material-ui/icons";
import { PersonAdd as PersonAddIcon } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./ProfileModel.css";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/userAction";

const ProfileModal = ({ user, isAuthenticated }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const createdAt = (user) => {
   const createdAt = new Date(user.createdAt);
   const options = {
     year: "numeric",
     month: "2-digit",
     day: "2-digit",
     hour: "2-digit",
     minute: "2-digit",
     hour12: true,
     timeZone: "Asia/Kolkata",
   };

   const formatter = new Intl.DateTimeFormat("en-IN", options);
   const formattedDate = formatter.format(createdAt);
   return formattedDate;
 };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleOpen = (event) => {
    event.stopPropagation();
    setIsOpen((prevState) => !prevState);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  function dashboardHandler() {
     setIsOpen(false);
    history.push("/admin/dashboard");
  }

  function accountHandler() {
     setIsOpen(false);
    history.push("/account");
  }

  function ordersHandler() {
     setIsOpen(false);
    history.push("/orders");
  }
  function newUserHandler() {
     setIsOpen(false);
    history.push("/signup");
  }

  function logoutUserHandler() {
     setIsOpen(false);
     dispatch(logout());
    alert.success("Disconnessione riuscita");
  }

  function cartHandler() {
      setIsOpen(false);

    history.push("/cart");
  }

  function loginHandler() {
      setIsOpen(false);
      
    history.push("/login");
  }

  return (
    <>
      <div className="profile-icon" onClick={handleOpen}>
        <PersonIcon
          className={`icon smaller ${isOpen ? "active" : ""}`}
          fontSize="large"
        />
        {isOpen ? (
          <ArrowDropUpIcon className="arrow-icon" />
        ) : (
          <ArrowDropDownIcon className="arrow-icon" />
        )}
      </div>
      {isOpen && (
        <Modal open={isOpen} onClose={onClose} className="modal-container">
          <div className="modal-content" ref={modalRef}>
            {!isAuthenticated ? (
              <div className="welcome-message">
                <strong>Benvenuto!</strong>
                <p>Per accedere al tuo account e gestire gli ordini, effettua il login.</p>
              </div>
            ) : (
              <>
                <div className="profile-info">
                  <Avatar
                    src={user.avatar.url}
                    alt="User Avatar"
                    className="avatar"
                    style={{ width: "68px", height: "68px" }}
                  />
                  <p className="user-id">
                    <strong>ID :</strong> {user._id.substring(0, 8)}
                  </p>

                  <p className="user-name">
                    <strong>Nome :</strong> {user.name}
                  </p>

                  <p className="user-email">
                    <strong>Email :</strong> {user.email}
                  </p>

                  <p className="created-at">
                    <strong>Iscritto a:</strong> {createdAt(user)}
                  </p>
                </div>
              </>
            )}
            <div className="divider" />
            <div className="profile-menu">
              {user && user.role ==="admin" && (
                <div className="menu-item" onClick={dashboardHandler}>
                  <DashboardIcon className="menu-icon" />
                  <span>Dashboard</span>
                </div>
              )}
              <div className="menu-item" onClick={accountHandler}>
                <AccountCircleIcon className="menu-icon" />
                <span>Profilo</span>
              </div>
              <div className="menu-item" onClick={ordersHandler}>
                <AssignmentIcon className="menu-icon" />
                <span>Ordini</span>
              </div>
              <div className="menu-item" onClick={cartHandler}>
                <ShoppingCartIcon className="menu-icon" />
                <span>Carello</span>
              </div>

              {!isAuthenticated ? (
                <>
                <div className="menu-item" onClick={newUserHandler}>
                  <PersonAddIcon className="menu-icon" />
                  <span>Registrati</span>
                </div>
                <div className="menu-item" onClick={loginHandler}>
                  <LockOpenIcon className="menu-icon" />
                  <span>Accedi</span>
                </div>
                </>
              ) : (
                <div className="menu-item" onClick={logoutUserHandler}>
                  <ExitToAppIcon className="menu-icon" />
                  <span>Disconnettersi</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
