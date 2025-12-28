import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

import { type RootState } from "@store";

import ChatAction from "@components/ChatAction";
import useListenUpdatingChat from "@hooks/useListenUpdatingChat";

import { chatHeader, removedUser } from "@contents/chatContent";

interface ChatLayoutProps {
  children: React.ReactNode;
  name: string;
  profileId?: string;
  isGroup?: boolean;
  membersLength?: number;
  onlineUsersAmount?: number;
  isOnline?: boolean;
}

const ChatLayout: FC<ChatLayoutProps> = ({
  name,
  children,
  profileId,
  isGroup,
  membersLength,
  onlineUsersAmount,
  isOnline,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  useListenUpdatingChat();

  return (
    <>
      <header className="chatapp-header">
        <p className="chatapp-link-back">
          <Link to="/user">
            <ChevronLeft />
          </Link>
        </p>
        <Link
          to={
            profileId
              ? `/user/${isGroup ? "groups" : "users"}/${profileId}`
              : "#"
          }
        >
          <h1>{name ? name : removedUser[lang]}</h1>
          <p className="text-xs">
            {membersLength
              ? `${membersLength} ${chatHeader.members[lang]}${
                  onlineUsersAmount ? `, ${onlineUsersAmount} online` : ""
                }`
              : isOnline === undefined || isOnline === null
              ? "uknown"
              : isOnline
              ? "online"
              : "offline"}
          </p>
        </Link>
      </header>
      <main className="flex-grow overflow-y-auto">{children}</main>
      {name && profileId && (
        <footer className="chatapp-chat-footer">
          <ChatAction
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
          />
        </footer>
      )}
    </>
  );
};

export default ChatLayout;
