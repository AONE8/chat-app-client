import { FC } from "react";
import { useSelector } from "react-redux";
import { PenLine, Pickaxe, SquarePen } from "lucide-react";

import { type RootState } from "@store";

import { createChatBtn } from "@contents/userContent";

interface CreateChatButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openChatModal: () => void;
  openGroupModal: () => void;
}

const CreateChatButton: FC<CreateChatButtonProps> = ({
  isOpen,
  setIsOpen,
  openChatModal,
  openGroupModal,
}) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  function handleClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  return (
    <>
      {isOpen && (
        <div
          className="absolute top-0 left-0 bg-emerald-100/75 w-screen h-screen z-100"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="absolute bottom-10 right-6">
        {isOpen && (
          <div className="new-chat-cm">
            <button
              className="btn btn-soft btn-primary cursor-pointer"
              onClick={() => {
                openChatModal();
                setIsOpen(false);
              }}
            >
              <PenLine /> <span>{createChatBtn.writeToSomeone[lang]}</span>
            </button>
            <button
              className="btn btn-soft btn-accent cursor-pointer"
              onClick={() => {
                openGroupModal();
                setIsOpen(false);
              }}
            >
              <Pickaxe /> <span>{createChatBtn.createGroup[lang]}</span>
            </button>
          </div>
        )}

        <button className="new-chat-btn" onClick={handleClick}>
          <SquarePen />
        </button>
      </div>
    </>
  );
};

export default CreateChatButton;
