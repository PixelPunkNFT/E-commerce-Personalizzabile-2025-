import React, { useEffect, useState } from 'react';
import './Sizes.css';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { getAllSizes, createSize, updateSize, deleteSize, clearErrors } from '../../actions/sizeAction';
import { NEW_SIZE_RESET, UPDATE_SIZE_RESET, DELETE_SIZE_RESET } from '../../constants/sizeConstant';
import { useAlert } from 'react-alert';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

function Sizes() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newSizeName, setNewSizeName] = useState('');
  const [toggle, setToggle] = useState(false);

  const { loading, error, sizes } = useSelector((state) => state.sizes);
  const { success: createSuccess, error: createError } = useSelector((state) => state.newSize);
  const { isDeleted, isUpdated, error: updateError } = useSelector((state) => state.size);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (createError) {
      alert.error(createError);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (createSuccess) {
      alert.success('Taglia creata con successo');
      setNewSizeName('');
      dispatch({ type: NEW_SIZE_RESET });
    }

    if (isDeleted) {
      alert.success('Taglia eliminata con successo');
      dispatch({ type: DELETE_SIZE_RESET });
    }

    if (isUpdated) {
      alert.success('Taglia aggiornata con successo');
      setEditingId(null);
      setNewName('');
      dispatch({ type: UPDATE_SIZE_RESET });
    }

    dispatch(getAllSizes());
  }, [dispatch, alert, error, createSuccess, createError, isDeleted, isUpdated, updateError]);

  const handleCreateSize = (e) => {
    e.preventDefault();
    if (!newSizeName.trim()) {
      alert.error("Il nome della taglia è obbligatorio");
      return;
    }
    dispatch(createSize(newSizeName));
  };

  const handleDeleteSize = (id) => {
    dispatch(deleteSize(id));
  };

  const startEditing = (size) => {
    setEditingId(size._id);
    setNewName(size.name);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert.error("Il nome della taglia è obbligatorio");
      return;
    }
    dispatch(updateSize(editingId, { name: newName }));
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  return (
    <div className="sizes-page">
      <div className={!toggle ? "process-order__sidebar" : "toggleBox"}>
        <Sidebar />
      </div>

      <div className="sizes-main">
        <Navbar toggleHandler={toggleHandler} />
        
        <div className="sizes-content">
          <div className="sizes-header">
            <h1 className="sizes-title">Gestione Taglie</h1>
          </div>

          <form onSubmit={handleCreateSize} className="sizes-add">
            <input
              type="text"
              className="sizes-input"
              placeholder="Nuova taglia"
              value={newSizeName}
              onChange={(e) => setNewSizeName(e.target.value)}
            />
            <button type="submit" className="sizes-button">
              <AddIcon /> Aggiungi
            </button>
          </form>

          {editingId && (
            <form onSubmit={handleEdit} className="edit-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sizes-input"
                placeholder="Modifica nome taglia"
              />
              <button type="submit" className="sizes-button sizes-button--edit">
                Salva
              </button>
            </form>
          )}

          <div className="sizes-list">
            {sizes && sizes.map((size) => (
              <div key={size._id} className="size-item">
                <span className="size-name">{size.name}</span>
                <div className="size-actions">
                  {!editingId && (
                    <>
                      <button 
                        onClick={() => startEditing(size)} 
                        className="sizes-button sizes-button--edit"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        onClick={() => handleDeleteSize(size._id)} 
                        className="sizes-button sizes-button--delete"
                      >
                        <DeleteIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sizes;
