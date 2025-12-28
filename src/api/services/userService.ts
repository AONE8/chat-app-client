import store from "@store";
import { restHandlerAction } from "@lib/restHandlerAction";
import { restHandlerFunction } from "@lib/restHandlerFunction";

const { VITE_USER_BACKEND_URL, VITE_DELETE_USER_URL, VITE_USER_SEARCH_URL } =
  import.meta.env;

export const getUserData = async ({ signal }: { signal: AbortSignal }) => {
  const token = store.getState().auth.token;

  return restHandlerFunction(VITE_USER_BACKEND_URL, {
    signal,
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to get user data",
  });
};

export const searchUsers = async ({
  searchTerm,
  exceptions,
}: {
  searchTerm: string;
  exceptions?: string[];
}) => {
  if (!searchTerm.trim() || searchTerm.trim().length < 3) {
    return;
  }

  const token = store.getState().auth.token?.raw || "";

  const hasExceptions = exceptions && exceptions.length > 0;

  const url = new URL(VITE_USER_SEARCH_URL);

  if (searchTerm.includes("@")) {
    url.searchParams.append("alias", searchTerm.substring(1));
  } else {
    url.searchParams.append("userName", searchTerm);
  }

  let method: "GET" | "POST" = "GET";
  let body: Record<string, any> | undefined;

  if (hasExceptions) {
    method = "POST";
    body = { exceptions };
  }

  return restHandlerFunction(url, {
    method,
    body,
    authToken: token,
    defaultErrorMessage: "Failed to search user",
  });
};

export const getUserById = async ({
  userId,
  signal,
}: {
  userId: string;
  signal: AbortSignal;
}) => {
  try {
    const token = store.getState().auth.token?.raw || "";

    const response = await fetch(`${VITE_USER_BACKEND_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (response.status === 404) {
      const error = await response.json();
      const customError: Error & { status?: number } = new Error(error.message);
      customError.status = response.status;
      throw customError;
    }

    if (response.status === 409) {
      const error = await response.json();
      const customError: Error & { status?: number } = new Error(error.message);
      customError.status = response.status;
      throw customError;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Internal Server Error");
    }

    const data = await response.json();

    console.log("Search data", data);

    return data.user;
  } catch (error) {
    console.error("Search error", error);
    throw error;
  }
};

export const confirmUserDeleting = async (password: string) => {
  const token = store.getState().auth.token;

  return restHandlerAction(VITE_DELETE_USER_URL, {
    method: "POST",
    body: { password },
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to delete user",
  });
};
