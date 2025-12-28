import toast from "react-hot-toast";

import { type ThunkDispatch } from "@reduxjs/toolkit";
import { type RootState } from "@store";
import { type ChatHubMethods } from "./chatHubMethods";

interface ExecuteChatHubMethodParams {
  state: RootState;
  dispatch?: ThunkDispatch<any, any, any>;
  method: ChatHubMethods;
  successMessage?: string;
  thrownErrorMessage: string;
  caughtErrorMessage: string;
  action?: any;
  methodArgs?: any[];
  afterDispatchCallback?: () => void;
}

export const executeChatHubMethod = async ({
  state,
  dispatch,
  method,
  successMessage,
  thrownErrorMessage,
  caughtErrorMessage,
  action,
  afterDispatchCallback,
  methodArgs = [],
}: ExecuteChatHubMethodParams) => {
  const connection = state.chatHub.connection;
  if (connection?.state === "Connected") {
    try {
      console.log("Executing method: ", method, " with args: ", methodArgs);
      const isExecuted = await connection.invoke(method, ...methodArgs);

      if (!isExecuted) throw new Error(thrownErrorMessage);

      if (action && dispatch) dispatch(action);

      if (afterDispatchCallback) afterDispatchCallback();

      if (successMessage) toast.success(successMessage);
    } catch (error) {
      console.error(error);
      rethrowError(error, caughtErrorMessage);
    }
  }
};

function rethrowError(error: unknown, additionalMessage: string) {
  const errorMessage = error instanceof Error ? error.message : "";

  throw new Error(errorMessage || additionalMessage);
}
