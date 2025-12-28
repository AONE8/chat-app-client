import { createSlice } from "@reduxjs/toolkit";

import { type Token } from "@/types/tokenType";
import { parseToken } from "@/lib/parseToken";
import { refreshTokenAction } from "./authActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null as Token | null,
    isRefreshingToken: false,
  },
  reducers: {
    signup(state, action) {
      const token = action.payload.token as string;
      state.token = parseToken(token);
      state.isLoggedIn = true;
    },
    login(state, action) {
      const token = action.payload.token as string;
      state.token = parseToken(token);
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
    },
    refreshToken(state, action) {
      const token = action.payload.token;
      state.token = token ? parseToken(token) : null;
      state.isLoggedIn = !!token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshTokenAction.rejected, (state) => {
      state.isRefreshingToken = false;
    });
    builder.addCase(refreshTokenAction.pending, (state) => {
      state.isRefreshingToken = true;
    });
    builder.addCase(refreshTokenAction.fulfilled, (state) => {
      state.isRefreshingToken = false;
    });
  },
});

export const authActions = authSlice.actions;

export default authSlice;
