import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenUpdatingGroup } from "@store/chatHubActions";

const useListenUpdatingGroup = () => {
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listenUpdatingGroup());
    return () => {
      console.log("Stopped listening for updating group");
      connection?.off("ReceiveUpdatedGroupData");
    };
  }, [connection, dispatch]);
};

export default useListenUpdatingGroup;
