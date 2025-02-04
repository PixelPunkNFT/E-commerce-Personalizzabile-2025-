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
  UPDATE_SOCIAL_MEDIA_RESET,
  UPDATE_SHOP_NAME_REQUEST,
  UPDATE_SHOP_NAME_SUCCESS,
  UPDATE_SHOP_NAME_FAIL,
  UPDATE_SHOP_NAME_RESET,
  CUSTOMIZE_LOGO_REQUEST,
  CUSTOMIZE_LOGO_SUCCESS,
  CUSTOMIZE_LOGO_FAIL,
  CUSTOMIZE_LOGO_RESET,
  GET_HERO_SLIDES_REQUEST,
  GET_HERO_SLIDES_SUCCESS,
  GET_HERO_SLIDES_FAIL,
  ADD_HERO_SLIDE_REQUEST,
  ADD_HERO_SLIDE_SUCCESS,
  ADD_HERO_SLIDE_FAIL,
  ADD_HERO_SLIDE_RESET,
  UPDATE_HERO_SLIDE_REQUEST,
  UPDATE_HERO_SLIDE_SUCCESS,
  UPDATE_HERO_SLIDE_FAIL,
  UPDATE_HERO_SLIDE_RESET,
  DELETE_HERO_SLIDE_REQUEST,
  DELETE_HERO_SLIDE_SUCCESS,
  DELETE_HERO_SLIDE_FAIL,
  DELETE_HERO_SLIDE_RESET,
  GET_CONTACT_INFO_REQUEST,
  GET_CONTACT_INFO_SUCCESS,
  GET_CONTACT_INFO_FAIL,
  UPDATE_CONTACT_INFO_REQUEST,
  UPDATE_CONTACT_INFO_SUCCESS,
  UPDATE_CONTACT_INFO_FAIL,
  UPDATE_CONTACT_INFO_RESET,
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
  UPDATE_ABOUT_INFO_RESET,
} from '../constants/siteConstant';

export const cookieConsentReducer = (state = { consent: null }, action) => {
  switch (action.type) {
    case ACCEPT_COOKIES:
      return {
        ...state,
        consent: 'accepted'
      };
    case REJECT_COOKIES:
      return {
        ...state,
        consent: 'rejected'
      };
    case SET_COOKIE_CONSENT:
      return {
        ...state,
        consent: action.payload.status,
        timestamp: action.payload.timestamp
      };
    default:
      return state;
  }
};

export const shopNameReducer = (state = { shopName: "", loading: false, error: null }, action) => {
  switch (action.type) {
    case GET_SHOP_NAME_REQUEST:
    case UPDATE_SHOP_NAME_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_SHOP_NAME_SUCCESS:
    case UPDATE_SHOP_NAME_SUCCESS:
      return {
        ...state,
        loading: false,
        shopName: action.payload,
        success: true
      };
    
    case GET_SHOP_NAME_FAIL:
    case UPDATE_SHOP_NAME_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UPDATE_SHOP_NAME_RESET:
      return {
        ...state,
        success: false
      };
    
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const siteLogoReducer = (state = { logoUrl: null, faviconUrl: null, logoWidth: 300, logoHeight: 100 }, action) => {
  switch (action.type) {
    case CUSTOMIZE_LOGO_REQUEST:
      return { loading: true };
    
    case CUSTOMIZE_LOGO_SUCCESS:
      return { 
        loading: false, 
        logoUrl: action.payload.logoUrl,
        faviconUrl: action.payload.faviconUrl,
        logoWidth: action.payload.logoWidth,
        logoHeight: action.payload.logoHeight,
        success: true 
      };
    
    case CUSTOMIZE_LOGO_FAIL:
      return { 
        loading: false, 
        error: action.payload 
      };
    
    case CUSTOMIZE_LOGO_RESET:
      return { logoUrl: null, faviconUrl: null };
    
    default:
      return state;
  }
};

export const heroSlidesReducer = (state = { slides: [] }, action) => {
  switch (action.type) {
    case GET_HERO_SLIDES_REQUEST:
      return {
        loading: true,
        slides: []
      };
    case GET_HERO_SLIDES_SUCCESS:
      return {
        loading: false,
        slides: action.payload
      };
    case GET_HERO_SLIDES_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const heroSlideAddReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_HERO_SLIDE_REQUEST:
      return {
        loading: true
      };
    case ADD_HERO_SLIDE_SUCCESS:
      return {
        loading: false,
        slides: action.payload,
        success: true
      };
    case ADD_HERO_SLIDE_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case ADD_HERO_SLIDE_RESET:
      return {};
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const heroSlideUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_HERO_SLIDE_REQUEST:
      return {
        loading: true
      };
    case UPDATE_HERO_SLIDE_SUCCESS:
      return {
        loading: false,
        slides: action.payload,
        success: true
      };
    case UPDATE_HERO_SLIDE_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case UPDATE_HERO_SLIDE_RESET:
      return {};
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const heroSlideDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_HERO_SLIDE_REQUEST:
      return {
        loading: true
      };
    case DELETE_HERO_SLIDE_SUCCESS:
      return {
        loading: false,
        slides: action.payload,
        success: true
      };
    case DELETE_HERO_SLIDE_FAIL:
      return {
        loading: false,
        error: action.payload
      };
    case DELETE_HERO_SLIDE_RESET:
      return {};
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const socialMediaReducer = (state = {
  socialMedia: {
    facebook: { isActive: false, link: "" },
    instagram: { isActive: false, link: "" },
    tiktok: { isActive: false, link: "" },
    linkedin: { isActive: false, link: "" }
  },
  loading: false,
  error: null,
  success: false
}, action) => {
  switch (action.type) {
    case GET_SOCIAL_MEDIA_REQUEST:
    case UPDATE_SOCIAL_MEDIA_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_SOCIAL_MEDIA_SUCCESS:
      return {
        loading: false,
        socialMedia: action.payload
      };

    case UPDATE_SOCIAL_MEDIA_SUCCESS:
      return {
        loading: false,
        socialMedia: action.payload,
        success: true
      };
    
    case GET_SOCIAL_MEDIA_FAIL:
    case UPDATE_SOCIAL_MEDIA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UPDATE_SOCIAL_MEDIA_RESET:
      return {
        ...state,
        success: false
      };
    
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const contactInfoReducer = (state = { contactInfo: {} }, action) => {
  switch (action.type) {
    case GET_CONTACT_INFO_REQUEST:
    case UPDATE_CONTACT_INFO_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_CONTACT_INFO_SUCCESS:
      return {
        loading: false,
        contactInfo: action.payload
      };

    case UPDATE_CONTACT_INFO_SUCCESS:
      return {
        loading: false,
        contactInfo: action.payload,
        success: true
      };
    
    case GET_CONTACT_INFO_FAIL:
    case UPDATE_CONTACT_INFO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UPDATE_CONTACT_INFO_RESET:
      return {
        ...state,
        success: false
      };
    
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const aboutInfoReducer = (state = { aboutInfo: {} }, action) => {
  switch (action.type) {
    case GET_ABOUT_INFO_REQUEST:
    case UPDATE_ABOUT_INFO_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_ABOUT_INFO_SUCCESS:
      return {
        loading: false,
        aboutInfo: action.payload
      };

    case UPDATE_ABOUT_INFO_SUCCESS:
      return {
        loading: false,
        aboutInfo: action.payload,
        success: true
      };
    
    case GET_ABOUT_INFO_FAIL:
    case UPDATE_ABOUT_INFO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UPDATE_ABOUT_INFO_RESET:
      return {
        ...state,
        success: false
      };
    
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};
