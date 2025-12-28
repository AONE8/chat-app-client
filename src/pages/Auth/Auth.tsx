import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as z from "zod";

import { type AppDispatch, type RootState } from "@store";

import { Login, type LoginType } from "@schemas/authSchemas/login";
import { Signup, type SignupType } from "@schemas/authSchemas/signup";
import { signupAction } from "@store/authActions";
import { loginAction } from "@store/authActions";
import SignUpFormContent from "@components/AuthPage/SignUpFormContent";
import LoginFormContent from "@components/AuthPage/LoginFormContent";
import { toFormData } from "@lib/toFormData";

import understandLogo from "@assets/understand_logo.svg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [errorsMap, setErrorsMap] = useState<Map<string, string>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const imageRef = useRef<{ imageReset: () => void }>({ imageReset: () => {} });

  if (isLoggedIn) return <Navigate to="/user" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formEl = event.currentTarget as HTMLFormElement;

    const formData = new FormData(formEl);

    setIsSubmitting(true);
    setErrorsMap(new Map());

    let data: LoginType | SignupType;
    let result:
      | z.ZodSafeParseResult<LoginType>
      | z.ZodSafeParseResult<SignupType>;

    if (isLogin) {
      data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      result = Login.safeParse(data);

      if (result.success) {
        await dispatch(loginAction(result.data));
      }
    } else {
      data = Object.fromEntries(formData.entries()) as SignupType;

      result = Signup.safeParse(data);

      if (result.success) {
        const validatedFormData = toFormData(result.data);

        await dispatch(signupAction(validatedFormData));
      }
    }

    const newErrorsMap = new Map();

    if (!result.success) {
      const errors = result.error.issues;
      errors.forEach((error) => {
        newErrorsMap.set(error.path[0].toString(), error.message);
      });
      setErrorsMap(newErrorsMap);
      toast.error("Invalid form data");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  function handleReset() {
    imageRef.current?.imageReset();
  }

  let title = "Sign up";
  let formContent = (
    <SignUpFormContent imageRef={imageRef!} errorsMap={errorsMap} />
  );

  if (isLogin) {
    title = "Log in";
    formContent = <LoginFormContent errorsMap={errorsMap} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between px-2 py-4 ">
        <div className="h-8 md:h-16">
          <img
            className="h-full"
            src={understandLogo}
            alt="Understand App Logo"
          />
        </div>
        <nav></nav>
      </header>
      <main className="flex-grow px-8 pt-4 flex justify-center">
        <form
          className="flex flex-col gap-4 w-full md:w-[42rem]"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h1 className="text-3xl text-center">{title}</h1>

          {formContent}
          <div className="flex justify-between">
            <button
              className="btn btn-outline btn-accent"
              type="reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="btn btn-success"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          <p className="text-center">
            <button
              type="button"
              className="btn btn-dash btn-info text-xs"
              onClick={() => {
                setIsLogin((prev) => !prev);
                setErrorsMap(new Map());
              }}
            >
              {!isLogin ? "Already have an account?" : "Don't have an account?"}
            </button>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Auth;
