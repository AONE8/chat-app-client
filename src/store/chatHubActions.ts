import { createAsyncThunk } from "@reduxjs/toolkit";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

import { type RootState } from "@store";
import type { MessageReq, MessageResp, ChatRoom } from "@/types/chatTypes";
import { type GroupIncomingData, type Member } from "@/types/groupTypes";

import { chatHubActions } from "./chatHubSlice";
import httpClient from "@api/httpClient";
import { getChatsAsync } from "@lib/getChatsAsync";
import { executeChatHubMethod } from "@lib/executeChatHubMethod";
import { ChatHubMethods } from "@lib/chatHubMethods";
import { listenChatHubMethod } from "@lib/listenChatHubMethod";
import { ChatHubListeningMethods } from "@lib/ChatHubListeningMethods";
import { rethrowError } from "@/lib/rethrowError";
import { restHandlerAction } from "@/lib/restHandlerAction";
import { returnAuthString } from "@/lib/returnAuthString";

const {
  VITE_WSS_CONNECTION_URL,
  VITE_GET_CHAT_URL,
  VITE_GET_ORIGINAL_MESSAGE_URL,
} = import.meta.env;

export const initializeChatHubConnection = createAsyncThunk(
  "chatHub/initialize",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const chatHub = state.chatHub;
    const token = state.auth.token?.raw ?? "";
    if (!chatHub.connection) {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(VITE_WSS_CONNECTION_URL, {
            accessTokenFactory: () => token,
          })
          .build();

        await connection.start();

        dispatch(chatHubActions.setConnection({ connection }));
      } catch (err) {
        console.error("Connection failed: ", err);
        toast.error("Connection failed");
      }
    }
  }
);

export const stopChatHubConnection = createAsyncThunk(
  "chatHub/stop",
  async (_, { dispatch, getState }) => {
    const { connection } = (getState() as RootState).chatHub;
    if (connection) {
      try {
        await (connection as signalR.HubConnection).stop();
        dispatch(chatHubActions.clearConnection());
      } catch (err) {
        console.error("Error stopping connection: ", err);
      }
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chatHub/sendMessage",
  ({ chatId, content }: MessageReq, { getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      method: ChatHubMethods.SEND_MESSAGE,
      thrownErrorMessage: "Message not sent",
      caughtErrorMessage: "Error sending message",
      methodArgs: [chatId, content],
    });
  }
);

export const listenMessages = createAsyncThunk(
  "chatHub/listenMessages",
  (_, { getState, dispatch }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_MESSAGE]: (
        message: MessageResp,
        chatItem:
          | {
              id: string;
              name: string;
              avatarUrl: string;
              unreadCount: number;
            }
          | undefined
      ) => {
        if (chatItem) {
          dispatch(
            chatHubActions.addChat({
              chat: {
                id: chatItem.id,
                name: chatItem.name,
                avatarURL: chatItem.avatarUrl,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                unreadCount: chatItem.unreadCount,
              },
            })
          );
        } else {
          dispatch(
            chatHubActions.addMessageToChat({
              chatId: message.chatId,
              message,
            })
          );
        }

        httpClient.setQueryData(
          ["chats", { chatId: message.chatId }],
          (oldData: ChatRoom) =>
            oldData
              ? {
                  ...oldData,
                  messages: [
                    ...oldData.messages,
                    {
                      id: message.id,
                      senderId: message.senderId,
                      content: message.content,
                      createdAt: message.createdAt,
                    },
                  ],
                }
              : oldData
        );
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiving message",
    });
  }
);

export const getChatList = createAsyncThunk(
  "chatHub/getChatList",
  async (_, { dispatch, getState }) => {
    try {
      const token = (getState() as RootState).auth.token;
      await getChatsAsync(VITE_GET_CHAT_URL, token?.raw || "", dispatch);
    } catch (error) {
      rethrowError(error, "Error getting chat list");
    }
  }
);

export const listenCreatingGroup = createAsyncThunk(
  "chatHub/listenCreatingGroup",
  (_, { dispatch, getState }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_NEW_GROUP]: (
        groupName: string,
        groupCreatedAt: string,
        groupId: string,
        groupAvatarUrl?: string
      ) => {
        dispatch(
          chatHubActions.addChat({
            chat: {
              id: groupId,
              name: groupName,
              avatarURL: groupAvatarUrl,
              lastMessage: "",
              lastMessageTime: groupCreatedAt,
              unreadCount: 0,
            },
          })
        );
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiving new group",
    });
  }
);

export const updateMessage = createAsyncThunk(
  "chatHub/updateMessage",
  (
    { messageId, content }: { messageId: string; content: string },
    { getState, dispatch }
  ) => {
    executeChatHubMethod({
      state: getState() as RootState,
      dispatch,
      method: ChatHubMethods.UPDATE_MESSAGE,
      successMessage: "Message updated successfully",
      thrownErrorMessage: "Message updating failed",
      caughtErrorMessage: "Error in updating message.",
      action: chatHubActions.setEditingMessage(undefined),
      methodArgs: [messageId, content],
    });
  }
);

