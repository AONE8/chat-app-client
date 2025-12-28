import ImageInput from "@components/ImageInput";
import Input from "@components/Input";
import SelectLanguage from "@components/SelectLanguage";

const SignUpFormContent = ({
  imageRef,
  errorsMap,
}: {
  imageRef?: React.RefObject<{ imageReset: () => void }>;
  errorsMap?: Map<string, string>;
}) => {
  return (
    <div className="px-2 max-h-96 overflow-auto">
      <Input
        title="Username"
        placeholder="Enter your username"
        type="text"
        error={errorsMap?.get("username")}
        required
      />
      <Input
        title="Alias"
        placeholder="Enter your alias"
        type="text"
        error={errorsMap?.get("alias")}
      />
      <ImageInput
        name="Avatar"
        title="Avatar"
        ref={imageRef}
        error={errorsMap?.get("avatar")}
      />
      <Input
        title="Email"
        placeholder="Enter your email"
        type="email"
        error={errorsMap?.get("email")}
        required
      />
      <Input
        title="Phone number"
        placeholder="Enter your phone number"
        error={errorsMap?.get("phoneNumber")}
        type="text"
      />
      <Input
        title="Description"
        placeholder="Enter your description"
        error={errorsMap?.get("description")}
        type="textarea"
      />
      <SelectLanguage />
      <Input
        title="Password"
        placeholder="Enter your password"
        type="password"
        error={errorsMap?.get("password")}
        required
      />
      <Input
        title="Password confirmation"
        placeholder="Confirm your password"
        type="password"
        error={errorsMap?.get("passwordConfirmation")}
        required
      />
    </div>
  );
};

export default SignUpFormContent;
