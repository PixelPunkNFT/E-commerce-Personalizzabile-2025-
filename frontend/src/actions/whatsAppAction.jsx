import axios from "axios";
import {
  GET_WHATSAPP_REQUEST,
  GET_WHATSAPP_SUCCESS,
  GET_WHATSAPP_FAIL,
  UPDATE_WHATSAPP_REQUEST,
  UPDATE_WHATSAPP_SUCCESS,
  UPDATE_WHATSAPP_FAIL,
  CLEAR_ERRORS,
} from "../constants/whatsAppConstant";

// Get WhatsApp Number
export const getWhatsAppNumber = () => async (dispatch) => {
  try {
    dispatch({ type: GET_WHATSAPP_REQUEST });

    const { data } = await axios.get(`/api/v1/admin/whatsapp/number`);

    dispatch({
      type: GET_WHATSAPP_SUCCESS,
      payload: { whatsApp: data.whatsApp },
    });
  } catch (error) {
    dispatch({
      type: GET_WHATSAPP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update WhatsApp Number
export const updateWhatsAppNumber = (phoneNumber) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_WHATSAPP_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/admin/whatsapp/number/update`,
      phoneNumber,
      config
    );

    if (data.success) {
      dispatch({
        type: UPDATE_WHATSAPP_SUCCESS,
        payload: { whatsApp: data.whatsApp },
      });
    }

  } catch (error) {
    dispatch({
      type: UPDATE_WHATSAPP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
