import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { listenDeletingUser } from "@store/userActions";

const useListenDeletingUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );

  useEffect(() => {
    dispatch(listenDeletingUser());

    return () => {
      connection?.off("DeleteUser");
      console.log("Stopped listening for deleting user");
    };
  }, [connection, dispatch]);
};

export default useListenDeletingUser;