export const deleteMessage = createAsyncThunk(
  "chatHub/deleteMessage",
  ({ messageId }: { messageId: string }, { getState }) => {
    executeChatHubMethod({
      state: getState() as RootState,
      method: ChatHubMethods.DELETE_MESSAGE,
      successMessage: "Message deleted successfully",
      thrownErrorMessage: "Message deleting failed",
      caughtErrorMessage: "Error in deleting message.",
      methodArgs: [messageId],
    });
  }
);

export const listenUpdatingMessage = createAsyncThunk(
  "chatHub/listenUpdatingMessage",
  (_, { getState }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_UPDATING_RESULT]: (
        messageId: string,
        content: string,
        chatId: string,
        updatedAt: string
      ) => {
        httpClient.setQueryData<ChatRoom>(["chats", { chatId }], (oldData) => {
          if (!oldData) return oldData;

          const messages = oldData.messages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content,
                  time: updatedAt,
                  isUpdated: true,
                }
              : message
          );

          return {
            ...oldData,
            messages,
          };
        });
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiveing updated message",
    });
  }
);

export const listenDeletingMessages = createAsyncThunk(
  "chatHub/listenDeletingMessages",
  (_, { getState }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_DELETING_RESULT]: (
        messageId: string,
        chatId: string
      ) => {
        httpClient.setQueryData<ChatRoom>(["chats", { chatId }], (oldData) => {
          if (!oldData) return oldData;

          const messages = oldData.messages.filter(
            (message) => message.id !== messageId
          );

          return {
            ...oldData,
            messages,
          };
        });
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiveing deleted message id",
    });
  }
);

export const getMessage = createAsyncThunk(
  "chatHub/getMessage",
  ({ messageId }: { messageId: string }, { dispatch, getState }) => {
    const token = (getState() as RootState).auth.token;

    restHandlerAction(
      `${VITE_GET_ORIGINAL_MESSAGE_URL}/${messageId}`,
      {
        authToken: token?.raw || "",
        defaultErrorMessage: "Error getting original message",
      },
      (data) => {
        dispatch(chatHubActions.setEditingMessage(data));
      }
    );
  }
);

export const listenAddingUsersToGroup = createAsyncThunk(
  "chatHub/listenAddingUsersToGroup",
  (_, { getState }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_ADDED_USERS_IN_GROUP]: (
        users: Member[],
        groupId: string,
        chatId: string
      ) => {
        const groupData = httpClient.getQueryData<GroupIncomingData>([
          "groups",
          { groupId },
        ]);

        if (groupData) {
          httpClient.setQueryData(
            ["groups", { groupId }],
            (oldData: GroupIncomingData) => ({
              ...oldData,
              members: [...users],
            })
          );

          httpClient.setQueryData(
            ["chats", { chatId }],
            (oldData: ChatRoom) => ({
              ...oldData,
              users: users.map((u) => ({
                id: u.id,
                name: u.name,
                avatarUrl: u.avatarUrl,
              })),
              deletedUsers: oldData.deletedUsers.filter(
                (user) => !users.some((u) => u.id === user.id)
              ),
            })
          );
        }
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiveing added users into group",
    });
  }
);

export const listenRemovingUsersFromGroup = createAsyncThunk(
  "chatHub/listenRemovingUsersFromGroup",
  (_, { getState, dispatch }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.REMOVE_USERS_FROM_GROUP]: (
        userIdList: string[],
        groupId: string,
        chatId: string
      ) => {
        httpClient.setQueryData(
          ["groups", { groupId }],
          (oldData: GroupIncomingData) => ({
            ...oldData,
            members: oldData.members.filter(
              (member) => !userIdList.includes(member.id)
            ),
          })
        );

        httpClient.setQueryData(["chats", { chatId }], (oldData: ChatRoom) => ({
          ...oldData,
          deletedUsers: oldData.deletedUsers.concat(
            oldData.users.filter((member) => userIdList.includes(member.id))
          ),
          users: oldData.users.filter(
            (member) => !userIdList.includes(member.id)
          ),
        }));
      },
      [ChatHubListeningMethods.REMOVE_USER_FROM_GROUP]: (
        userId: string,
        groupId: string,
        chatId: string
      ) => {
        httpClient.setQueryData(
          ["groups", { groupId }],
          (oldData: GroupIncomingData) => ({
            ...oldData,
            members: oldData.members.filter((member) => member.id !== userId),
          })
        );

        httpClient.setQueryData(["chats", { chatId }], (oldData: ChatRoom) => ({
          ...oldData,
          deletedUsers: oldData.deletedUsers.concat(
            oldData.users.filter((member) => member.id === userId)
          ),
          users: oldData.users.filter((member) => member.id !== userId),
        }));
      },
      [ChatHubListeningMethods.REMOVE_FROM_CHAT_AND_GROUP]: (
        chatId: string,
        groupId: string
      ) => {
        httpClient.invalidateQueries({
          predicate: (query) => {
            const chatQueryKey =
              query.queryKey[0] === "chats" &&
              (query.queryKey[1] as { chatId?: string }).chatId === chatId;
            const groupQueryKey =
              query.queryKey[0] === "groups" &&
              (query.queryKey[1] as { groupId?: string }).groupId === groupId;

            return chatQueryKey || groupQueryKey;
          },
        });

        const chats = (getState() as RootState).chatHub.chats;

        if (chats) {
          const newChats = chats.filter((chat) => chat.id !== chatId);
          dispatch(chatHubActions.setChats({ chats: newChats }));
        }
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error removing users from group",
    });
  }
);

