import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import errorLogo from "@assets/error_logo.svg";

const ErrorPage = () => {
  const errorData = useRouteError();

  let message = "Something went wrong";

  if (errorData instanceof Error)
    message = (errorData as Error)?.message ?? message;

  if (isRouteErrorResponse(errorData)) message = errorData.statusText;

  return (
    <div className="w-screen h-screen">
      <header className="h-1/3 w-full flex items-center justify-center">
        <img className="h-1/2" src={errorLogo} alt="Error Logo" />
      </header>
      <main className="text-center">
        <h1 className="text-3xl">Something went wrong</h1>
        <p>Please try again later</p>
        {message && <p className="text-rose-600">&#91;{message}&#93;</p>}
      </main>
    </div>
  );
};

export default ErrorPage;
