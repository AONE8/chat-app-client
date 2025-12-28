import { FC } from "react";

interface FileInputProps {
  title: string;
  accept: string;
  size?: string;
  required?: boolean;
}

const FileInput: FC<FileInputProps> = ({
  title,
  accept,
  size = "2MB",
  required = false,
}) => {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        {title}
        {required && <span className="text-red-500">*</span>}
      </legend>
      <input
        type="file"
        className="file-input w-full"
        accept={accept}
        required={required}
      />
      <label className="fieldset-label">Max size {size}</label>
    </fieldset>
  );
};

export default FileInput;