export const listenManagingAdminList = createAsyncThunk(
  "chatHub/listenManagingAdminList",
  (_, { getState }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_UPDATED_ADMIN_LIST]: (
        adminList: string[],
        groupId: string
      ) => {
        httpClient.setQueryData(
          ["groups", { groupId }],
          (oldData: GroupIncomingData) => ({
            ...oldData,
            members: oldData.members.map((member) =>
              adminList.includes(member.id)
                ? { ...member, role: "admin" }
                : member.role === "owner"
                ? member
                : { ...member, role: "user" }
            ),
          })
        );
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiving updated admin list",
    });
  }
);

export const listenUpdatingGroup = createAsyncThunk(
  "chatHub/listenUpdatingGroup",
  (_, { getState, dispatch }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.RECEIVE_UPDATED_GROUP_DATA]: (
        groupId: string,
        chatId: string,
        groupName: string,
        groupAlias: string,
        groupDesc: string,
        groupAvatarUrl: string
      ) => {
        httpClient.setQueryData(
          ["groups", { groupId }],
          (oldData: GroupIncomingData) =>
            oldData
              ? {
                  ...oldData,
                  name: groupName,
                  alias: groupAlias,
                  description: groupDesc,
                  avatarUrl: groupAvatarUrl,
                  chatId,
                }
              : oldData
        );

        let chats = (getState() as RootState).chatHub.chats;

        chats = chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, name: groupName, avatarUrl: groupAvatarUrl }
            : chat
        );

        dispatch(chatHubActions.setChats({ chats }));
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error receiving removed users from group",
    });
  }
);

export const listenUserActivityStatus = createAsyncThunk(
  "chatHub/listenUserActivityStatus",
  (_, { getState }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.GET_USER_ACTIVE_STATUS]: (
        userId: string,
        isOnline?: boolean
      ) => {
        httpClient.setQueriesData(
          { queryKey: ["groups"], exact: false },
          (oldData: GroupIncomingData) => ({
            ...oldData,
            members: oldData.members.map((member) =>
              member.id === userId ? { ...member, isOnline: isOnline } : member
            ),
          })
        );

        httpClient.setQueriesData(
          { queryKey: ["chats"], exact: false },
          (oldData: ChatRoom) =>
            oldData
              ? {
                  ...oldData,
                  users: oldData.users.map((user) =>
                    user.id === userId ? { ...user, isOnline } : user
                  ),
                }
              : oldData
        );
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error getting user's activity status",
    });
  }
);

export const listenUpdatingChatBox = createAsyncThunk(
  "chatHub/listenUpdatingChatBox",
  async (_, { getState, dispatch }) => {
    const token = (getState() as RootState).auth.token;

    const connectionMethods = {
      [ChatHubListeningMethods.UPDATE_CHAT_LIST_BOX]: async () => {
        await getChatsAsync(
          VITE_GET_CHAT_URL,
          token?.toString() ?? "",
          dispatch
        );
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error listening updating chat list",
    });
  }
);

export const listenDeletingGroup = createAsyncThunk(
  "chatHub/listenDeletingGroup",
  (_, { getState, dispatch }) => {
    const connectionMethods = {
      [ChatHubListeningMethods.DELETE_GROUP]: (
        groupId: string,
        chatId: string
      ) => {
        httpClient.invalidateQueries({
          predicate: (query) => {
            const chatQuery =
              query.queryKey[0] === "chats" &&
              (query.queryKey[1] as { chatId?: string }).chatId === chatId;
            const groupQuery =
              query.queryKey[0] === "groups" &&
              (query.queryKey[1] as { groupId?: string }).groupId === groupId;

            return chatQuery || groupQuery;
          },
          refetchType: "all",
        });

        let chats = (getState() as RootState).chatHub.chats;

        chats = chats.filter((chat) => chat.id !== chatId);

        dispatch(chatHubActions.setChats({ chats }));
      },
    };

    listenChatHubMethod({
      state: getState() as RootState,
      methods: connectionMethods,
      caughtErrorMessage: "Error listening deleting group",
    });
  }
);
