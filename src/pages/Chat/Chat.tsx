import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { type RootState } from "@store";
import { type ChatRoom } from "@/types/chatTypes";

import ChatLayout from "@layouts/ChatLayout";
import OwnChatBubble from "@components/OwnChatBubble";
import ChatBubble from "@components/ChatBubble";
import { getChatRoom } from "@api/services/chatService";

import { today } from "@contents/chatContent";
import Loader from "@/components/UI/Loader";

const isToday = (date: string) => date === new Date().toLocaleDateString();

const Chat = () => {
  const chatId = useParams().chatId!;
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";
  const token = useSelector((state: RootState) => state.auth.token);

  const { data, isLoading } = useQuery<ChatRoom | null>({
    queryKey: ["chats", { chatId }],
    queryFn: async ({ signal }) => getChatRoom({ chatId: chatId, signal }),
  });

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.messages]);

  if (isLoading) return <Loader />;

  const DateSet = new Set<string>();

  const allUsers = [...(data?.users ?? []), ...(data?.deletedUsers ?? [])];

  console.log(allUsers);

  return (
    <ChatLayout
      name={data?.name || ""}
      profileId={data?.profileId}
      isGroup={data?.isGroup}
      membersLength={data?.isGroup ? data?.users.length : undefined}
      onlineUsersAmount={
        data?.isGroup ? data?.users.filter((u) => u.isOnline).length : undefined
      }
      isOnline={data?.isGroup ? undefined : data?.isOnline}
    >
      <div className="pb-2 px-2">
        {data?.messages.length === 0 && (
          <p className="bg-base-300 mt-4 py-2 px-4 w-fit rounded-full mx-auto">
            No messages
          </p>
        )}
        {data?.messages &&
          data?.messages.length > 0 &&
          data?.messages.map((message, index) => {
            const isOwner = message.senderId === token?.user?.id;
            const createdAtDate = new Date(message.createdAt);

            const time = createdAtDate.toLocaleTimeString(lang, {
              hour: "2-digit",
              minute: "2-digit",
            });

            const dateString = createdAtDate.toLocaleDateString(lang, {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            const user = allUsers.find((user) => user.id === message.senderId);

            let content = isOwner ? (
              <OwnChatBubble
                id={message.id}
                key={message.id}
                createdAt={time}
                isUpdated={message.isUpdated}
                ref={
                  index === data?.messages.length - 1 ? lastMessageRef : null
                }
              >
                {message.content}
              </OwnChatBubble>
            ) : (
              <ChatBubble
                key={message.id}
                time={time}
                avatarUrl={user?.avatarUrl}
                username={user?.name}
                isGroup={data.isGroup}
                isUpdated={message.isUpdated}
                isOnline={user?.isOnline}
                ref={
                  index === data?.messages.length - 1 ? lastMessageRef : null
                }
              >
                {message.content}
              </ChatBubble>
            );

            if (!DateSet.has(dateString)) {
              DateSet.add(dateString);
              content = (
                <>
                  <p
                    className="bg-base-300 my-4 py-2 px-4 w-fit rounded-full mx-auto"
                    key={dateString}
                  >
                    {isToday(createdAtDate.toLocaleDateString())
                      ? today[lang]
                      : dateString}
                  </p>
                  {content}
                </>
              );
            }

            return content;
          })}
      </div>
    </ChatLayout>
  );
};

export default Chat;
