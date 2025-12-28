import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserX } from "lucide-react";

import { type RootState } from "@store";

import { removedUser } from "@contents/chatContent";

interface ChatRoomProps {
  id: string;
  name: string;
  message: string;
  avatarUrl?: string;
  time: string;
  count?: number;
  isRemoved: boolean;
}

const ChatItem: FC<ChatRoomProps> = ({
  id,
  name,
  message,
  time,
  count,
  avatarUrl,
  isRemoved,
}) => {
  const chatId = useParams()?.chatId;
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const isActiveChat = chatId === id;
  const date = new Date(time);
  const now = new Date();

  const dateDiffernce = now.getTime() - date.getTime();
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = new Intl.DateTimeFormat(lang, { weekday: "short" }).format(date);

  const dateTimeString =
    dateDiffernce / dayInMilliseconds < 1
      ? timeString
      : dateDiffernce / dayInMilliseconds < 7
      ? `${day}, ${timeString}`
      : date.toLocaleDateString();

  return (
    <Link to={isActiveChat ? "#" : "/user/chats/" + id} className=" ">
      <div
        className={`chat-item ${
          isActiveChat ? "bg-sky-100/50" : "active:bg-sky-100/50"
        }`}
      >
        <div
          className={`image-container ${
            isRemoved
              ? "bg-rose-300 dark:bg-rose-700"
              : "bg-emerald-300 dark:bg-emerald-700"
          }`}
        >
          {avatarUrl && (
            <img className="image" src={avatarUrl} alt={name} loading="lazy" />
          )}

          <p className="noavatar">
            {!isRemoved && name.charAt(0).toUpperCase()}
            {isRemoved && <UserX />}
          </p>
        </div>
        <div className="chat-item--info">
          <h4 className="chatname">{!isRemoved ? name : removedUser[lang]}</h4>

          <time className="chattime">{dateTimeString}</time>

          <p className="last-messsage">{message}</p>

          {count && <p className="message-count">{count}</p>}
        </div>
      </div>
    </Link>
  );
};

export default ChatItem;
