import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type RootState } from "@store";

import AvatarUploader from "@/components/AvatarUploader";
import { updateGroup } from "@api/services/groupService";
import { toFormData } from "@lib/toFormData";
import { groupUpdatingData } from "@schemas/groupSchemas/updateGroupSchema";

import { editGroupModal } from "@contents/groupContent";

interface GroupFormProps {
  ref: React.RefObject<HTMLFormElement | null>;
  name: string;
  avatarUrl?: string;
  alias?: string;
  description?: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupForm: FC<GroupFormProps> = ({
  ref,
  name,
  avatarUrl,
  alias,
  description,
  setIsEditing,
}) => {
  const groupId = useParams().groupId;
  const [profileUrl, setProfileUrl] = useState(avatarUrl ?? "");
  const [errorsMap, setErrorsMap] = useState(new Map<string, string>());
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const { mutate } = useMutation<void, Error, FormData>({
    mutationKey: ["updateGroup", groupId],
    mutationFn: (formData) => updateGroup(formData, groupId!),
    onSuccess: () => {
      setIsEditing(false);
      toast.success(`Group updated successfully!`);
    },
    onError: (error) => {
      toast.error("Failed updating Group!");
      toast.error(error.message);
    },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image")) {
      setProfileUrl(URL.createObjectURL(file));
    }
  }

  function handleEditingGroupSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(ref.current!);

    const data = Object.fromEntries(formData.entries());

    console.log("Updating data:", data);

    const result = groupUpdatingData.safeParse(data);

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

    mutate(newFormData);
  }

  function handleReset() {
    setIsEditing(false);
    setProfileUrl(avatarUrl ?? "");
  }

  return (
    <form
      className="w-full lg:w-128 lg:mx-auto flex flex-col gap-4"
      ref={ref}
      onReset={handleReset}
      onSubmit={handleEditingGroupSubmit}
      encType="multipart/form-data"
    >
      {errorsMap.get("avatar") && (
        <p className="text-red-500 text-xs">{errorsMap.get("avatar")}</p>
      )}
      <div className="flex divide-emerald-500 divide-x-2 gap-4 border rounded-2xl p-4">
        <AvatarUploader
          onImageUpload={handleFileChange}
          name={name}
          avatarUrl={profileUrl}
          error={errorsMap.get("groupAvatar")}
          formName="groupAvatar"
        />
        <div className="max-w-3/5 flex-1/2 flex flex-col gap-2">
          {errorsMap.get("groupName") && (
            <p className="text-red-500 text-xs">{errorsMap.get("groupName")}</p>
          )}
          <input
            type="text"
            name="groupName"
            id="name"
            className={`relative text-2xl w-full border-b border-emerald-700/30 focus:border-emerald-700 focus:outline-none ${
              errorsMap.get("groupName") ? "border-red-500 text-red-500" : ""
            }`}
            placeholder={editGroupModal.namePlaceholder[lang]}
            defaultValue={name}
          />

          {errorsMap.get("alias") && (
            <p className="text-red-500 text-xs">{errorsMap.get("alias")}</p>
          )}

          <input
            type="text"
            name="groupAlias"
            id="alias"
            className={`relative text-xs w-full border-b border-emerald-700/30 focus:border-emerald-700 focus:outline-none ${
              errorsMap.get("groupAlias") ? "border-red-500 text-red-500" : ""
            }`}
            placeholder={editGroupModal.aliasPlaceholder[lang]}
            defaultValue={alias ?? ""}
          />
        </div>
      </div>

      <div
        className={`chatapp-description-section ${
          errorsMap.get("description") ? "border-red-500 text-red-500" : ""
        }`}
      >
        {errorsMap.get("groupDescription") && (
          <p className="text-red-500 text-xs">{errorsMap.get("description")}</p>
        )}
        <textarea
          className="w-full border-none focus:outline-none"
          name="groupDescription"
          id="description"
          placeholder={editGroupModal.descriptionPlaceholder[lang]}
          defaultValue={description ?? ""}
        ></textarea>
      </div>
    </form>
  );
};

export default GroupForm;
