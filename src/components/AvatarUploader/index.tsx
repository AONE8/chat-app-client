import { FC } from "react";

import ImageUploadButton from "./ImageUploadButton";

interface AvatarUploaderProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avatarUrl?: string;
  formName?: string;
  name: string;
  error?: string;
}

const AvatarUploader: FC<AvatarUploaderProps> = ({
  onImageUpload,
  name,
  avatarUrl,
  error,
  formName,
}) => {
  return (
    <div className="avatar pr-4">
      <div
        className={`relative overflow-hidden image-placeholder-24 text-white dark:text-neutral-800 ${
          error ? "border-2 border-red-500" : ""
        }`}
      >
        {avatarUrl && <img src={avatarUrl} alt={name} />}
        {!avatarUrl && name.charAt(0).toUpperCase()}
        <ImageUploadButton name={formName} onChange={onImageUpload} />
      </div>
    </div>
  );
};

export default AvatarUploader;
