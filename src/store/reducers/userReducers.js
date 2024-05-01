import { createSlice } from "@reduxjs/toolkit";

const userInitialState = { userInfo: null };

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUserInfo(state, actions) {
      state.userInfo = actions.payload;
    },
    resetUserInfo(state, actions) {
      state.userInfo = null;
    },
  },
});

const userAction = userSlice.actions;
const userReducer = userSlice.reducer;

export { userAction, userReducer };
