import React, { useEffect, useState, useRef } from "react";
import "./NewProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import { createProduct, clearErrors } from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CollectionsIcon from "@mui/icons-material/Collections";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import Navbar from "./Navbar";

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const fileInputRef = useRef();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sizeStock, setSizeStock] = useState([]);

  const { loading, error, success } = useSelector((state) => state.addNewProduct);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await fetch('/api/v1/categories');
        const catData = await catResponse.json();
        setCategories(catData.map(cat => cat.name));

        const sizeResponse = await fetch('/api/v1/sizes');
        const sizeData = await sizeResponse.json();
        setAvailableSizes(sizeData.sizes);
      } catch (error) {
        alert.error('Errore nel caricamento dei dati');
      }
    };

    fetchData();
  }, [alert]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Prodotto creato con successo");
      history.push("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, history, success]);

  const handleSizeSelect = (sizeId) => {
    const isSelected = selectedSizes.includes(sizeId);
    if (isSelected) {
      setSelectedSizes(selectedSizes.filter(id => id !== sizeId));
      setSizeStock(sizeStock.filter(item => item.size !== sizeId));
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
      setSizeStock([...sizeStock, { size: sizeId, quantity: 0 }]);
    }
  };

  const handleSizeQuantityChange = (sizeId, quantity) => {
    setSizeStock(prevStock => 
      prevStock.map(item => 
        item.size === sizeId ? { ...item, quantity: parseInt(quantity) || 0 } : item
      )
    );
  };

  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        const response = await fetch('/api/v1/categories/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory })
        });
  
        if (response.ok) {
          setCategories([...categories, newCategory]);
          setCategory(newCategory);
          setNewCategory('');
          alert.success('Categoria aggiunta con successo');
        } else {
          alert.error('Errore nel salvare la categoria');
        }
      } catch (error) {
        alert.error('Errore di rete');
      }
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const maxWidth = 1200;
      const maxHeight = 1200;
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
            alert.info(`L'immagine ${file.name} è stata ridimensionata a ${width}x${height}px`);
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const quality = file.type === 'image/jpeg' ? 0.8 : 1;
          resolve(canvas.toDataURL(file.type, quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createProductImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 3 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (images.length + files.length > 4) {
      alert.error("Non puoi caricare più di 4 immagini");
      return;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        alert.error(`L'immagine ${file.name} supera i 3MB`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        alert.error(`Il formato dell'immagine ${file.name} non è supportato. Usa JPG, PNG o WebP`);
        return;
      }
    }
    
    try {
      for (const file of files) {
        const resizedImage = await resizeImage(file);
        setImages((oldImages) => [...oldImages, resizedImage]);
        setImagesPreview((oldPreviews) => [...oldPreviews, resizedImage]);
      }
    } catch (error) {
      alert.error("Errore durante il caricamento delle immagini");
    }
  };

  const handleRemoveImage = (imageIndex) => {
    setImagesPreview((oldPreviews) =>
      oldPreviews.filter((_, index) => index !== imageIndex)
    );
    setImages((oldImages) => oldImages.filter((_, index) => index !== imageIndex));
  };

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert.error("Il nome del prodotto è obbligatorio");
      return;
    }

    if (price <= 0) {
      alert.error("Il prezzo deve essere maggiore di 0");
      return;
    }

    if (!category) {
      alert.error("La categoria è obbligatoria");
      return;
    }

    if (images.length === 0) {
      alert.error("Devi caricare almeno un'immagine");
      return;
    }

    if (selectedSizes.length === 0) {
      alert.error("Devi selezionare almeno una taglia");
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("info", info);
    myForm.set("sizeStock", JSON.stringify(sizeStock));
    
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });
    
    dispatch(createProduct(myForm));
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Nuovo Prodotto" />
          <div className="new-product">
            <div className={!toggle ? "process-order__sidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="new-product__main">
              <Navbar toggleHandler={toggleHandler} />
              
              <div className="new-product__content">
                <div className="new-product__header">
                  <div className="new-product__avatar">
                    <AddCircleOutlineIcon />
                  </div>
                  <h1 className="new-product__title">Crea Prodotto</h1>
                </div>

                <form className="new-product__form" onSubmit={createProductSubmitHandler}>
                  <div className="new-product__input">
                    <label>Nome Prodotto</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome del prodotto"
                    />
                  </div>

                  <div className="new-product__input">
                    <label>Prezzo (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                    <p className="new-product__helper-text">
                      Usa il punto (.) per i decimali, esempio: 1.99€
                    </p>
                  </div>

                  <div className="new-product__input">
                    <label>Informazioni Prodotto</label>
                    <input
                      type="text"
                      value={info}
                      onChange={(e) => setInfo(e.target.value)}
                      placeholder="Informazioni aggiuntive"
                    />
                  </div>

                  <div className="new-product__category-section">
                    <div className="new-product__input">
                      <label>Nuova Categoria</label>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nome nuova categoria"
                      />
                      <button 
                        type="button"
                        className="new-product__button"
                        onClick={addCategory}
                      >
                        Aggiungi Categoria
                      </button>
                    </div>

                    <div className="new-product__input">
                      <label>Seleziona Categoria</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="new-product__select"
                      >
                        <option value="">Scegli la categoria</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="new-product__input">
                    <label>Descrizione Prodotto</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      placeholder="Descrizione dettagliata del prodotto"
                    />
                  </div>

                  <div className="new-product__image-section">
                    <div className="new-product__image-upload" onClick={() => fileInputRef.current.click()}>
                      <CollectionsIcon style={{ fontSize: 40, color: '#6c757d' }} />
                      <p>Clicca per caricare le immagini</p>
                      <p className="new-product__helper-text">
                        Massimo 4 immagini per prodotto (max 3MB e 1200x1200px ciascuna)
                      </p>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={createProductImagesChange}
                    />

                    <div className="new-product__image-preview">
                      {imagesPreview.map((image, index) => (
                        <div key={index} className="new-product__image-item">
                          <img src={image} alt="Product Preview" />
                          <div 
                            className="new-product__image-remove"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <DeleteIcon />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="new-product__sizes">
                    <h2>Taglie e Quantità</h2>
                    <div className="new-product__sizes-grid">
                      {availableSizes.map((size) => (
                        <div key={size._id} className="new-product__size-item">
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(size._id)}
                              onChange={() => handleSizeSelect(size._id)}
                            />
                            {size.name}
                          </label>
                          {selectedSizes.includes(size._id) && (
                            <input
                              type="number"
                              min="0"
                              value={sizeStock.find(item => item.size === size._id)?.quantity || 0}
                              onChange={(e) => handleSizeQuantityChange(size._id, e.target.value)}
                              placeholder="Quantità"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="new-product__button"
                    disabled={loading}
                  >
                    <CloudUploadIcon /> Crea Prodotto
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default NewProduct;
