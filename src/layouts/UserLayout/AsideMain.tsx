import { useSelector } from "react-redux";

import { type RootState } from "@store";

import ChatItem from "@components/ChatItem/ChatItem";
import Loader from "@components/UI/Loader";

import { absentChats, sidebarTitle } from "@contents/userContent";

const AsideMain = () => {
  const chats = useSelector((state: RootState) => state.chatHub.chats);
  const isLoadingChats = useSelector(
    (state: RootState) => state.chatHub.isLoadingChats
  );
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const isChatsEmpty = chats?.length === 0;

  return (
    <main className="aside-main">
      <h2 className="heading">{sidebarTitle[lang]}</h2>
      {isLoadingChats && (
        <div className="flex justify-center">
          <span className="loading loading-spinner text-accent"></span>
        </div>
      )}
      {isChatsEmpty && !isLoadingChats && (
        <p className="text-center text-gray-500">{absentChats[lang]}</p>
      )}
      {!isChatsEmpty && !isLoadingChats && (
        <ul className="chatbox-list">
          {chats?.map((chat, idx) => (
            <li
              key={chat.id}
              className={`chatapp-list-item ${
                idx !== 0
                  ? "border-b border-emerald-400 dark:border-emerald-800"
                  : ""
              }`}
            >
              <ChatItem
                id={chat.id}
                name={chat.name}
                message={chat.lastMessage}
                time={chat.lastMessageTime}
                avatarUrl={chat.avatarUrl}
                isRemoved={chat.isRemoved}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default AsideMain;
