import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, Divider, Collapse, Switch } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getContactInfo, updateContactInfo, getAboutInfo, updateAboutInfo } from "../../actions/siteAction";
import { UPDATE_CONTACT_INFO_RESET, UPDATE_ABOUT_INFO_RESET } from "../../constants/siteConstant";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import "./CustomizeTexts.css";

function CustomizeTexts() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessHours, setBusinessHours] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  });
  const [businessDetails, setBusinessDetails] = useState({
    shopName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    vatNumber: '',
  });

  const [aboutDetails, setAboutDetails] = useState({
    section1: {
      title: 'Chi siamo',
      description: '',
      isHtml: false
    },
    section2: {
      title: 'La Nostra Missione',
      description: '',
      isHtml: false
    }
  });

  const { contactInfo, loading, error, success } = useSelector((state) => state.contactInfo);
  const { 
    aboutInfo, 
    loading: aboutLoading, 
    error: aboutError, 
    success: aboutSuccess 
  } = useSelector((state) => state.aboutInfo);

  useEffect(() => {
    dispatch(getContactInfo());
    dispatch(getAboutInfo());
  }, [dispatch]);

  useEffect(() => {
    if (contactInfo) {
      setPhoneNumber(contactInfo.phoneNumber || '');
      setBusinessHours(contactInfo.businessHours || {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      });
      setBusinessDetails(contactInfo.businessDetails || {
        shopName: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        vatNumber: '',
      });
    }

    if (success) {
      alert.success('Informazioni di contatto aggiornate con successo');
      dispatch({ type: UPDATE_CONTACT_INFO_RESET });
    }

    if (error) {
      alert.error(error);
      dispatch({ type: UPDATE_CONTACT_INFO_RESET });
    }
  }, [dispatch, contactInfo, success, error, alert]);

  useEffect(() => {
    if (aboutInfo) {
      setAboutDetails({
        section1: {
          title: aboutInfo.section1?.title || 'Chi siamo',
          description: aboutInfo.section1?.description || '',
          isHtml: aboutInfo.section1?.isHtml || false
        },
        section2: {
          title: aboutInfo.section2?.title || 'La Nostra Missione',
          description: aboutInfo.section2?.description || '',
          isHtml: aboutInfo.section2?.isHtml || false
        }
      });
    }

    if (aboutSuccess) {
      alert.success('Informazioni About Us aggiornate con successo');
      dispatch({ type: UPDATE_ABOUT_INFO_RESET });
    }

    if (aboutError) {
      alert.error(aboutError);
      dispatch({ type: UPDATE_ABOUT_INFO_RESET });
    }
  }, [dispatch, aboutInfo, aboutSuccess, aboutError, alert]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleBusinessHoursChange = (day, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const handleBusinessDetailsChange = (field, value) => {
    setBusinessDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      phoneNumber,
      businessHours,
      businessDetails
    };
    dispatch(updateContactInfo(formData));
  };

  return (
    <>
      <MetaData title="Personalizza Testi - Admin Panel" />
      <div className="customize-texts">
        <div className="customize-texts-first-box">
          <Sidebar />
        </div>

        <div className="customize-texts-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <div className="customize-texts-content">
            <Typography variant="h4" className="customize-texts-title">
              Personalizzazione Testi dello  Store.
              
            </Typography>
            <button 
                className={`collapse-button ${isContentExpanded ? 'open' : ''}`}
                onClick={() => setIsContentExpanded(!isContentExpanded)}
              >
                <h1>Personalizzazione  Pagina Contatti</h1>
                <KeyboardArrowDownIcon />
              </button>
            <Collapse in={isContentExpanded}>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#414141' }}>
                  Informazioni di Contatto
                </Typography>
                <TextField
                  fullWidth
                  label="Numero di telefono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#414141' }}>
                  Orari di Apertura
                </Typography>
                <TextField
                  fullWidth
                  label="Lunedì"
                  value={businessHours.monday}
                  onChange={(e) => handleBusinessHoursChange('monday', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Martedì"
                  value={businessHours.tuesday}
                  onChange={(e) => handleBusinessHoursChange('tuesday', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Mercoledì"
                  value={businessHours.wednesday}
                  onChange={(e) => handleBusinessHoursChange('wednesday', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Giovedì"
                  value={businessHours.thursday}
                  onChange={(e) => handleBusinessHoursChange('thursday', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Venerdì"
                  value={businessHours.friday}
                  onChange={(e) => handleBusinessHoursChange('friday', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Sabato"
                  value={businessHours.saturday}
                  onChange={(e) => handleBusinessHoursChange('saturday', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Domenica"
                  value={businessHours.sunday}
                  onChange={(e) => handleBusinessHoursChange('sunday', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#414141' }}>
                  Dettagli Aziendali
                </Typography>
                <TextField
                  fullWidth
                  label="Nome Negozio"
                  value={businessDetails.shopName}
                  onChange={(e) => handleBusinessDetailsChange('shopName', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Indirizzo"
                  value={businessDetails.address}
                  onChange={(e) => handleBusinessDetailsChange('address', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Città"
                  value={businessDetails.city}
                  onChange={(e) => handleBusinessDetailsChange('city', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Nazione"
                  value={businessDetails.country}
                  onChange={(e) => handleBusinessDetailsChange('country', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="CAP"
                  value={businessDetails.postalCode}
                  onChange={(e) => handleBusinessDetailsChange('postalCode', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Partita IVA"
                  value={businessDetails.vatNumber}
                  onChange={(e) => handleBusinessDetailsChange('vatNumber', e.target.value)}
                  sx={{ mb: 2 }}
                />
               
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: '#292929',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#ed1c24',
                  },
                }}
              >
                {loading ? 'Aggiornamento...' : 'Salva Modifiche'}
              </Button>
            </form>
            </Collapse>

            <button 
              className={`collapse-button ${isAboutExpanded ? 'open' : ''}`}
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            >
              <h1>Personalizzazione Pagina Chi Siamo</h1>
              <KeyboardArrowDownIcon />
            </button>

            <Collapse in={isAboutExpanded}>
              <form onSubmit={(e) => {
                e.preventDefault();
                dispatch(updateAboutInfo(aboutDetails));
              }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#414141' }}>
                    Prima Sezione
                  </Typography>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ mr: 2 }}>Modalità HTML</Typography>
                      <Switch
                        color="primary"
                        checked={aboutDetails.section1.isHtml}
                        onChange={(e) => setAboutDetails(prev => ({
                          ...prev,
                          section1: {
                            ...prev.section1,
                            isHtml: e.target.checked
                          }
                        }))}
                      />
                    </Box>
                    {aboutDetails.section1.isHtml && (
                      <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#666' }}>
                        Puoi utilizzare tag HTML come: &lt;br&gt; per andare a capo, &lt;b&gt;testo&lt;/b&gt; per il grassetto, &lt;i&gt;testo&lt;/i&gt; per il corsivo, &lt;ul&gt;&lt;li&gt;elemento&lt;/li&gt;&lt;/ul&gt; per liste
                      </Typography>
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    label="Titolo della sezione"
                    value={aboutDetails.section1.title}
                    onChange={(e) => setAboutDetails(prev => ({
                      ...prev,
                      section1: {
                        ...prev.section1,
                        title: e.target.value
                      }
                    }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Descrizione della sezione"
                    value={aboutDetails.section1.description}
                    onChange={(e) => setAboutDetails(prev => ({
                      ...prev,
                      section1: {
                        ...prev.section1,
                        description: e.target.value
                      }
                    }))}
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#414141' }}>
                    Seconda Sezione
                  </Typography>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ mr: 2 }}>Modalità HTML</Typography>
                      <Switch
                        color="primary"
                        checked={aboutDetails.section2.isHtml}
                      onChange={(e) => setAboutDetails(prev => ({
                        ...prev,
                        section2: {
                          ...prev.section2,
                          isHtml: e.target.checked
                        }
                      }))}
                    />
                    </Box>
                    {aboutDetails.section2.isHtml && (
                      <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#666' }}>
                        Puoi utilizzare tag HTML come: &lt;br&gt; per andare a capo, &lt;b&gt;testo&lt;/b&gt; per il grassetto, &lt;i&gt;testo&lt;/i&gt; per il corsivo, &lt;ul&gt;&lt;li&gt;elemento&lt;/li&gt;&lt;/ul&gt; per liste
                      </Typography>
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    label="Titolo della sezione"
                    value={aboutDetails.section2.title}
                    onChange={(e) => setAboutDetails(prev => ({
                      ...prev,
                      section2: {
                        ...prev.section2,
                        title: e.target.value
                      }
                    }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="Descrizione della sezione"
                    value={aboutDetails.section2.description}
                    onChange={(e) => setAboutDetails(prev => ({
                      ...prev,
                      section2: {
                        ...prev.section2,
                        description: e.target.value
                      }
                    }))}
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={aboutLoading}
                  sx={{
                    backgroundColor: '#292929',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#ed1c24',
                    },
                  }}
                >
                  {aboutLoading ? 'Aggiornamento...' : 'Salva Modifiche'}
                </Button>
              </form>
            </Collapse>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeTexts;
