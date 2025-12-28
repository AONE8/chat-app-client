import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { UserSearch, X } from "lucide-react";
import toast from "react-hot-toast";

import { type RootState } from "@store";

import Input from "./Input";
import UserSearchBar from "./ModalComponents/UserSearchBar";
import Modal from "./UI/Modal";
import UserItemCheckbox from "./UserItemCheckbox";
import ImageInput from "./ImageInput";
import useUserSearch from "@hooks/useUserSearch";
import { groupCreationData } from "@schemas/groupSchemas/createGroupSchema";
import { addUsersSection, groupCreationModal } from "@contents/userContent";
import { createGroup } from "@api/services/groupService";
import { toFormData } from "@lib/toFormData";

const GroupCreationModal = ({
  ref,
}: {
  ref: React.RefObject<HTMLDialogElement>;
}) => {
  const imageRef = useRef({ imageReset: () => {} });
  const lastUserItemRef = useRef<HTMLLIElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null!);
  const [mutation, searchTerm, setSearchTerm] = useUserSearch();
  const [errorsMap, setErrorsMap] = useState(new Map<string, string>());
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; name: string }[]
  >([]);
  const navigate = useNavigate();
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const { mutate: creationMutate, isPending: isCreationPending } = useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Error,
    FormData,
    unknown
  >({
    mutationFn: (formData) => createGroup(formData),
    onSuccess: (data) => {
      navigate(`/user/groups/${data.groupId}`);
      handleCloseModale();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data, isPending, isError, error, reset, mutate } = mutation;

  useEffect(() => {
    if (lastUserItemRef.current) {
      lastUserItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const userId = e.target.id;
    const user = data?.users.find((user) => user.id === userId);
    if (user) {
      setSelectedUsers((prev) => {
        if (prev.some((u) => u.id === userId)) {
          return prev.filter((u) => u.id !== userId);
        } else {
          return [...prev, user];
        }
      });
    }
  }

  function handleClose(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const input = target.closest("p")?.querySelector("input[type='checkbox']");

    if (input) {
      const userId = input.id;
      setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = groupCreationData.safeParse({
      ...Object.fromEntries(formData.entries()),
      users: formData.getAll("users") as string[],
    });

    if (!result.success) {
      const newErrorsMap = new Map();
      const errors = result.error.issues;

      errors.forEach((error) => {
        newErrorsMap.set(error.path[0].toString(), error.message);
      });

      setErrorsMap(newErrorsMap);

      toast.error("Invalid group data");
      return;
    }

    if (errorsMap.size > 0) setErrorsMap(new Map());

    const newFormData = toFormData(result.data);

    creationMutate(newFormData);
  }

  function handleCloseModale() {
    ref.current?.close();
    formRef.current.reset();
    setSelectedUsers([]);
    imageRef.current.imageReset();
    reset();
  }

  return (
    <Modal
      ref={ref}
      title={groupCreationModal.title[lang]}
      onClose={handleCloseModale}
    >
      {errorsMap.get("users") && (
        <p className="text-xs text-red-500">{errorsMap.get("users")}</p>
      )}
      <form onSubmit={handleSubmit} ref={formRef}>
        {selectedUsers.length > 0 && (
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
            <h4 className="mb-4">
              {groupCreationModal.addedUsers[lang]} ({selectedUsers.length})
            </h4>

            <ul className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <li key={user.id}>
                  <p
                    className={`flex items-center bg-amber-500 px-2 py-1 rounded-lg`}
                  >
                    <label>
                      <input
                        type="checkbox"
                        className="hidden"
                        name="users"
                        id={user.id}
                        value={user.id}
                        readOnly
                        checked
                      />
                      <span className="ml-2">{user.name}</span>
                    </label>
                    <button
                      type="button"
                      className="cursor-pointer ml-2"
                      onClick={handleClose}
                    >
                      <X />
                    </button>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Input
          title={groupCreationModal.inputs.titles.groupName[lang]}
          name={groupCreationModal.inputs.titles.groupName.en}
          placeholder={groupCreationModal.inputs.placeholders.groupName[lang]}
          type="text"
          error={errorsMap.get("groupName")}
          required
        />
        <Input
          title={groupCreationModal.inputs.titles.groupAlias[lang]}
          name={groupCreationModal.inputs.titles.groupAlias.en}
          placeholder={groupCreationModal.inputs.placeholders.groupAlias[lang]}
          type="text"
          error={errorsMap.get("groupAlias")}
        />
        <ImageInput
          title={groupCreationModal.inputs.titles.groupAvatar[lang]}
          name={groupCreationModal.inputs.titles.groupAvatar.en}
          ref={imageRef}
          error={errorsMap.get("groupAvatar")}
        />
        <Input
          title={groupCreationModal.inputs.titles.groupDescription[lang]}
          name={groupCreationModal.inputs.titles.groupDescription.en}
          placeholder={
            groupCreationModal.inputs.placeholders.groupDescription[
              lang ?? "en"
            ]
          }
          type="textarea"
          error={errorsMap.get("groupDescription")}
        />

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending || isCreationPending}
          >
            {isCreationPending
              ? groupCreationModal.buttonLabel.creating[lang ?? "en"]
              : groupCreationModal.buttonLabel.create[lang ?? "en"]}
          </button>
        </div>
      </form>
      <div>
        <h4 className="fieldset-legend !font-normal">
          {addUsersSection.title[lang ?? "en"]}
        </h4>

        <UserSearchBar
          mutate={mutate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isPending={isPending}
        />
        {data && (
          <div className="mt-6 grid grid-cols-2 gap-y-4 items-center">
            <h3 className="justify-self-start flex gap-1.5">
              <UserSearch />{" "}
              <span>
                {addUsersSection.addingResultTitle[lang ?? "en"](data.users.length)}
              </span>
            </h3>
            <button
              type="button"
              className="btn btn-outline justify-self-end"
              onClick={() => reset()}
            >
              {addUsersSection.clearButtonLable[lang ?? "en"]}
            </button>

            <ul className="chatapp-user-list bg-emerald-400/25">
              {data?.users.map((user, index, userArr) => (
                <li
                  key={user.id}
                  ref={index === userArr.length - 1 ? lastUserItemRef : null}
                >
                  <UserItemCheckbox
                    key={user.id}
                    id={user.id}
                    username={user.name}
                    alias={user.alias}
                    avatarUrl={user.avatarUrl}
                    checkboxName="users"
                    checked={selectedUsers.some((u) => u.id === user.id)}
                    onChange={handleChange}
                    colorType="success"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {isError && (
          <div className="text-red-500 mt-4">
            <p className="text-center">{error.message}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GroupCreationModal;
