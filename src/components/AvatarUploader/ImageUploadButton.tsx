import { FC } from "react";
import { Camera } from "lucide-react";

interface ImageUploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
}

const ImageUploadButton: FC<ImageUploadButtonProps> = ({
  onChange,
  name = "",
  id = "",
}) => {
  return (
    <button
      type="button"
      className="absolute w-full h-1/3 flex bg-emerald-400/65 bottom-0 left-0"
    >
      <label className="w-full h-full flex items-center justify-center cursor-pointer">
        <Camera />
        <input
          type="file"
          name={name}
          id={id}
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </button>
  );
};

export default ImageUploadButton;
