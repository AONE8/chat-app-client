import { FC, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Input from "./Input";
import Modal from "./UI/Modal";
import { deleteGroup } from "@api/services/groupService";

interface ConfirmDeleteGroupModalProps {
  ref: React.RefObject<HTMLDialogElement>;
  onClose?: () => void;
  groupName: string;
}

const ConfirmDeleteGroupModal: FC<ConfirmDeleteGroupModalProps> = ({
  ref,
  onClose,
  groupName: currentGroupName,
}) => {
  const groupId = useParams().groupId!;
  const formRef = useRef<HTMLFormElement>(null!);
  const navigator = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteGroup", groupId],
    mutationFn: (groupName: string) => deleteGroup(groupId!, groupName),
    onSuccess: () => {
      handleClose();
      toast.success(`Group deleted successfully!`);
      navigator("/user", { replace: true });
    },
    onError: (error) => {
      toast.error("Failed deleting group!");
      toast.error(error.message);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const groupName = (formData.get("groupName") as string).trim();

    if (groupName !== currentGroupName) toast.error("Invalid group name!");

    mutate(groupName);
  }

  function handleClose() {
    if (onClose) onClose();
    formRef.current?.reset();
  }

  return (
    <Modal title="Delete Group" ref={ref} onClose={handleClose}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <p>Are you sure you want to delete this group?</p>
        <Input
          title="Group Name"
          name="Group Name"
          placeholder="Confirm the current group name"
          type="text"
          required
        />
        <div className="flex justify-end mt-6">
          <button className="btn btn-error" disabled={isPending}>
            {isPending ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmDeleteGroupModal;
