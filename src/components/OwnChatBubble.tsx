import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { AlarmClockCheck } from "lucide-react";

import { type RootState } from "@store";

import CmOnOwnMessage from "./ContextMenu/CMOnOwnMessage";
import TransparentBackdrop from "./UI/TransparentBackdrop";
import { updatedMessageMarker } from "@contents/chatContent";

interface OwnChatBubbleProps {
  children: React.ReactNode;
  id: string;
  createdAt: string;
  isUpdated: boolean;
  ref: React.RefObject<HTMLDivElement | null> | null;
}

const OwnChatBubble: FC<OwnChatBubbleProps> = ({
  children,
  createdAt,
  id,
  ref,
  isUpdated,
}) => {
  const [open, setOpen] = useState(false);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  function handleRightClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setOpen(true);
  }
  return (
    <div className="chat chat-end 2xl:chat-start" ref={ref}>
      {open && <TransparentBackdrop setOpen={setOpen} />}

      <div
        className="chat-bubble chat-bubble-accent"
        onContextMenu={handleRightClick}
      >
        <div className="z-50 absolute top-0 left-0 2xl:-right-3 -translate-y-1/2 -translate-x-[110%] 2xl:translate-x-[100%]">
          {open && (
            <CmOnOwnMessage
              id={id}
              content={children as string}
              setOpen={setOpen}
            />
          )}
        </div>
        <span>{children}</span>
        {isUpdated && (
          <span className="mt-2 flex 2xl:justify-end gap-2 text-xs text-lime-200">
            <AlarmClockCheck className="w-4 h-4" />
            <span>{updatedMessageMarker[lang]}</span>
          </span>
        )}
      </div>
      <div className="chat-footer opacity-50">
        <time className="text-xs opacity-50">{createdAt}</time>
      </div>
    </div>
  );
};

export default OwnChatBubble;
