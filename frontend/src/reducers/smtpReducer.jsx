import {
    GET_SMTP_CONFIG_REQUEST,
    GET_SMTP_CONFIG_SUCCESS,
    GET_SMTP_CONFIG_FAIL,
    UPDATE_SMTP_CONFIG_REQUEST,
    UPDATE_SMTP_CONFIG_SUCCESS,
    UPDATE_SMTP_CONFIG_FAIL,
    UPDATE_SMTP_CONFIG_RESET,
    CLEAR_ERRORS,
} from "../constants/smtpConstant";

export const smtpReducer = (state = { smtp: {} }, action) => {
    switch (action.type) {
        case GET_SMTP_CONFIG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_SMTP_CONFIG_SUCCESS:
            return {
                loading: false,
                smtp: action.payload.smtp,
            };
        case GET_SMTP_CONFIG_FAIL:
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

export const updateSmtpReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_SMTP_CONFIG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_SMTP_CONFIG_SUCCESS:
            return {
                loading: false,
                success: true,
                smtp: action.payload.smtp,
            };
        case UPDATE_SMTP_CONFIG_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case UPDATE_SMTP_CONFIG_RESET:
            return {
                loading: false,
                success: false,
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
