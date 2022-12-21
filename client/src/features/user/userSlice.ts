import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse, UserData, UserState } from 'types.ts/UserTypes';

const data =
  localStorage.getItem('userData') !== null
    ? JSON.parse(String(localStorage.getItem('userData')))
    : {
        token: '',
        userData: {
          _id: '',
          firstName: '',
          lastName: '',
          email: '',
          profilePicture: '',
          isAdmin: false,
          borrowedBooks: [],
          createdAt: new Date(0),
        },
        isLoggedIn: false,
      };

const initialState: UserState = {
  data: data,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginResponse>) => {
      const { token, userData } = action.payload;
      state.data.token = token;
      state.data.userData = userData;
      state.data.isLoggedIn = true;
      localStorage.setItem('userData', JSON.stringify(state.data));
    },
    logout: (state) => {
      state.data = {
        token: '',
        userData: {
          _id: '',
          firstName: '',
          lastName: '',
          email: '',
          profilePicture: '',
          isAdmin: false,
          borrowedBooks: [],
          createdAt: new Date(0),
        },
        isLoggedIn: false,
      };
      localStorage.setItem('userData', JSON.stringify(state.data));
    },
    updateAdmin: (state, action: PayloadAction<boolean>) => {
      state.data.userData.isAdmin = action.payload;
      localStorage.setItem('userData', JSON.stringify(state.data));
    },
    updateProfile: (state, action: PayloadAction<UserData>) => {
      const userData = action.payload;
      state.data.userData = userData;
      localStorage.setItem('userData', JSON.stringify(state.data));
    },
  },
});

export const { login, logout, updateAdmin, updateProfile } = userSlice.actions;

export default userSlice.reducer;
