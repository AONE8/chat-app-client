import toast from "react-hot-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { type LoginRequest } from "@/types/authTypes";
import { type RootState } from "@store";

import { authActions } from "./authSlice";
import { userActions } from "./userSlice";
import httpClient from "@api/httpClient";
import { restHandlerAction } from "@/lib/restHandlerAction";
import { rethrowError } from "@/lib/rethrowError";

const {
  VITE_SIGNUP_URL,
  VITE_LOGIN_URL,
  VITE_LOGOUT_URL,
  VITE_REFRESH_TOKEN_URL,
} = import.meta.env;

export const signupAction = createAsyncThunk(
  "auth/signup",
  (formData: FormData, { dispatch }) => {
    return restHandlerAction(
      VITE_SIGNUP_URL,
      {
        method: "POST",
        body: formData,
        defaultErrorMessage: "An error occurred during signing up.",
      },
      (data) => {
        dispatch(
          authActions.signup({
            token: data.token,
          })
        );

        toast.success("Signed up successfully!");
      }
    );
  }
);

export const loginAction = createAsyncThunk(
  "auth/login",
  (loginRequest: LoginRequest, { dispatch }) => {
    return restHandlerAction(
      VITE_LOGIN_URL,
      {
        method: "POST",
        body: loginRequest,
        defaultErrorMessage: "An error occurred during logging in.",
      },
      (data) => {
        dispatch(
          authActions.login({
            token: data.token,
          })
        );

        toast.success("Logged in successfully!");
      }
    );
  }
);

export const logoutAction = createAsyncThunk(
  "auth/logout",
  (_, { dispatch, getState }) => {
    const token = (getState() as RootState).auth.token;

    console.log("Logout clicked 2");
    return restHandlerAction(
      VITE_LOGOUT_URL,
      {
        method: "POST",
        authToken: token?.raw || "",
        defaultErrorMessage: "An error occurred during logging out.",
      },
      () => {
        dispatch(authActions.logout());
        dispatch(userActions.resetUser());
        httpClient.clear();
        toast.success("Logged out successfully!");
      }
    );
  }
);

export const refreshTokenAction = createAsyncThunk(
  "auth/refreshToken",
  async (_, { dispatch }) => {
    try {
      const response = await fetch(VITE_REFRESH_TOKEN_URL, {
        credentials: "include",
      });

      if (response.status === 404) {
        dispatch(authActions.refreshToken({ token: null }));
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to refresh token");
      }

      const data = await response.json();

      dispatch(authActions.refreshToken({ token: data.token }));
    } catch (error) {
      dispatch(authActions.refreshToken({ token: null }));

      rethrowError(error, "Failed to refresh token.");
    }
  }
);
