import axios from "axios";
import {
    SAVE_STRIPE_KEYS_REQUEST,
    SAVE_STRIPE_KEYS_SUCCESS,
    SAVE_STRIPE_KEYS_FAIL,
    GET_STRIPE_KEYS_REQUEST,
    GET_STRIPE_KEYS_SUCCESS,
    GET_STRIPE_KEYS_FAIL,
    CLEAR_ERRORS,
} from "../constants/stripeKeysConstant";

// Salva le chiavi Stripe
export const saveStripeKeys = (publishableKey, secretKey) => async (dispatch) => {
    try {
        dispatch({ type: SAVE_STRIPE_KEYS_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(
            `/api/v1/admin/stripe-keys`,
            { publishableKey, secretKey },
            config
        );

        dispatch({
            type: SAVE_STRIPE_KEYS_SUCCESS,
            payload: data.stripeKeys,
        });
    } catch (error) {
        dispatch({
            type: SAVE_STRIPE_KEYS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Ottieni le chiavi Stripe
export const getStripeKeys = () => async (dispatch) => {
    try {
        dispatch({ type: GET_STRIPE_KEYS_REQUEST });

        const { data } = await axios.get(`/api/v1/admin/stripe-keys`);

        dispatch({
            type: GET_STRIPE_KEYS_SUCCESS,
            payload: data.stripeKeys,
        });
    } catch (error) {
        dispatch({
            type: GET_STRIPE_KEYS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
