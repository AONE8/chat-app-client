import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { type AppDispatch } from "@store";

import {
  initializeChatHubConnection,
  stopChatHubConnection,
} from "../store/chatHubActions";

const useStartConnection = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeChatHubConnection());

    return () => {
      dispatch(stopChatHubConnection());
    };
  }, [dispatch]);
};

export default useStartConnection;
