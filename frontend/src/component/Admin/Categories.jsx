import React, { useEffect, useState } from 'react';
import './Categories.css';
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { useAlert } from "react-alert";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [toggle, setToggle] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
      alert.error("Errore nel caricamento delle categorie");
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert.error("Il nome della categoria è obbligatorio");
      return;
    }

    try {
      const response = await fetch('/api/v1/categories/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await response.json();
      if (data.message === 'Categoria aggiunta') {
        fetchCategories(); // Ricarica le categorie dopo la creazione
        setNewCategoryName('');
        alert.success("Categoria creata con successo");
      } else {
        alert.error(data.message || "Errore nella creazione della categoria");
      }
    } catch (error) {
      console.error("Errore nella creazione:", error);
      alert.error("Errore nella creazione della categoria");
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.message === 'Categoria cancellata con successo') {
        fetchCategories(); // Ricarica le categorie dopo l'eliminazione
        alert.success("Categoria eliminata con successo");
      } else {
        alert.error(data.message || "Errore nell'eliminazione della categoria");
      }
    } catch (error) {
      console.error("Errore nell'eliminazione:", error);
      alert.error("Errore nell'eliminazione della categoria");
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setNewName(category.name);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert.error("Il nome della categoria è obbligatorio");
      return;
    }

    try {
      const response = await fetch(`/api/v1/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();
      if (data.message === 'Categoria aggiornata con successo') {
        fetchCategories(); // Ricarica le categorie dopo l'aggiornamento
        setEditingId(null);
        setNewName('');
        alert.success("Categoria aggiornata con successo");
      } else {
        alert.error(data.message || "Errore nell'aggiornamento della categoria");
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
      alert.error("Errore nell'aggiornamento della categoria");
    }
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  return (
    <div className="categories-page">
      <div className={!toggle ? "process-order__sidebar" : "toggleBox"}>
        <Sidebar />
      </div>

      <div className="categories-main">
        <Navbar toggleHandler={toggleHandler} />
        
        <div className="categories-content">
          <div className="categories-header">
            <h1 className="categories-title">Gestione Categorie</h1>
          </div>

          <form onSubmit={createCategory} className="categories-add">
            <input
              type="text"
              className="categories-input"
              placeholder="Nuova categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="submit" className="categories-button">
              <AddIcon /> Aggiungi
            </button>
          </form>

          {editingId && (
            <form onSubmit={handleEdit} className="edit-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="categories-input"
                placeholder="Modifica nome categoria"
              />
              <button type="submit" className="categories-button categories-button--edit">
                Salva
              </button>
            </form>
          )}

          <div className="categories-list">
            {categories.map(category => (
              <div key={category._id} className="category-item">
                <span className="category-name">{category.name}</span>
                <div className="category-actions">
                  {!editingId && (
                    <>
                      <button 
                        onClick={() => startEditing(category)} 
                        className="categories-button categories-button--edit"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        onClick={() => deleteCategory(category._id)} 
                        className="categories-button categories-button--delete"
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

export default CategoriesList;
