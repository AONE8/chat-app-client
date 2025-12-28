import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import { type RootState } from "@store";

import { userActions } from "./userSlice";
import { chatHubActions } from "./chatHubSlice";
import httpClient from "@api/httpClient";
import { ChatHubMethods } from "@lib/chatHubMethods";
import { executeChatHubMethod } from "@lib/executeChatHubMethod";
import { listenChatHubMethod } from "@/lib/listenChatHubMethod";
import { ChatHubListeningMethods } from "@/lib/ChatHubListeningMethods";
import { restHandlerAction } from "@/lib/restHandlerAction";

const { VITE_UPDATE_LANGUAGE_URL, VITE_UPDATE_AVATAR_URL } = import.meta.env;

export const updateIsShownPhoneNumber = createAsyncThunk(
  "user/updateIsShownPhoneNumber",
  (_, { dispatch, getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_SHOWING_PHONE_NUMBER,
      successMessage: "Phone number visibility updated successfully",
      thrownErrorMessage: "Updating phone number failed",
      caughtErrorMessage: "Error updating phone number visibility.",
      action: userActions.setIsShownPhoneNumber(),
    });
  }
);

export const updateIsShownDescriotion = createAsyncThunk(
  "user/updateIsShownDescription",
  (_, { dispatch, getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_SHOWING_DESCRIPTION,
      successMessage: "Description visibility updated successfully",
      thrownErrorMessage: "Updating description failed",
      caughtErrorMessage: "Error updating description visibility.",
      action: userActions.setIsShownDescription(),
    });
  }
);

export const updateIsShownActivityStatus = createAsyncThunk(
  "user/updateIsShownActivityStatus",
  (_, { dispatch, getState }) => {
    const cb = () => {
      const isShownActivityStatus = (getState() as RootState).user
        .isShownActivityStatus;
      if (!isShownActivityStatus)
        dispatch(userActions.updateUser({ user: { isOnline: undefined } }));
      else dispatch(userActions.updateUser({ user: { isOnline: true } }));
    };

    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_SHOWING_ACTIVITY_STATUS,
      successMessage: "Activity status visibility updated successfully",
      thrownErrorMessage: "Updating activity status failed",
      caughtErrorMessage: "Error updating activity status visibility.",
      action: userActions.setIsShownActivityStatus(),
      afterDispatchCallback: cb,
    });
  }
);

export const updateIsShownAvatar = createAsyncThunk(
  "user/updateIsShownAvatar",
  (_, { dispatch, getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_SHOWING_AVATAR,
      successMessage: "Avatar visibility updated successfully",
      thrownErrorMessage: "Updating avatar failed",
      caughtErrorMessage: "Error updating avatar visibility.",
      action: userActions.setIsShownAvatar(),
    });
  }
);

export const updatetIsShownOriginalText = createAsyncThunk(
  "user/updateIsShownOriginalText",
  (_, { dispatch, getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_SHOWING_ORIGINAL_TEXT,
      successMessage: "Original text visibility updated successfully",
      thrownErrorMessage: "Updating original text visibility failed",
      caughtErrorMessage: "Error updating Updating original text visibility.",
      action: userActions.setIsShownOriginalText(),
    });
  }
);

export const updatetIsTranslatedDocs = createAsyncThunk(
  "user/updateIsTranslatedDocs",
  (_, { dispatch, getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_SHOWING_TRANSLATED_DOCS,
      successMessage: "Document translation setting updated successfully",
      thrownErrorMessage: "Updating document translation setting failed",
      caughtErrorMessage: "Error updating document translation setting.",
      action: userActions.setIsShownOriginalText(),
    });
  }
);

export const updateIsDarkMode = createAsyncThunk(
  "user/updateIsDarkMode",
  (_, { dispatch, getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_DARK_MODE,
      successMessage: "Dark mode setting updated successfully",
      thrownErrorMessage: "Updating dark mode setting failed",
      caughtErrorMessage: "Error updating dark mode setting.",
      action: userActions.setIsDarkMode(),
    });
  }
);

export const listenUpdatedUiSettings = createAsyncThunk(
  "user/listenUpdatedUiSettings",
  (_, { getState }) => {
    const methods = {
      [ChatHubListeningMethods.UPDATE_UI_SETTINGS]: (userId: string) => {
        httpClient.invalidateQueries({
          queryKey: ["user", userId],
          refetchType: "active",
        });

        httpClient.invalidateQueries({
          queryKey: ["chats"],
          refetchType: "active",
        });
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods,
      caughtErrorMessage: "Error listening for updated UI settings.",
    });
  }
);

