import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import userSlice from "./userSlice";
import chatHubSlice from "./chatHubSlice";
import { errorHandlerMiddleware } from "./errorHandlerMiddleware";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    chatHub: chatHubSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "chatHub/setConnection",
          "chatHub/initialize",
          "chatHub/initialize/fulfilled",
        ],
        ignoredPaths: ["chatHub.connection"],
      },
    }).concat(errorHandlerMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
