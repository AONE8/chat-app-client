import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Copy, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { type AppDispatch, type RootState } from "@store";

import ContextMenuWrapper from "./ContextMenuWrapper";
import { deleteMessage, getMessage } from "@store/chatHubActions";

import { contextMenu } from "@contents/chatContent";

interface CmOnOwnMessageProps {
  id: string;
  content: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CmOnOwnMessage: FC<CmOnOwnMessageProps> = ({ id, content, setOpen }) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const dispatch = useDispatch<AppDispatch>();

  function handleCopy() {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
    setOpen(false);
  }

  async function handleEdit() {
    await dispatch(getMessage({ messageId: id }));
    setOpen(false);
  }
  async function handleDelete() {
    await dispatch(deleteMessage({ messageId: id }));
    setOpen(false);
  }
  return (
    <ContextMenuWrapper>
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
      <li>
        <button
          type="button"
          className="flex w-full items-center gap-2 p-1 cursor-pointer *:shrink-0"
          onClick={handleEdit}
        >
          <Pencil className="w-4 h-4" />
          <span>{contextMenu.edit[lang]}</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          className="flex w-full items-center gap-2 p-1 cursor-pointer text-red-500"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
          <span>{contextMenu.delete[lang]}</span>
        </button>
      </li>
    </ContextMenuWrapper>
  );
};

export default CmOnOwnMessage;
