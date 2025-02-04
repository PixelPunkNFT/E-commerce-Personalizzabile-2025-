import {
  GET_WHATSAPP_REQUEST,
  GET_WHATSAPP_SUCCESS,
  GET_WHATSAPP_FAIL,
  UPDATE_WHATSAPP_REQUEST,
  UPDATE_WHATSAPP_SUCCESS,
  UPDATE_WHATSAPP_FAIL,
  UPDATE_WHATSAPP_RESET,
  CLEAR_ERRORS,
} from "../constants/whatsAppConstant";

export const whatsAppReducer = (state = { whatsApp: null, loading: false }, action) => {
  switch (action.type) {
    case GET_WHATSAPP_REQUEST:
      return {
        loading: true,
      };
    case GET_WHATSAPP_SUCCESS:
      return {
        loading: false,
        whatsApp: action.payload.whatsApp,
      };
    case GET_WHATSAPP_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const updateWhatsAppReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_WHATSAPP_REQUEST:
      return {
        loading: true,
      };
    case UPDATE_WHATSAPP_SUCCESS:
      return {
        loading: false,
        isUpdated: true,
        whatsApp: action.payload.whatsApp,
      };
    case UPDATE_WHATSAPP_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case UPDATE_WHATSAPP_RESET:
      return {
        loading: false,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
