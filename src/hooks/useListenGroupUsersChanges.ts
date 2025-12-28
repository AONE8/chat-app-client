import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import {
  listenAddingUsersToGroup,
  listenManagingAdminList,
  listenRemovingUsersFromGroup,
} from "@store/chatHubActions";

const useListenGroupUsersChanges = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connection = useSelector(
    (state: RootState) => state.chatHub.connection
  );

  useEffect(() => {
    dispatch(listenAddingUsersToGroup());
    dispatch(listenRemovingUsersFromGroup());
    dispatch(listenManagingAdminList());

    return () => {
      connection?.off("ReceiveAddedUsersInGroup");
      connection?.off("RemoveUsersFromGroup");
      connection?.off("RemoveUserFromGroup");
      connection?.off("RemoveFromChatAndGroup");
      connection?.off("ReceiveUpdatedAdminList");
      console.log("Stopped listening user changes in group");
    };
  }, [connection, dispatch]);
};

export default useListenGroupUsersChanges;
