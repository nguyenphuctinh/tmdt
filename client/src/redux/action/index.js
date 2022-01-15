// import { toast } from "react-toastify";
// import axios from "axios";
// import { authorization } from "../../auth/auth";
// import { useDispatch } from "react-redux";

import { getUserByToken } from "../../auth/auth";

export const loginAction = (username) => {
  return {
    type: "LOGIN",
    username,
  };
};
export const logoutAction = () => {
  return {
    type: "LOGOUT",
  };
};
export const userLoaded = (username) => {
  return {
    type: "USER_LOADED",
    username,
  };
};
export const userLoading = () => {
  return {
    type: "USER_LOADING",
  };
};
export const fetchUser = () => async (dispatch) => {
  dispatch(userLoading());
  const response = await getUserByToken();
  dispatch(userLoaded(response));
};
