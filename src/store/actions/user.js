import { userAction } from "../reducers/userReducers";

export const logout = () => (dispatch) => {
  dispatch(userAction.resetUserInfo());
  localStorage.removeItem("account");
};
