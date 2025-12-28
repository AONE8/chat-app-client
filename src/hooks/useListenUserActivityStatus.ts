import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenUserActivityStatus } from "@store/chatHubActions";

const useListenUserActivityStatus = () => {
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listenUserActivityStatus());

    return () => {
      console.log("Stopped listening for user's activity status");
      connection?.off("GetUserActiveStatus");
    };
  }, [connection, dispatch]);
};

export default useListenUserActivityStatus;
