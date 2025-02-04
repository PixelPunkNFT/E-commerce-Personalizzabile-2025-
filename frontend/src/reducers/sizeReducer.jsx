import {
  ALL_SIZES_REQUEST,
  ALL_SIZES_SUCCESS,
  ALL_SIZES_FAIL,
  NEW_SIZE_REQUEST,
  NEW_SIZE_SUCCESS,
  NEW_SIZE_RESET,
  NEW_SIZE_FAIL,
  UPDATE_SIZE_REQUEST,
  UPDATE_SIZE_SUCCESS,
  UPDATE_SIZE_RESET,
  UPDATE_SIZE_FAIL,
  DELETE_SIZE_REQUEST,
  DELETE_SIZE_SUCCESS,
  DELETE_SIZE_RESET,
  DELETE_SIZE_FAIL,
  CLEAR_ERRORS,
} from "../constants/sizeConstant";

export const sizesReducer = (state = { sizes: [] }, action) => {
  switch (action.type) {
    case ALL_SIZES_REQUEST:
      return {
        loading: true,
        sizes: [],
      };
    case ALL_SIZES_SUCCESS:
      return {
        loading: false,
        sizes: action.payload,
      };
    case ALL_SIZES_FAIL:
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

export const newSizeReducer = (state = { size: {} }, action) => {
  switch (action.type) {
    case NEW_SIZE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_SIZE_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        size: action.payload.size,
      };
    case NEW_SIZE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_SIZE_RESET:
      return {
        ...state,
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

export const sizeReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_SIZE_REQUEST:
    case UPDATE_SIZE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_SIZE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_SIZE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_SIZE_FAIL:
    case UPDATE_SIZE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_SIZE_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_SIZE_RESET:
      return {
        ...state,
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
