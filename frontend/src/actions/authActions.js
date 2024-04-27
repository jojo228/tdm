import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER, SET_ERRORS, USER_LOADING } from "./types";
import axiosInstance from "../axiosAPI";

// Register User
export const registerUser = (userData) => (dispatch) => {
  axiosInstance
    .post("/api/register", userData)
    .then((res) => {
      window.location.reload();
    }) // re-direct to login on successful register
    .catch((err) => {
      console.log(err);
      console.log("hi");
      dispatch(setErrors({ detail: "All fields required" }));
    });
};
// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axiosInstance
    .post("/api/login", userData)
    .then((res) => {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + res.data.access;
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("hotel_id", res.data.hotel_id);
      localStorage.setItem("role", res.data.role);
      // setAuthToken(token);
      const decoded = jwt_decode(res.data.access);
      // // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      console.log(err);
      dispatch(setErrors(err.response.data));
    });
};
// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const setErrors = (errors) => {
  return {
    type: SET_ERRORS,
    payload: errors,
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("hotel_id");
  // Remove auth header for future requests
  // setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
