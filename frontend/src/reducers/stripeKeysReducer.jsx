import {
    SAVE_STRIPE_KEYS_REQUEST,
    SAVE_STRIPE_KEYS_SUCCESS,
    SAVE_STRIPE_KEYS_FAIL,
    GET_STRIPE_KEYS_REQUEST,
    GET_STRIPE_KEYS_SUCCESS,
    GET_STRIPE_KEYS_FAIL,
    CLEAR_ERRORS,
} from "../constants/stripeKeysConstant";

export const stripeKeysReducer = (state = { stripeKeys: {} }, action) => {
    switch (action.type) {
        case SAVE_STRIPE_KEYS_REQUEST:
        case GET_STRIPE_KEYS_REQUEST:
            return {
                loading: true,
            };
        case SAVE_STRIPE_KEYS_SUCCESS:
        case GET_STRIPE_KEYS_SUCCESS:
            return {
                loading: false,
                stripeKeys: action.payload,
            };
        case SAVE_STRIPE_KEYS_FAIL:
        case GET_STRIPE_KEYS_FAIL:
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
