import { isRejected, isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const errorHandlerMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action) || isRejected(action)) {
    toast.error(action.error.message || "An unexpected error occurred");
  }

  return next(action);
};
