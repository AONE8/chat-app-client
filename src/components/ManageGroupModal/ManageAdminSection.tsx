import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type Member } from "@/types/groupTypes";
import { type RootState } from "@store";

import {
  addToAdminList,
  removeFromAdminList,
} from "@api/services/groupService";
import UserItemCheckbox from "@components/UserItemCheckbox";

import { manageGroupModal } from "@contents/groupContent";

interface ManageAdminSectionProps {
  groupMembers?: Member[];
}

const ManageAdminSection: FC<ManageAdminSectionProps> = ({ groupMembers }) => {
  const groupId = useParams().groupId ?? "";
  const adminList = groupMembers?.filter((member) => member.role === "admin");
  const userList = groupMembers?.filter((member) => member.role === "user");
  const [removedAdmins, setRemovedAdmins] = useState<
    { id: string; name: string }[]
  >([]);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const { mutate: addingMutate, isPending: isAdding } = useMutation<
    unknown,
    Error,
    string,
    unknown
  >({
    mutationFn: async (addedUser) => addToAdminList(addedUser, groupId),
    onSuccess: (_, addedUser) => {
      const name = groupMembers?.find((user) => user.id === addedUser)?.name;

      toast.success(`${name} added to admin list successfully!`);
    },
    onError: (error) => {
      toast.error("Failed adding to Admin List!");
      toast.error(error.message);
    },
  });

  const { mutate: removingMutate, isPending: isRemoving } = useMutation<
    unknown,
    Error,
    string[],
    unknown
  >({
    mutationFn: async (admins) => removeFromAdminList(admins, groupId),
    onSuccess: (_, removedUsers) => {
      const names = groupMembers
        ?.filter((user) => removedUsers.includes(user.id))
        .map((u) => u.name)
        .join(", ");

      toast.success(`${names} removed from admin list successfully!`);
      setRemovedAdmins([]);
    },
    onError: (error) => {
      toast.error("Failed removing from Admin List!");
      toast.error(error.message);
    },
  });

  function handleAddToAdminList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get("user") as string;

    addingMutate(user);
  }

  function handleRemoveFromAdminList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const users = formData.getAll("admins") as string[];
    removingMutate(users);
  }

  function handleRemovingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const userId = e.target.id;
    const user = adminList?.find((user) => user.id === userId);
    if (user) {
      setRemovedAdmins((prev) =>
        prev.some((u) => u.id === userId)
          ? prev.filter((u) => u.id !== userId)
          : [...prev, { id: user.id, name: user.name }]
      );
    }
  }

  function handleRejectRemoving(e: React.FormEvent) {
    e.preventDefault();
    setRemovedAdmins([]);
  }

  return (
    <section className="border-2 border-sky-500 rounded-lg p-3 ">
      <h3 className="text-sky-500 mb-4">
        {manageGroupModal.manageAdmins.title[lang]}
      </h3>
      <form
        className="flex justify-between gap-8 mb-2"
        onSubmit={handleAddToAdminList}
      >
        <select
          defaultValue="Chose new admin for your group"
          className="select select-info"
          name="user"
        >
          <option disabled={true}>
            {manageGroupModal.manageAdmins.selectPlaceholder[lang]}
          </option>
          {userList?.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <button className="btn btn-info" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add admin"}
        </button>
      </form>
      {!!adminList?.length && (
        <form
          onSubmit={handleRemoveFromAdminList}
          onReset={handleRejectRemoving}
        >
          <fieldset className="fieldset">
            <ul className="chatapp-user-list bg-sky-400/25">
              {adminList
                ?.filter((member) => member.role === "admin")
                .map((user) => (
                  <li key={user.id}>
                    <UserItemCheckbox
                      key={user.id}
                      id={user.id}
                      username={user.name}
                      alias={user.alias}
                      avatarUrl={user.avatarUrl}
                      checkboxName="admins"
                      checked={removedAdmins.some((u) => u.id === user.id)}
                      onChange={handleRemovingChange}
                      colorType="info"
                    />
                  </li>
                ))}
            </ul>
          </fieldset>
          {removedAdmins.length > 0 && (
            <div className="flex justify-between">
              <button type="reset" className="btn btn-neutral">
                {manageGroupModal.manageAdmins.btnLabels.reject[lang]}
              </button>
              <button
                type="submit"
                className="btn btn-error"
                disabled={!groupMembers || groupMembers.length === 0}
              >
                {isRemoving
                  ? manageGroupModal.manageAdmins.btnLabels.removing[lang]
                  : manageGroupModal.manageAdmins.btnLabels.removeUsers[lang](
                      removedAdmins.length
                    )}
              </button>
            </div>
          )}
        </form>
      )}
      {!adminList?.length && (
        <p className="text-center">
          {manageGroupModal.manageAdmins.noAdmin[lang]}
        </p>
      )}
    </section>
  );
};

export default ManageAdminSection;
