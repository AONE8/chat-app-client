export const rethrowError = (error: unknown, defaultErrorMessage: string) => {
  let message = defaultErrorMessage;

  if (error && typeof error === "object" && "message" in error) {
    message = String((error as any).message);
  }

  throw new globalThis.Error(message || defaultErrorMessage);
};
