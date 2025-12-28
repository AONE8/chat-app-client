import { FC } from "react";
import { useSelector } from "react-redux";

import { type Member } from "@/types/groupTypes";
import { type RootState } from "@store";

import Modal from "@components/UI/Modal";
import AddMembersSection from "./AddMembersSection";
import RemoveMembersSection from "./RemoveMembersSection";
import ManageAdminSection from "./ManageAdminSection";

import { manageGroupModal } from "@contents/groupContent";

export interface UserItem {
  id: string;
  name: string;
}

interface ManageGroupModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  exceptions?: string[];
  onClose: () => void;
  groupMembers?: Member[];
  isOwner: boolean;
}

const ManageGroupModal: FC<ManageGroupModalProps> = ({
  ref,
  onClose,
  exceptions,
  groupMembers,
  isOwner,
}) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  return (
    <Modal
      title={manageGroupModal.title[lang]}
      onClose={onClose}
      ref={ref as React.RefObject<HTMLDialogElement>}
    >
      <AddMembersSection exceptions={exceptions} />
      <RemoveMembersSection groupMembers={groupMembers} />
      {isOwner && <ManageAdminSection groupMembers={groupMembers} />}
    </Modal>
  );
};

export default ManageGroupModal;
