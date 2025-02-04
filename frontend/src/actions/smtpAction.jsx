import axios from "axios";
import {
    GET_SMTP_CONFIG_REQUEST,
    GET_SMTP_CONFIG_SUCCESS,
    GET_SMTP_CONFIG_FAIL,
    UPDATE_SMTP_CONFIG_REQUEST,
    UPDATE_SMTP_CONFIG_SUCCESS,
    UPDATE_SMTP_CONFIG_FAIL,
    CLEAR_ERRORS,
} from "../constants/smtpConstant";

// Get SMTP Configuration
export const getSmtpConfig = () => async (dispatch) => {
    try {
        dispatch({ type: GET_SMTP_CONFIG_REQUEST });

        const { data } = await axios.get("/api/v1/admin/smtp/config");

        dispatch({
            type: GET_SMTP_CONFIG_SUCCESS,
            payload: { smtp: data.smtp },
        });
    } catch (error) {
        dispatch({
            type: GET_SMTP_CONFIG_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update SMTP Configuration
export const updateSmtpConfig = (smtpData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_SMTP_CONFIG_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.put(
            "/api/v1/admin/smtp/config",
            smtpData,
            config
        );

        dispatch({
            type: UPDATE_SMTP_CONFIG_SUCCESS,
            payload: { smtp: data.smtp },
        });
    } catch (error) {
        dispatch({
            type: UPDATE_SMTP_CONFIG_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
