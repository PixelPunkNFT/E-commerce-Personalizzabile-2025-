import axios from "axios";
import {
  ALL_SIZES_REQUEST,
  ALL_SIZES_SUCCESS,
  ALL_SIZES_FAIL,
  NEW_SIZE_REQUEST,
  NEW_SIZE_SUCCESS,
  NEW_SIZE_FAIL,
  UPDATE_SIZE_REQUEST,
  UPDATE_SIZE_SUCCESS,
  UPDATE_SIZE_FAIL,
  DELETE_SIZE_REQUEST,
  DELETE_SIZE_SUCCESS,
  DELETE_SIZE_FAIL,
  CLEAR_ERRORS,
} from "../constants/sizeConstant";

// Get All Sizes
export const getAllSizes = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SIZES_REQUEST });

    const { data } = await axios.get("/api/v1/sizes");

    dispatch({
      type: ALL_SIZES_SUCCESS,
      payload: data.sizes,
    });
  } catch (error) {
    dispatch({
      type: ALL_SIZES_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create Size
export const createSize = (sizeName) => async (dispatch) => {
  try {
    dispatch({ type: NEW_SIZE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

  const { data } = await axios.post(
      `/api/v1/admin/size/new`,
      { name: sizeName },
      config
    );

    dispatch({
      type: NEW_SIZE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_SIZE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Size
export const updateSize = (id, sizeData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SIZE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/admin/size/${id}`,
      sizeData,
      config
    );

    dispatch({
      type: UPDATE_SIZE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SIZE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Size
export const deleteSize = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SIZE_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/size/${id}`);

    dispatch({
      type: DELETE_SIZE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SIZE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
