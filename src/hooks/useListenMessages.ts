import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenMessages } from "@store/chatHubActions";

const useListenMessages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );

  useEffect(() => {
    dispatch(listenMessages());

    return () => {
      connection?.off("ReceiveMessage");
      console.log("Stopped listening for messages");
    };
  }, [connection, dispatch]);
};

export default useListenMessages;
