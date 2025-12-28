import store from "@store";
import { restHandlerFunction } from "@lib/restHandlerFunction";
import { restHandlerAction } from "@/lib/restHandlerAction";

const {
  VITE_ADD_CONTACT_URL,
  VITE_REMOVE_CONTACT_URL,
  VITE_GET_CHAT_URL,
  VITE_CREATE_CHAT_URL,
} = import.meta.env;

export const addContact = async ({ contactId }: { contactId: string }) => {
  const token = store.getState().auth.token;

  return restHandlerFunction(VITE_ADD_CONTACT_URL, {
    method: "POST",
    authToken: token?.raw || "",
    body: { contactId },
    defaultErrorMessage: "Failed to add contact",
  });
};

export const removeContact = async ({ contactId }: { contactId: string }) => {
  const token = store.getState().auth.token;

  return restHandlerAction(`${VITE_REMOVE_CONTACT_URL}/${contactId}`, {
    method: "DELETE",
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to remove contact",
  });
};

export const getChatRoom = async ({
  chatId,
  signal,
}: {
  chatId: string;
  signal: AbortSignal;
}) => {
  const token = store.getState().auth.token;

  return restHandlerFunction(`${VITE_GET_CHAT_URL}/${chatId}`, {
    authToken: token?.raw || "",
    signal,
    defaultErrorMessage: "Failed to get chat room",
  });
};

export const createChat = async ({ receiverId }: { receiverId: string }) => {
  const token = store.getState().auth.token;

  return restHandlerFunction(VITE_CREATE_CHAT_URL, {
    method: "POST",
    body: { receiverId },
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to create chat",
  });
};
