import useListenCreatingGroup from "./useListenCreatingGroup";
import useListenDeletingGroup from "./useListenDeletingGroup";
import useListenDeletingUser from "./useListenDeletingUser";
import useListenGroupUsersChanges from "./useListenGroupUsersChanges";
import useListenMessages from "./useListenMessages";
import useListenUpdatingChatbox from "./useListenUpdatingChatbox";
import useListenUpdatingGroup from "./useListenUpdatingGroup";
import useListenUserActivityStatus from "./useListenUserActivityStatus";
import useListenUserChanges from "./useListenUserChanges";
import useStartConnection from "./useStartConnection";

const useMessangerActions = () => {
  useStartConnection();

  useListenUserActivityStatus();

  useListenMessages();

  useListenCreatingGroup();

  useListenUpdatingGroup();

  useListenUserChanges();

  useListenGroupUsersChanges();

  useListenDeletingUser();

  useListenUpdatingChatbox();

  useListenDeletingGroup();
};

export default useMessangerActions;
