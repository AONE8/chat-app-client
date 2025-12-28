// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toFormData = (data: Record<string, any>): FormData => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Input must be a plain object.");
  }

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === "string" || typeof value === "number") {
      formData.append(key, String(value));
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, String(item)));
    } else {
      try {
        formData.append(key, JSON.stringify(value));
      } catch {
        console.error(`Could not stringify value for key: ${key}`, value);
      }
    }
  });

  return formData;
};
