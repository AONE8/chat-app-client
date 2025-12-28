import { FC, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type AppDispatch, type RootState } from "@store";

import Modal from "./UI/Modal";
import Input from "./Input";
import { userPassword } from "@schemas/userSchemas";
import { logoutAction } from "@store/authActions";
import { deleteUserModal } from "@contents/userProfileContent";
import { confirmUserDeleting } from "@api/services/userService";

interface DeleteUserModalProps {
  ref: React.RefObject<HTMLDialogElement>;
  onClose: (formEl: React.RefObject<HTMLFormElement>) => void;
}

const DeleteUserModal: FC<DeleteUserModalProps> = ({ ref, onClose }) => {
  const formRef = useRef<HTMLFormElement>(null!);
  const dispatch = useDispatch<AppDispatch>();
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const { mutate, isPending } = useMutation({
    mutationFn: (password: string) => confirmUserDeleting(password),
    onSuccess: () => {
      onClose(formRef);
      dispatch(logoutAction());
    },
    onError: (error) => toast.error(error.message),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const validationResult = userPassword.safeParse({ password });

    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      return;
    }

    mutate(validationResult.data.password);
  }

  return (
    <Modal
      title={deleteUserModal.title[lang]}
      onClose={() => onClose(formRef)}
      ref={ref}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <p>{deleteUserModal.question[lang]}</p>
        <Input
          type="password"
          title={deleteUserModal.input.name[lang]}
          placeholder={deleteUserModal.input.placeholder[lang]}
          name={deleteUserModal.input.name.en}
          required
        />
        <div className="flex justify-end mt-6">
          <button className="btn btn-error" disabled={isPending}>
            {isPending
              ? deleteUserModal.confirming[lang]
              : deleteUserModal.confirm[lang]}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteUserModal;
