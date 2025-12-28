import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

import { type UserItem } from "./";
import { type Member } from "@/types/groupTypes";
import { type RootState } from "@store";

import UserItemCheckbox from "@components/UserItemCheckbox";
import { removeUsersFromGroup } from "@api/services/groupService";
import { membersSchema } from "@schemas/groupSchemas/membersSchema";

import { manageGroupModal } from "@contents/groupContent";

interface RemoveMembersSectionProps {
  groupMembers?: Member[];
}

const RemoveMembersSection: FC<RemoveMembersSectionProps> = ({
  groupMembers,
}) => {
  const groupId = useParams().groupId ?? "";
  const [removedUsers, setRemovedUsers] = useState<UserItem[]>([]);
  const [isOpenRemoveList, setIsOpenRemoveList] = useState(false);
  const plainUsers = groupMembers?.filter((member) => member.role === "user");
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const { mutate: removingMutate, isPending: isRemoving } = useMutation<
    unknown,
    Error,
    string[],
    unknown
  >({
    mutationFn: (userIdList) => removeUsersFromGroup(userIdList, groupId),
    onSuccess: (_, variables) => {
      const removedUsersName = removedUsers
        .filter((user) => variables.includes(user.id))
        .map((user) => user.name)
        .join(", ")
        .slice(0, -2);

      toast.success(`${removedUsersName} removed successfully!`);
      setRemovedUsers([]);
    },
    onError: (error) => toast.error(error.message),
  });

  function handleRemovingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const userId = e.target.id;
    const user = groupMembers?.find((user) => user.id === userId);
    if (user) {
      setRemovedUsers((prev) =>
        prev.some((u) => u.id === userId)
          ? prev.filter((u) => u.id !== userId)
          : [...prev, { id: user.id, name: user.name }]
      );
    }
  }

  function handleRejectRemoving(e: React.FormEvent) {
    e.preventDefault();
    setRemovedUsers([]);
  }

  function handleRemovingSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = removedUsers.map((user) => user.id);
    const result = membersSchema.safeParse(data);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    removingMutate(result.data);
  }

  return (
    <section className="mb-6 border-2 border-rose-500 rounded-lg p-3 ">
      <h3 className="text-rose-500  mb-2">
        {manageGroupModal.removing.title[lang]}
      </h3>
      <form onReset={handleRejectRemoving} onSubmit={handleRemovingSubmit}>
        <fieldset className="fieldset">
          <legend
            className="fieldset-legend cursor-pointer select-none text-sm"
            onClick={() => setIsOpenRemoveList((prev) => !prev)}
          >
            <span>{manageGroupModal.removing.listOfMembers[lang]}</span>
            {isOpenRemoveList ? <ChevronUp /> : <ChevronDown />}
          </legend>
          {isOpenRemoveList && !!plainUsers?.length && (
            <ul className="chatapp-user-list bg-rose-400/25">
              {plainUsers.map((user) => (
                <li key={user.id}>
                  <UserItemCheckbox
                    key={user.id}
                    id={user.id}
                    username={user.name}
                    alias={user.alias}
                    avatarUrl={user.avatarUrl}
                    checkboxName="users"
                    checked={removedUsers.some((u) => u.id === user.id)}
                    onChange={handleRemovingChange}
                    colorType="error"
                  />
                </li>
              ))}
            </ul>
          )}
        </fieldset>
        {removedUsers.length > 0 && (
          <div className="flex justify-between">
            <button type="reset" className="btn btn-neutral">
              {manageGroupModal.removing.btnLabels.reject[lang]}
            </button>
            <button
              type="submit"
              className="btn btn-error"
              disabled={!groupMembers || groupMembers.length === 0}
            >
              {isRemoving
                ? manageGroupModal.removing.btnLabels.removing[lang]
                : manageGroupModal.removing.btnLabels.removeUsers[lang](
                    removedUsers.length
                  )}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default RemoveMembersSection;
