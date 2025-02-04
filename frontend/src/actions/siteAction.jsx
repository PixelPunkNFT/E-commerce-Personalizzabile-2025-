import axios from 'axios';
import {
  GET_SHOP_NAME_REQUEST,
  GET_SHOP_NAME_SUCCESS,
  GET_SHOP_NAME_FAIL,
  GET_SOCIAL_MEDIA_REQUEST,
  GET_SOCIAL_MEDIA_SUCCESS,
  GET_SOCIAL_MEDIA_FAIL,
  UPDATE_SOCIAL_MEDIA_REQUEST,
  UPDATE_SOCIAL_MEDIA_SUCCESS,
  UPDATE_SOCIAL_MEDIA_FAIL,
  UPDATE_SHOP_NAME_REQUEST,
  UPDATE_SHOP_NAME_SUCCESS,
  UPDATE_SHOP_NAME_FAIL,
  CUSTOMIZE_LOGO_REQUEST,
  CUSTOMIZE_LOGO_SUCCESS,
  CUSTOMIZE_LOGO_FAIL,
  GET_HERO_SLIDES_REQUEST,
  GET_HERO_SLIDES_SUCCESS,
  GET_HERO_SLIDES_FAIL,
  ADD_HERO_SLIDE_REQUEST,
  ADD_HERO_SLIDE_SUCCESS,
  ADD_HERO_SLIDE_FAIL,
  UPDATE_HERO_SLIDE_REQUEST,
  UPDATE_HERO_SLIDE_SUCCESS,
  UPDATE_HERO_SLIDE_FAIL,
  DELETE_HERO_SLIDE_REQUEST,
  DELETE_HERO_SLIDE_SUCCESS,
  DELETE_HERO_SLIDE_FAIL,
  GET_CONTACT_INFO_REQUEST,
  GET_CONTACT_INFO_SUCCESS,
  GET_CONTACT_INFO_FAIL,
  UPDATE_CONTACT_INFO_REQUEST,
  UPDATE_CONTACT_INFO_SUCCESS,
  UPDATE_CONTACT_INFO_FAIL,
  CLEAR_ERRORS,
  ACCEPT_COOKIES,
  REJECT_COOKIES,
  SET_COOKIE_CONSENT,
  GET_ABOUT_INFO_REQUEST,
  GET_ABOUT_INFO_SUCCESS,
  GET_ABOUT_INFO_FAIL,
  UPDATE_ABOUT_INFO_REQUEST,
  UPDATE_ABOUT_INFO_SUCCESS,
  UPDATE_ABOUT_INFO_FAIL,
} from '../constants/siteConstant';

