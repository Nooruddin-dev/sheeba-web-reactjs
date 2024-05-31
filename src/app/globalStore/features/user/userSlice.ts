


import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    userData: any; // Define the structure of user data as per your requirements
}

const initialState: UserState = {
    userData: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { saveUserData } = userSlice.actions;

export default userSlice.reducer;