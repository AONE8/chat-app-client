import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenUpdatingChatBox } from "@store/chatHubActions";

const useListenUpdatingChatbox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );
  useEffect(() => {
    dispatch(listenUpdatingChatBox());

    return () => {
      connection?.off("UpdateChatListBox");
    };
  }, [dispatch, connection]);
};

export default useListenUpdatingChatbox;