export const updateLanguage = createAsyncThunk(
  "user/updateLanguage",
  async ({ lang }: { lang: string }, { dispatch, getState }) => {
    const token = (getState() as RootState).auth.token;

    restHandlerAction(
      VITE_UPDATE_LANGUAGE_URL,
      {
        method: "PUT",
        authToken: token?.raw || "",
        body: { lang },
        defaultErrorMessage: "Error updating language.",
      },
      () => {
        dispatch(userActions.setLanguage({ lang }));

        httpClient.invalidateQueries({
          queryKey: ["chats"],
          exact: false,
        });

        toast.success("Language updated successfully");
      }
    );
  }
);

export const updateName = createAsyncThunk<void, { username: string }>(
  "user/updateName",
  ({ username }, { getState, dispatch }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_USER_NAME,
      successMessage: "Username updated successfully",
      thrownErrorMessage: "Username updating failed",
      caughtErrorMessage: "Error in updating user name.",
      action: userActions.updateUser({ user: { name: username } }),
      methodArgs: [username],
    });
  }
);

export const updateAlias = createAsyncThunk<void, { alias: string }>(
  "user/updateAlias",
  async ({ alias }, { getState, dispatch }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_ALIAS,
      successMessage: "Alias updated successfully",
      thrownErrorMessage: "Alias Updating Failed",
      caughtErrorMessage: "Error in updating alias.",
      action: userActions.updateUser({ user: { alias } }),
      methodArgs: [alias],
    });
  }
);

export const updateAvatar = createAsyncThunk<void, { avatar: File }>(
  "user/updateAvatar",
  ({ avatar }, { dispatch, getState }) => {
    const token = (getState() as RootState).auth.token;

    const formData = new FormData();
    formData.append("Avatar", avatar);

    restHandlerAction(
      VITE_UPDATE_AVATAR_URL,
      {
        method: "PUT",
        body: formData,
        authToken: token?.raw || "",
        defaultErrorMessage: "Error in updating avatar.",
      },
      (data) => {
        const avatarUrl = data.avatarUrl;

        dispatch(userActions.updateUser({ user: { avatarUrl } }));
        toast.success("Avatar updated successfully");
      }
    );
  }
);

export const updateEmail = createAsyncThunk<void, { email: string }>(
  "user/updateEmail",
  ({ email }, { getState, dispatch }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_EMAIL,
      successMessage: "Email updated successfully",
      thrownErrorMessage: "Email updating failed",
      caughtErrorMessage: "Error in updating email.",
      action: userActions.updateUser({ user: { email } }),
      methodArgs: [email],
    });
  }
);

export const updatePhoneNumber = createAsyncThunk<
  void,
  { phoneNumber: string }
>("user/updatePhoneNumber", async ({ phoneNumber }, { getState, dispatch }) => {
  executeChatHubMethod({
    state: getState() as RootState,
    dispatch,
    method: ChatHubMethods.UPDATE_PHONE_NUMBER,
    successMessage: "Phone number updated successfully",
    thrownErrorMessage: "Phone number updating failed",
    caughtErrorMessage: "Error in updating phone number.",
    action: userActions.updateUser({ user: { phoneNumber } }),
    methodArgs: [phoneNumber],
  });
});

export const updateDescription = createAsyncThunk<
  void,
  { description: string }
>("user/updateDescription", async ({ description }, { getState, dispatch }) => {
  executeChatHubMethod({
    state: getState() as RootState,
    dispatch,
    method: ChatHubMethods.UPDATE_DESCRIPTION,
    successMessage: "Description updated successfully",
    thrownErrorMessage: "Description updating failed",
    caughtErrorMessage: "Error in updating description.",
    action: userActions.updateUser({ user: { description } }),
    methodArgs: [description],
  });
});

export const listenDeletingUser = createAsyncThunk(
  "user/listenDeleteUser",
  async (_, { getState, dispatch }) => {
    const methods = {
      [ChatHubListeningMethods.DELETE_USER]: (
        userId: string,
        chatId: string,
        groupId: string
      ) => {
        httpClient.invalidateQueries({
          predicate: (query) => {
            const userQueryKey =
              query.queryKey[0] === "users" && query.queryKey[1] === userId;
            const chatQueryKey =
              query.queryKey[0] === "chats" &&
              (query.queryKey[1] as { chatId?: string })?.chatId === chatId;
            const groupQueryKey =
              query.queryKey[0] === "groups" &&
              (query.queryKey[1] as { groupId?: string })?.groupId === groupId;

            return userQueryKey || chatQueryKey || groupQueryKey;
          },
          refetchType: "all",
        });

        const chats = (getState() as RootState).chatHub.chats;

        if (chats) {
          const updatedChats = chats.filter((chat) => chat.id !== chatId);
          dispatch(chatHubActions.setChats({ chats: updatedChats }));
        }
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods,
      caughtErrorMessage: "Error in listening for delete user",
    });
  }
);
