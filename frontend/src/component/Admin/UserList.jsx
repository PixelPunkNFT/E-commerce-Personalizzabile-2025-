import React, { useState, useEffect } from "react";
import "./UserList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import Loader from "../layouts/loader/Loader";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstanat";
import { useHistory } from "react-router-dom";

function UserList() {
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profileData
  );
  const alert = useAlert();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
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
      alert.success(message);
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
      setSelectedUser(null);
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, history, isDeleted, message]);

  // togle handler =>
  const toggleHandler = () => {
    setToggle(!toggle);
  };

  // to close the sidebar when the screen size is greater than 1000px
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
          <MetaData title={`ALL Users - Admin`} />

          <div className="user-list" style={{ marginTop: 0 }}>
            <div className={!toggle ? "listSidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="list-table">
              <Navbar toggleHandler={toggleHandler} />
              <div className="productListContainer">
                <h4 id="productListHeading">TUTTI GLI UTENTI</h4>
                
                <div className="users-container">
                  {/* Lista utenti a sinistra */}
                  <div className="users-list">
                    {users && users.map((user) => (
                      <div 
                        key={user._id}
                        className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <h3>{user.name}</h3>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dettagli utente a destra */}
                  <div className="user-details">
                    {selectedUser ? (
                      <>
                        <div className="user-details-header">
                          <h2>{selectedUser.name}</h2>
                          <div>
                            <Link to={`/admin/user/${selectedUser._id}`}>
                              <EditIcon className="icon-" />
                            </Link>
                            <DeleteIcon 
                              className="iconbtn" 
                              onClick={() => deleteUserHandler(selectedUser._id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                        <div className="user-details-content">
                          <div className="user-field">
                            <label>Email</label>
                            <p>{selectedUser.email}</p>
                          </div>
                          <div className="user-field">
                            <label>Ruolo</label>
                            <span className={`user-role ${selectedUser.role}`}>
                              {selectedUser.role === 'admin' ? 'Amministratore' : 'Utente'}
                            </span>
                          </div>
                          <div className="user-field">
                            <label>ID Utente</label>
                            <p>{selectedUser._id}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="no-user-selected">
                        Seleziona un utente per vedere i dettagli
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

export default UserList;
