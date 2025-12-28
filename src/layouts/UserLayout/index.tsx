import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type AppDispatch, type RootState } from "@store";

import AsideHeader from "./AsideHeader";
import AsideMain from "./AsideMain";
import Retry from "./Retry";
import { getUserData } from "@api/services/userService";
import ChatCreationModal from "@components/ChatCreationModal";
import CreateChatButton from "@components/CreateChatButton/CreateChatButton";
import GroupCreationModal from "@components/GroupCreationModal";
import { absentChatBody } from "@contents/userContent";
import useMessangerActions from "@hooks/useMessangerActions";
import { userActions } from "@store/userSlice";
import { getChatList } from "@store/chatHubActions";
import AnimatedLogoLoader from "@/components/UI/AnimatedLogoLoader";

const UserLayout = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const chatModalRef = useRef<HTMLDialogElement>(null!);
  const groupModalRef = useRef<HTMLDialogElement>(null!);

  const {
    data,
    isError,
    error,
    isSuccess,
    isRefetchError,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: ({ signal }) => getUserData({ signal }),
    refetchInterval: 60000,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(userActions.setUser(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    document.documentElement.lang = user.profile?.language ?? "en";
  }, [user.profile?.language]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      user.isDarkMode ? "dark" : "light"
    );
  }, [user.isDarkMode]);

  useEffect(() => {
    dispatch(getChatList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.profile?.language, user.isShownOriginalText]);

  useEffect(() => {
    if (isError && error) {
      console.error(error);
      toast.error(
        error.message || "An error occurred while fetching user data."
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (isRefetchError) {
      toast.error("Failed to refetch user data.");
    }
  }, [isRefetchError]);

  useMessangerActions();

  const isUserPage = /^\/user\/?$/.test(location.pathname);

  if (isError) {
    return <Retry error={error} onRetry={() => refetch()} />;
  }

  if (isLoading)
    return <AnimatedLogoLoader className="chatapp-layout-loader" />;

  function openChatModal() {
    chatModalRef.current.showModal();
  }

  function openGroupModal() {
    groupModalRef.current.showModal();
  }

  if (isRefetchError) {
    return <p className="text-center">Error: Failed to refetch user data.</p>;
  }

  return (
    <div className="chatapp-user-layout">
      <aside className={`chatapp-aside ${isUserPage ? "block" : "hidden"}`}>
        <AsideHeader
          name={user.profile?.name}
          alias={user.profile?.alias}
          avatarUrl={user.profile?.avatarUrl}
          isOnline={user.profile?.isOnline}
        />

        <AsideMain />

        <CreateChatButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          openChatModal={openChatModal}
          openGroupModal={openGroupModal}
        />
      </aside>
      {!isUserPage && (
        <main className="flex flex-col h-screen relative">
          <Outlet />
        </main>
      )}

      {isUserPage && (
        <main className="hidden md:flex md:items-center md:justify-center">
          <p className="text-center">{absentChatBody[lang]}</p>
        </main>
      )}

      <ChatCreationModal ref={chatModalRef} />
      <GroupCreationModal ref={groupModalRef} />
    </div>
  );
};

export default UserLayout;
