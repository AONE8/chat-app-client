import { getResponse } from "./getResponse";
import { rethrowError } from "./rethrowError";

export const restHandlerAction = async (
  url: string | URL,
  {
    method = "GET",
    body,
    signal,
    authToken = "",
    defaultErrorMessage,
  }: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: Record<string, any> | FormData;
    signal?: AbortSignal;
    authToken?: string;
    defaultErrorMessage: string;
  },
  additionalAction?: (data: any) => void
) => {
  try {
    const response = await getResponse(authToken, body, method, url, signal);

    if (additionalAction) {
      const data = response.status === 204 ? undefined : await response.json();

      additionalAction(data);
    }
  } catch (error) {
    rethrowError(error, defaultErrorMessage);
  }
};
