export async function getResponse(
  authToken: string,
  body: Record<string, any> | FormData | undefined,
  method: string,
  url: string | URL,
  signal: AbortSignal | undefined
) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${authToken}`,
  };

  let jsonBody = "";

  if (!(body instanceof FormData) && body) {
    headers["Content-Type"] = "application/json";
    jsonBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: method,
    headers,
    signal,
    body: jsonBody || (body as FormData | undefined),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response?.json();
    console.error(error);
    throw new Error(error.message ?? "Internal Server Error");
  }

  return response;
}
