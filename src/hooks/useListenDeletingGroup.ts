import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenDeletingGroup } from "@store/chatHubActions";

const useListenDeletingGroup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );

  useEffect(() => {
    dispatch(listenDeletingGroup());

    return () => {
      connection?.off("DeleteGroup");
      console.log("Stopped listening for deleting group");
    };
  }, [connection, dispatch]);
};

export default useListenDeletingGroup;
