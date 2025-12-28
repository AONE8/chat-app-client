import Input from "@components/Input";

const LoginFormContent = ({
  errorsMap,
}: {
  errorsMap?: Map<string, string>;
}) => {
  return (
    <div className="px-2 max-h-96 overflow-auto">
      <Input
        title="Email"
        placeholder="Enter your email"
        type="email"
        error={errorsMap?.get("email")}
        required
      />
      <Input
        title="Password"
        placeholder="Enter your password"
        type="password"
        error={errorsMap?.get("password")}
        required
      />
    </div>
  );
};

export default LoginFormContent;
