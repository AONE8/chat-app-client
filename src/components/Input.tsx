import { FC, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface InputProps {
  title: string;
  name?: string;
  error?: string;
  placeholder: string;
  type: "text" | "password" | "textarea" | "email" | "tel";
  required?: boolean;
}

const Input: FC<InputProps> = ({
  title,
  name,
  placeholder,
  error,
  type,
  required = false,
}) => {
  const [inputChanging, setInputChanging] = useState<"password" | "text">(
    "password"
  );

  const actualName = (name ?? title)
    .toLocaleLowerCase()
    .split(" ")
    .reduce(
      (acc, word, i) =>
        acc + (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)),
      ""
    );

  if (type === "textarea") {
    return (
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          {title}
          {required && <span className="text-red-500">*</span>}
          {error && <span className="text-red-500">{error}</span>}
        </legend>
        <textarea
          className={`textarea h-24 w-full ${error ? "border-red-500" : ""}`}
          placeholder={placeholder}
          name={actualName}
          required={required}
        ></textarea>
      </fieldset>
    );
  }
  return (
    <fieldset className="fieldset relative">
      <legend className="fieldset-legend">
        {title}
        {required && <span className="text-red-500">*</span>}
        {error && <span className="text-red-500">{error}</span>}
      </legend>
      <input
        type={type === "password" ? inputChanging : type}
        className={`input pr-10 w-full ${error ? "border-red-500" : ""}`}
        placeholder={placeholder}
        name={actualName}
        required={required}
      />
      {type === "password" && (
        <button
          className="absolute right-2 translate-y-[50%]"
          type="button"
          onClick={() =>
            setInputChanging((prev) =>
              prev === "password" ? "text" : "password"
            )
          }
        >
          {inputChanging === "password" ? (
            <EyeClosed className="text-gray-500" />
          ) : (
            <Eye className="text-gray-500" />
          )}
        </button>
      )}
    </fieldset>
  );
};

export default Input;
