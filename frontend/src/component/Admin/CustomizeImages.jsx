import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Button, 
  TextField,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import { 
  updateSiteLogo, 
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide 
} from "../../actions/siteAction";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import "./CustomizeImages.css";

function CustomizeImages() {
  const [toggle, setToggle] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoWidth, setLogoWidth] = useState(300);
  const [logoHeight, setLogoHeight] = useState(100);

  // State per la gestione delle slides
  const [slideImage, setSlideImage] = useState(null);
  const [slideImagePreview, setSlideImagePreview] = useState(null);
  const [slideQuote, setSlideQuote] = useState("");
  const [slideSaleText, setSlideSaleText] = useState("");
  const [slideProductText, setSlideProductText] = useState("");
  const [editingSlide, setEditingSlide] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.siteLogo || {});
  const { slides, loading: slidesLoading } = useSelector((state) => state.heroSlides || {});
  const { success: addSuccess } = useSelector((state) => state.heroSlideAdd || {});
  const { success: updateSuccess } = useSelector((state) => state.heroSlideUpdate || {});
  const { success: deleteSuccess } = useSelector((state) => state.heroSlideDelete || {});

  useEffect(() => {
    if (success) {
      setLogo(null);
      setLogoPreview(null);
    }

    if (addSuccess || updateSuccess || deleteSuccess) {
      setOpenDialog(false);
      setSlideImage(null);
      setSlideImagePreview(null);
      setSlideQuote("");
      setSlideSaleText("");
      setSlideProductText("");
      setEditingSlide(null);
      dispatch(getHeroSlides());
    }
  }, [success, addSuccess, updateSuccess, deleteSuccess, dispatch]);

  useEffect(() => {
    dispatch(getHeroSlides());
  }, [dispatch]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogoPreview(reader.result);
        setLogo(file);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = () => {
    if (!logo) {
      alert("Seleziona un logo prima di caricare");
      return;
    }

    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("width", logoWidth);
    formData.append("height", logoHeight);

    try {
      dispatch(updateSiteLogo(formData));
    } catch (error) {
      console.error("Errore durante il caricamento del logo:", error);
      alert("Errore durante il caricamento del logo");
    }
  };

  const handleSlideImageChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSlideImagePreview(reader.result);
        setSlideImage(file);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleAddSlide = () => {
    setEditingSlide(null);
    setSlideImage(null);
    setSlideImagePreview(null);
    setSlideQuote("");
    setSlideSaleText("");
    setSlideProductText("");
    setOpenDialog(true);
  };

  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
    setSlideImagePreview(slide.image);
    setSlideQuote(slide.quote);
    setSlideSaleText(slide.saleText);
    setSlideProductText(slide.productText);
    setOpenDialog(true);
  };

  const handleDeleteSlide = (slideId) => {
    if (window.confirm("Sei sicuro di voler eliminare questa slide?")) {
      dispatch(deleteHeroSlide(slideId));
    }
  };

  const handleSubmitSlide = () => {
    if (!slideImage && !editingSlide) {
      alert("Seleziona un'immagine per la slide");
      return;
    }

    if (!slideQuote || !slideSaleText || !slideProductText) {
      alert("Tutti i campi di testo sono obbligatori");
      return;
    }

    const formData = new FormData();
    if (slideImage) {
      formData.append("image", slideImage);
    }
    formData.append("quote", slideQuote);
    formData.append("saleText", slideSaleText);
    formData.append("productText", slideProductText);

    if (editingSlide) {
      dispatch(updateHeroSlide(editingSlide._id, formData));
    } else {
      dispatch(addHeroSlide(formData));
    }
  };

  return (
    <>
      <MetaData title="Personalizza Immagini - Admin Panel" />
      <div className="customize-images">
        <div className="customize-images-first-box">
          <Sidebar />
        </div>

        <div className="customize-images-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <div className="customize-images-content">
            {/* Sezione Logo */}
            <Typography variant="h4" className="customize-images-title">
              Personalizzazione Logo
            </Typography>
            
            <div className="logo-upload-section">
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  style={{ marginBottom: '10px' }}
                />
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <TextField
                    type="number"
                    label="Larghezza (px)"
                    value={logoWidth}
                    onChange={(e) => setLogoWidth(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    type="number"
                    label="Altezza (px)"
                    value={logoHeight}
                    onChange={(e) => setLogoHeight(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {logoPreview && (
                <div className="logo-preview">
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                  />
                </div>
              )}

              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleLogoUpload}
                disabled={loading}
              >
                {loading ? "Caricamento..." : "Carica Logo"}
              </Button>

              {success && (
                <Typography variant="body2" color="primary" style={{ marginTop: '10px' }}>
                  Logo caricato con successo!
                </Typography>
              )}

              {error && (
                <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
                  {error}
                </Typography>
              )}
            </div>

            {/* Sezione Hero Slides */}
            <Typography variant="h4" className="customize-images-title" style={{ marginTop: '40px' }}>
              Gestione Slide nell' Home Page
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddSlide}
              style={{ marginBottom: '20px' }}
            >
              Aggiungi Nuova Slide
            </Button>

            <Grid container spacing={3}>
              {slides?.map((slide) => (
                <Grid item xs={12} sm={6} md={4} key={slide._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={slide.image}
                      alt={slide.quote}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {slide.quote}
                      </Typography>
                      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => handleEditSlide(slide)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteSlide(slide._id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Dialog per aggiungere/modificare slide */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>
                {editingSlide ? "Modifica Slide" : "Aggiungi Nuova Slide"}
              </DialogTitle>
              <DialogContent>
                <div style={{ marginTop: '20px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlideImageChange}
                    style={{ marginBottom: '20px' }}
                  />

                  {slideImagePreview && (
                    <div style={{ marginBottom: '20px' }}>
                      <img
                        src={slideImagePreview}
                        alt="Slide Preview"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  )}

                  <TextField
                    fullWidth
                    label="Testo Principale"
                    value={slideQuote}
                    onChange={(e) => setSlideQuote(e.target.value)}
                    margin="normal"
                    multiline
                    rows={2}
                  />

                  <TextField
                    fullWidth
                    label="Testo Promozionale"
                    value={slideSaleText}
                    onChange={(e) => setSlideSaleText(e.target.value)}
                    margin="normal"
                    multiline
                    rows={2}
                  />

                  <TextField
                    fullWidth
                    label="Testo Bottone"
                    value={slideProductText}
                    onChange={(e) => setSlideProductText(e.target.value)}
                    margin="normal"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Annulla</Button>
                <Button onClick={handleSubmitSlide} variant="contained" color="primary">
                  {editingSlide ? "Aggiorna" : "Aggiungi"}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeImages;
