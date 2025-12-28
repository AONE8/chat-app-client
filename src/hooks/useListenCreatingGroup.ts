import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenCreatingGroup } from "@store/chatHubActions";

const useListenCreatingGroup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );

  useEffect(() => {
    dispatch(listenCreatingGroup());

    return () => {
      connection?.off("ReceiveNewGroup");
      console.log("Stopped listening for creating groups");
    };
  }, [connection, dispatch]);
};

export default useListenCreatingGroup;
