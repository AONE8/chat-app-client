import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { UserX } from "lucide-react";

import { type RootState } from "@store";

import CMOnOtherMessage from "./ContextMenu/CMOnOtherMessage";
import TransparentBackdrop from "./UI/TransparentBackdrop";
import { removedUser, updatedMessageMarker } from "@contents/chatContent";

interface ChatBubbleProps {
  children: React.ReactNode;
  isGroup?: boolean;
  isUpdated?: boolean;
  avatarUrl?: string;
  username?: string;
  isOnline?: boolean;
  time: string;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

const ChatBubble: FC<ChatBubbleProps> = ({
  children,
  isGroup,
  avatarUrl,
  username,
  time,
  ref,
  isUpdated,
  isOnline,
}) => {
  const [open, setOpen] = useState(false);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";
  function handleRightClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setOpen(true);
  }

  return (
    <div className="chat chat-start" ref={ref}>
      {open && <TransparentBackdrop setOpen={setOpen} />}

      {isGroup && (
        <>
          <div className="chat-image avatar">
            {avatarUrl && (
              <div className="w-12 rounded-full absolute">
                <img src={avatarUrl} alt={username} loading="lazy" />
              </div>
            )}

            <div
              className={`noavatar-chat-image ${
                isOnline ? "avatar-online" : ""
              } ${!username ? "removed-user-bg" : ""}`}
            >
              <p>{username ? username?.charAt(0).toUpperCase() : <UserX />}</p>
            </div>
          </div>

          <div className="chat-header">
            {username ? username : removedUser[lang]}
          </div>
        </>
      )}

      <div className="chat-bubble" onContextMenu={handleRightClick}>
        <div className="z-50 absolute top-0 right-0 translate-x-[110%]">
          {open && (
            <CMOnOtherMessage content={children as string} setOpen={setOpen} />
          )}
        </div>
        <span>{children}</span>
        {isUpdated && (
          <span className="mt-2 block w-full text-right text-xs opacity-50 text-lime-700">
            {updatedMessageMarker[lang]}
          </span>
        )}
      </div>
      <div className="chat-footer opacity-50">
        <time className="text-xs opacity-50">{time}</time>
      </div>
    </div>
  );
};

export default ChatBubble;
