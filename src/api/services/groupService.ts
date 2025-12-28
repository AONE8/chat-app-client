import store from "@store";
import { restHandlerAction } from "@lib/restHandlerAction";
import { restHandlerFunction } from "@lib/restHandlerFunction";
import { returnAuthString } from "@/lib/returnAuthString";

const {
  VITE_GROUP_URL,
  VITE_ADD_USERS_TO_GROUP_URL,
  VITE_REMOVE_USERS_FROM_GROUP_URL,
  VITE_ADD_TO_ADMIN_LIST_URL,
  VITE_REMOVE_FROM_ADMIN_LIST_URL,
} = import.meta.env;

export const getGroup = async ({
  groupId,
  signal,
}: {
  groupId: string;
  signal: AbortSignal;
}) => {
  const token = store.getState().auth.token;

  return restHandlerFunction(`${VITE_GROUP_URL}/${groupId}`, {
    authToken: token?.raw || "",
    signal,
    defaultErrorMessage: "Failed to get group",
  });
};

export const createGroup = async (formData: FormData) => {
  const token = store.getState().auth.token;

  return restHandlerFunction(VITE_GROUP_URL, {
    method: "POST",
    body: formData,
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to create group",
  });
};

export const addUserToGroup = async (addedUsers: string[], groupId: string) => {
  const token = store.getState().auth.token;

  return restHandlerAction(VITE_ADD_USERS_TO_GROUP_URL, {
    method: "POST",
    body: {
      userIdList: addedUsers,
      groupId,
    },
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to add user to group",
  });
};

export const removeUsersFromGroup = async (
  userIdList: string[],
  groupId: string
) => {
  const token = store.getState().auth.token;

  return restHandlerAction(VITE_REMOVE_USERS_FROM_GROUP_URL, {
    method: "POST",
    body: {
      userIdList,
      groupId,
    },
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to remove user from group",
  });
};

export const addToAdminList = async (user: string, groupId: string) => {
  const token = store.getState().auth.token;

  return restHandlerAction(VITE_ADD_TO_ADMIN_LIST_URL, {
    method: "POST",
    body: { user, groupId },
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to add user to admin list",
  });
};

export const removeFromAdminList = async (
  admins: string[],
  groupId: string
) => {
  const url = new URL(VITE_REMOVE_FROM_ADMIN_LIST_URL);
  url.searchParams.append("groupId", groupId);
  admins.forEach((admin) => url.searchParams.append("admins", admin));

  const token = store.getState().auth.token;

  return restHandlerAction(url, {
    method: "DELETE",
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to remove user from admin list",
  });
};

export const updateGroup = async (formData: FormData, groupId: string) => {
  const token = store.getState().auth.token;

  return restHandlerAction(`${VITE_GROUP_URL}/${groupId}`, {
    method: "PUT",
    body: formData,
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to update group",
  });
};

export const deleteGroup = async (groupId: string, groupName: string) => {
  const token = store.getState().auth.token;
  const url = new URL(`${VITE_GROUP_URL}/${groupId}`);
  url.searchParams.append("groupName", groupName);

  return restHandlerAction(url, {
    method: "DELETE",
    authToken: token?.raw || "",
    defaultErrorMessage: "Failed to delete group",
  });
};
