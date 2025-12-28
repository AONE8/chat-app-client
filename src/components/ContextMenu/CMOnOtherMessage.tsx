import { FC } from "react";
import { useSelector } from "react-redux";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

import { type RootState } from "@store";

import ContextMenuWrapper from "./ContextMenuWrapper";

import { contextMenu } from "@contents/chatContent";

interface CmOnOwnMessageProps {
  content: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CMOnOtherMessage: FC<CmOnOwnMessageProps> = ({ content, setOpen }) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  function handleCopy() {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
    setOpen(false);
  }

  return (
    <ContextMenuWrapper isFromLeft>
      <li>
        <button
          type="button"
          className="flex w-full items-center gap-2 p-1 cursor-pointer"
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4" />
          <span>{contextMenu.copy[lang]}</span>
        </button>
      </li>
    </ContextMenuWrapper>
  );
};

export default CMOnOtherMessage;
