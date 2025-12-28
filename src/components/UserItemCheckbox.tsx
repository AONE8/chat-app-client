import { FC } from "react";
import ImageHolder from "./UI/ImageHolder";

interface UserItemCheckboxProps {
  id: string;
  username: string;
  alias?: string;
  avatarUrl?: string;
  checkboxName: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorType: "primary" | "error" | "info" | "success";
}

const UserItemCheckbox: FC<UserItemCheckboxProps> = ({
  id,
  username,
  alias,
  avatarUrl,
  checkboxName,
  checked,
  onChange,
  colorType,
}) => {
  const colorTypeSchema = {
    primary: {
      label:
        "hover:border-purple-600 active:bg-purple-300/30 has-checked:bg-purple-300/30",
      checkbox: "checkbox-primary",
    },
    error: {
      label:
        "hover:border-rose-600 active:bg-rose-300/30 has-checked:bg-rose-300/30",
      checkbox: "checkbox-error",
    },
    info: {
      label:
        "hover:border-sky-600 active:bg-sky-300/30 has-checked:bg-sky-300/30",
      checkbox: "checkbox-info",
    },
    success: {
      label:
        "hover:border-emerald-600 active:bg-emerald-300/30 has-checked:bg-emerald-300/30",
      checkbox: "checkbox-success",
    },
  };

  return (
    <label className={`chatapp-user-item ${colorTypeSchema[colorType].label}`}>
      <ImageHolder
        className="row-span-2"
        username={username}
        avatarUrl={avatarUrl}
      />

      <h6 className="username">{username}</h6>
      {alias && <p className="alias">@{alias}</p>}

      <input
        type="checkbox"
        id={id}
        value={id}
        name={checkboxName}
        checked={checked}
        onChange={onChange}
        className={`checkbox ${colorTypeSchema[colorType].checkbox} item-checkbox`}
      />
    </label>
  );
};

export default UserItemCheckbox;
