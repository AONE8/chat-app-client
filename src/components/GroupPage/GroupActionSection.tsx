import { FC } from "react";
import { Link } from "react-router-dom";
import { useMutationState } from "@tanstack/react-query";

import {
  chatGroupBtn,
  deleteGroupBtn,
  editGroupBtn,
} from "@contents/groupContent";

interface GroupActionSectionProps {
  chatId: string;
  isAdmin: boolean;
  isOwner: boolean;
  lang: "en" | "uk";
  groupId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteGroup: () => void;
}

const GroupActionSection: FC<GroupActionSectionProps> = ({
  chatId,
  lang,
  isAdmin,
  isOwner,
  groupId,
  setIsEditing,
  onDeleteGroup,
}) => {
  const isPending = useMutationState({
    filters: {
      mutationKey: ["deleteGroup", groupId],
      status: "pending",
      exact: true,
    },
    select: (state) => state.state.status === "pending",
  })[0];

  return (
    <section className="chatapp-action-section">
      <Link to={`/user/chats/${chatId}`} className="btn btn-outline btn-info">
        {chatGroupBtn[lang]}
      </Link>
      {(isAdmin || isOwner) && (
        <button
          className="btn btn-outline btn-warning"
          onClick={() => setIsEditing(true)}
          disabled={isPending}
        >
          {editGroupBtn[lang]}
        </button>
      )}
      {isOwner && (
        <button
          className="btn btn-outline btn-error"
          onClick={onDeleteGroup}
          disabled={!isOwner || isPending}
        >
          {deleteGroupBtn[lang]}
        </button>
      )}
    </section>
  );
};

export default GroupActionSection;
