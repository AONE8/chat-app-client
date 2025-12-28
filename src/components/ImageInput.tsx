import { FC, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { CircleCheckBig, Plus } from "lucide-react";

import { type RootState } from "@store";

import { imageInputPlaceholder } from "@contents/userContent";

interface ImageInputProps {
  name: string;
  title: string;
  ref?: React.RefObject<{ imageReset: () => void }>;
  error?: string;
}

const ImageInput: FC<ImageInputProps> = ({ name, title, ref, error }) => {
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const formName = name
    .trim()
    .toLowerCase()
    .split(" ")
    .reduce((acc, word, i) => {
      return (
        acc + (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      );
    }, "");

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragEnter() {
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  useImperativeHandle(ref, () => ({
    imageReset: () => setPreview(""),
  }));

  return (
    <fieldset className="fieldset min-h-14">
      <legend className="fieldset-legend">
        {title} {error && <span className="text-red-500">{error}</span>}
      </legend>
      <label
        className={`relative w-full h-24 flex gap-4 items-center justify-center cursor-pointer ${
          isDragging ? "bg-emerald-200/95" : ""
        }`}
        htmlFor={formName}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview && !isDragging && (
          <img
            className="w-12 h-12 rounded-full border object-cover"
            src={preview}
            alt="Avatar preview"
          />
        )}
        <span>
          {!isDragging &&
            (!preview ? (
              <span>{imageInputPlaceholder.uploader[lang]}</span>
            ) : (
              <span className="text-green-500 text-sm flex gap-2 items-center">
                <span>{imageInputPlaceholder.uploadedImage[lang]}</span>
                <CircleCheckBig className="w-5 h-5 stroke-1" />
              </span>
            ))}
        </span>
        {isDragging && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-950 font-bold">
            <Plus className="inline-block" />
            <span>{imageInputPlaceholder.dragImage[lang]}</span>
          </span>
        )}
        <input
          type="file"
          id={formName}
          name={formName}
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </label>
    </fieldset>
  );
};

export default ImageInput;
