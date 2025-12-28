import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SendHorizontal, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import { type AppDispatch, type RootState } from "@store";

import { sendMessage, updateMessage } from "@store/chatHubActions";
import { messagePlaceholder } from "@contents/chatContent";
import { chatHubActions } from "@store/chatHubSlice";

interface ChatActionProps {
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatAction: FC<ChatActionProps> = ({
  showEmojiPicker,
  setShowEmojiPicker,
}) => {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const isPending = useSelector((state: RootState) => state.chatHub.isPending);
  const lang = useSelector((state: RootState) => state.user.profile?.language);
  const editingMessage = useSelector(
    (state: RootState) => state.chatHub.editingMessage
  );

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
    }
  }, [editingMessage]);

  if (!chatId) return <div className="text-red-500">Chat ID is missing</div>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    if (editingMessage) {
      await dispatch(
        updateMessage({ messageId: editingMessage.messageId, content: message })
      );
      dispatch(chatHubActions.setEditingMessage(undefined));
    } else {
      await dispatch(sendMessage({ chatId, content: message }));
    }

    setMessage("");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form
      className="flex items-end gap-2 max-w-3xl w-full"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
      >
        <Smile />
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-6">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <textarea
        placeholder={messagePlaceholder[lang ?? "en"]}
        className="w-full focus:outline-none resize-none h-auto"
        name="message"
        value={message}
        onChange={(e) => {
          const MAX_MESSAGE_LENGTH = 320;
          const value = e.target.value;

          if (message.length < MAX_MESSAGE_LENGTH) setMessage(value);
          else setMessage(value.slice(0, MAX_MESSAGE_LENGTH));
        }}
        rows={1}
        onInput={(e) => {
          const textarea = e.target as HTMLTextAreaElement;
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) form.requestSubmit();
          }
        }}
      ></textarea>

      <button type="submit" className="cursor-pointer" disabled={isPending}>
        {!isPending ? (
          <SendHorizontal />
        ) : (
          <span className="loading loading-spinner loading-md"></span>
        )}
      </button>
    </form>
  );
};

export default ChatAction;
