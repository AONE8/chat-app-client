import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenUpdatedUiSettings } from "@store/userActions";

const useListenUserChanges = () => {
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listenUpdatedUiSettings());

    return () => {
      console.log("Stopped listening for user changes");
      connection?.off("UpdateUiSettings");
    };
  }, [connection, dispatch]);
};

export default useListenUserChanges;
