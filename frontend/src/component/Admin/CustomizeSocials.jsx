import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, Switch, FormControlLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getSocialMedia, updateSocialMedia } from "../../actions/siteAction";
import { UPDATE_SOCIAL_MEDIA_RESET } from "../../constants/siteConstant";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import "./CustomizeSocials.css";

function CustomizeSocials() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);
  const defaultSocialMedia = {
    facebook: { isActive: false, link: "" },
    instagram: { isActive: false, link: "" },
    tiktok: { isActive: false, link: "" },
    linkedin: { isActive: false, link: "" }
  };

  const [socialMedia, setSocialMedia] = useState(defaultSocialMedia);
  const { socialMedia: socialMediaData, loading, error, success } = useSelector((state) => state.socialMedia || { socialMedia: defaultSocialMedia });

  useEffect(() => {
    dispatch(getSocialMedia());
  }, [dispatch]);

  useEffect(() => {
    if (socialMediaData) {
      setSocialMedia(socialMediaData);
    }
  }, [socialMediaData]);

  useEffect(() => {
    if (success) {
      alert.success('Social media aggiornati con successo');
      dispatch({ type: UPDATE_SOCIAL_MEDIA_RESET });
    }
  }, [success, alert, dispatch]);

  useEffect(() => {
    if (error) {
      if (error.includes('login')) {
        window.location.href = '/login';
      } else {
        alert.error(error);
      }
      dispatch({ type: UPDATE_SOCIAL_MEDIA_RESET });
    }
  }, [error, alert, dispatch]);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleSocialChange = (platform, field, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSocialMedia(socialMedia));
  };

  return (
    <>
      <MetaData title="Personalizza Social Media - Admin Panel" />
      <div className="customize-socials">
        <div className="customize-socials-first-box">
          <Sidebar />
        </div>

        <div className="customize-socials-second-box">
          <Navbar toggleHandler={toggleHandler} />
          
          <div className="customize-socials-content">
            <Typography variant="h4" className="customize-socials-title">
              Personalizzazione Social Media
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <div className="social-field">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={socialMedia.facebook.isActive}
                        onChange={(e) => handleSocialChange('facebook', 'isActive', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Facebook"
                  />
                  <TextField
                    fullWidth
                    label="Link Facebook"
                    value={socialMedia.facebook.link}
                    onChange={(e) => handleSocialChange('facebook', 'link', e.target.value)}
                    disabled={!socialMedia.facebook.isActive}
                  />
                </div>

                <div className="social-field">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={socialMedia.instagram.isActive}
                        onChange={(e) => handleSocialChange('instagram', 'isActive', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Instagram"
                  />
                  <TextField
                    fullWidth
                    label="Link Instagram"
                    value={socialMedia.instagram.link}
                    onChange={(e) => handleSocialChange('instagram', 'link', e.target.value)}
                    disabled={!socialMedia.instagram.isActive}
                  />
                </div>

                <div className="social-field">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={socialMedia.tiktok.isActive}
                        onChange={(e) => handleSocialChange('tiktok', 'isActive', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="TikTok"
                  />
                  <TextField
                    fullWidth
                    label="Link TikTok"
                    value={socialMedia.tiktok.link}
                    onChange={(e) => handleSocialChange('tiktok', 'link', e.target.value)}
                    disabled={!socialMedia.tiktok.isActive}
                  />
                </div>

                <div className="social-field">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={socialMedia.linkedin.isActive}
                        onChange={(e) => handleSocialChange('linkedin', 'isActive', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="LinkedIn"
                  />
                  <TextField
                    fullWidth
                    label="Link LinkedIn"
                    value={socialMedia.linkedin.link}
                    onChange={(e) => handleSocialChange('linkedin', 'link', e.target.value)}
                    disabled={!socialMedia.linkedin.isActive}
                  />
                </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomizeSocials;
