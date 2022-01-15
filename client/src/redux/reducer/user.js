import { getUserByToken } from "../../auth/auth";
const initialState = {
  loading: false,
  username: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { loading: false, username: action.username };
    case "LOGOUT":
      return { ...state, username: null };
    case "USER_LOADED":
      return { loading: false, username: action.username };
    case "USER_LOADING":
      return { ...state, loading: true };

    default:
      return state;
  }
};
export default userReducer;