// Get About Info
export const getAboutInfo = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ABOUT_INFO_REQUEST });

    const { data } = await axios.get('/api/v1/admin/customize/about-info', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    dispatch({
      type: GET_ABOUT_INFO_SUCCESS,
      payload: data.aboutInfo,
    });
  } catch (error) {
    dispatch({
      type: GET_ABOUT_INFO_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Update About Info
export const updateAboutInfo = (aboutInfo) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ABOUT_INFO_REQUEST });

    const { data } = await axios.put(
      '/api/v1/admin/customize/about-info',
      aboutInfo,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    );

    dispatch({
      type: UPDATE_ABOUT_INFO_SUCCESS,
      payload: data.aboutInfo,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ABOUT_INFO_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Get Shop Name
export const getShopName = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SHOP_NAME_REQUEST });

    const { data } = await axios.get('/api/v1/admin/customize/shop-name', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!data || !data.shopName) {
      throw new Error('Nome dello shop non trovato');
    }

    dispatch({
      type: GET_SHOP_NAME_SUCCESS,
      payload: data.shopName,
    });
  } catch (error) {
    dispatch({
      type: GET_SHOP_NAME_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Cookie consent actions
export const acceptCookies = () => (dispatch) => {
  localStorage.setItem('cookieConsent', 'accepted');
  dispatch({ type: ACCEPT_COOKIES });
  dispatch({ 
    type: SET_COOKIE_CONSENT, 
    payload: { status: 'accepted', timestamp: new Date().toISOString() }
  });
};

export const rejectCookies = () => (dispatch) => {
  localStorage.setItem('cookieConsent', 'rejected');
  dispatch({ type: REJECT_COOKIES });
  dispatch({ 
    type: SET_COOKIE_CONSENT, 
    payload: { status: 'rejected', timestamp: new Date().toISOString() }
  });
};

export const checkCookieConsent = () => (dispatch) => {
  const consent = localStorage.getItem('cookieConsent');
  if (consent) {
    dispatch({ 
      type: SET_COOKIE_CONSENT,
      payload: { status: consent, timestamp: localStorage.getItem('cookieConsentTimestamp') }
    });
  }
};

// Update Shop Name
export const updateShopName = (shopName) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SHOP_NAME_REQUEST });

    const { data } = await axios.put(
      '/api/v1/admin/customize/shop-name',
      { shopName }, 
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    );

    dispatch({
      type: UPDATE_SHOP_NAME_SUCCESS,
      payload: data.shopName,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SHOP_NAME_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Get Logo
export const getSiteLogo = () => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMIZE_LOGO_REQUEST });

    const { data } = await axios.get('/api/v1/admin/customize/logo');

    // Aggiorna il favicon nel DOM quando viene caricato un nuovo logo
    if (data.faviconUrl) {
      const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
      faviconLink.type = 'image/x-icon';
      faviconLink.rel = 'shortcut icon';
      faviconLink.href = data.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(faviconLink);
    }

    dispatch({
      type: CUSTOMIZE_LOGO_SUCCESS,
      payload: {
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        logoWidth: data.logoWidth,
        logoHeight: data.logoHeight
      },
    });
  } catch (error) {
    dispatch({
      type: CUSTOMIZE_LOGO_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// Get Hero Slides
export const getHeroSlides = () => async (dispatch) => {
  try {
    dispatch({ type: GET_HERO_SLIDES_REQUEST });

    const { data } = await axios.get('/api/v1/admin/customize/hero-slides');

    dispatch({
      type: GET_HERO_SLIDES_SUCCESS,
      payload: data.slides,
    });
  } catch (error) {
    dispatch({
      type: GET_HERO_SLIDES_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Add Hero Slide
export const addHeroSlide = (slideData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_HERO_SLIDE_REQUEST });

    const config = {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.post('/api/v1/admin/customize/hero-slides', slideData, config);

    dispatch({
      type: ADD_HERO_SLIDE_SUCCESS,
      payload: data.slides,
    });
  } catch (error) {
    dispatch({
      type: ADD_HERO_SLIDE_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Update Hero Slide
export const updateHeroSlide = (slideId, slideData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_HERO_SLIDE_REQUEST });

    const config = {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.put(`/api/v1/admin/customize/hero-slides/${slideId}`, slideData, config);

    dispatch({
      type: UPDATE_HERO_SLIDE_SUCCESS,
      payload: data.slides,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_HERO_SLIDE_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Delete Hero Slide
export const deleteHeroSlide = (slideId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_HERO_SLIDE_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/customize/hero-slides/${slideId}`);

    dispatch({
      type: DELETE_HERO_SLIDE_SUCCESS,
      payload: data.slides,
    });
  } catch (error) {
    dispatch({
      type: DELETE_HERO_SLIDE_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

export const updateSiteLogo = (logoData) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMIZE_LOGO_REQUEST });

    const config = {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.post('/api/v1/admin/customize/logo', logoData, config);

    // Aggiorna il favicon nel DOM quando viene caricato un nuovo logo
    if (data.faviconUrl) {
      const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
      faviconLink.type = 'image/x-icon';
      faviconLink.rel = 'shortcut icon';
      faviconLink.href = data.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(faviconLink);
    }

    dispatch({
      type: CUSTOMIZE_LOGO_SUCCESS,
      payload: {
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        logoWidth: data.logoWidth,
        logoHeight: data.logoHeight
      },
    });
  } catch (error) {
    dispatch({
      type: CUSTOMIZE_LOGO_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Get Contact Info
export const getContactInfo = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CONTACT_INFO_REQUEST });

    const { data } = await axios.get('/api/v1/admin/customize/contact-info');

    dispatch({
      type: GET_CONTACT_INFO_SUCCESS,
      payload: data.contactInfo,
    });
  } catch (error) {
    dispatch({
      type: GET_CONTACT_INFO_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

// Update Contact Info
// Get Social Media
export const getSocialMedia = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SOCIAL_MEDIA_REQUEST });

    const { data } = await axios.get('/api/v1/admin/customize/social-media', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!data.success) {
      throw new Error(data.error || 'Errore nel recupero dei social media');
    }

    dispatch({
      type: GET_SOCIAL_MEDIA_SUCCESS,
      payload: data.socialMedia || {
        facebook: { isActive: false, link: "" },
        instagram: { isActive: false, link: "" },
        tiktok: { isActive: false, link: "" },
        linkedin: { isActive: false, link: "" }
      }
    });
  } catch (error) {
    dispatch({
      type: GET_SOCIAL_MEDIA_FAIL,
      payload: error.response?.data?.error || error.message
    });
  }
};

// Update Social Media
export const updateSocialMedia = (socialMedia) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SOCIAL_MEDIA_REQUEST });

    const { data } = await axios.put(
      '/api/v1/admin/customize/social-media',
      { socialMedia },
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    );

    dispatch({
      type: UPDATE_SOCIAL_MEDIA_SUCCESS,
      payload: data.socialMedia,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SOCIAL_MEDIA_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};

export const updateContactInfo = (contactInfo) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CONTACT_INFO_REQUEST });

    const { data } = await axios.put(
      '/api/v1/admin/customize/contact-info',
      contactInfo,
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    );

    dispatch({
      type: UPDATE_CONTACT_INFO_SUCCESS,
      payload: data.contactInfo,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CONTACT_INFO_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};
