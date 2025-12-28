import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import {
  listenDeletingMessages,
  listenUpdatingMessage,
} from "@store/chatHubActions";

const useListenUpdatingChat = () => {
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listenUpdatingMessage());
    dispatch(listenDeletingMessages());

    return () => {
      console.log("Stopped listening for updating chat");
      connection?.off("ReceiveUpdatingResult");
      connection?.off("ReceiveDeletingResult");
    };
  }, [connection, dispatch]);
};

export default useListenUpdatingChat;
