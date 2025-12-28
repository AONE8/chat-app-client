import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type UserItem } from "./";
import { type RootState } from "@store";

import UserSearchBar from "@/components/ModalComponents/UserSearchBar";
import useUserSearch from "@hooks/useUserSearch";
import { addUserToGroup } from "@api/services/groupService";
import { membersSchema } from "@schemas/groupSchemas/membersSchema";
import UserItemCheckbox from "@components/UserItemCheckbox";

import { manageGroupModal } from "@contents/groupContent";

interface AddMembersSectionProps {
  exceptions?: string[];
}

const AddMembersSection: FC<AddMembersSectionProps> = ({ exceptions }) => {
  const [addedUsers, setAddedUsers] = useState<UserItem[]>([]);
  const groupId = useParams().groupId ?? "";
  const [mutation, searchTerm, setSearchTerm] = useUserSearch(exceptions);
  const { data, mutate, isPending, reset, isError } = mutation;
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const { mutate: addingMutate, isPending: isAdding } = useMutation<
    unknown,
    Error,
    string[],
    unknown
  >({
    mutationFn: async (addedUsers) => addUserToGroup(addedUsers, groupId),
    onSuccess: () => {
      toast.success(
        `${addedUsers
          .map((au) => au.name)
          .join(", ")
          .slice(0, -2)} added successfully!`
      );

      setAddedUsers([]);
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleAddingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const userId = e.target.id;
    const user = data?.users.find((user) => user.id === userId);
    if (user) {
      setAddedUsers((prev) =>
        prev.some((u) => u.id === userId)
          ? prev.filter((u) => u.id !== userId)
          : [...prev, { id: user.id, name: user.name }]
      );
    }
  }

  function handleAddingSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = addedUsers.map((au) => au.id);

    const result = membersSchema.safeParse(data);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    addingMutate(result.data);
  }

  function handleRejectAdding(e: React.FormEvent) {
    e.preventDefault();
    setAddedUsers([]);
    reset();
  }

  return (
    <section className="mb-6 border-2 border-purple-400 rounded-lg p-3 ">
      <h3 className="text-purple-400 mb-2">
        {manageGroupModal.adding.title[lang]}
      </h3>
      <UserSearchBar
        mutate={mutate}
        isPending={isPending}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {isError && (
        <p className="text-center mt-2">
          {manageGroupModal.adding.notFound[lang]}
        </p>
      )}
      {data && (
        <form
          onReset={handleRejectAdding}
          className="mt-4 flex flex-col gap-4"
          onSubmit={handleAddingSubmit}
        >
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {manageGroupModal.adding.proposedUsers[lang]}
            </legend>
            <ul className="chatapp-user-list bg-purple-400/25">
              {data?.users.map((user) => (
                <li key={user.id}>
                  <UserItemCheckbox
                    key={user.id}
                    id={user.id}
                    username={user.name}
                    alias={user.alias}
                    avatarUrl={user.avatarUrl}
                    checkboxName="users"
                    checked={addedUsers.some((u) => u.id === user.id)}
                    onChange={handleAddingChange}
                    colorType="primary"
                  />
                </li>
              ))}
            </ul>
          </fieldset>
          {addedUsers.length > 0 && (
            <div className="flex justify-between">
              <button type="reset" className="btn btn-neutral">
                {manageGroupModal.adding.reject[lang]}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!data || data.users.length === 0 || isAdding}
              >
                {isAdding
                  ? manageGroupModal.adding.process[lang]
                  : manageGroupModal.adding.addUsers[lang](addedUsers.length)}
              </button>
            </div>
          )}
        </form>
      )}
    </section>
  );
};

export default AddMembersSection;
