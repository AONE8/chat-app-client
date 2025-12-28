import { createSlice } from "@reduxjs/toolkit";

import { type ChatHub } from "@/types/chatTypes";

import { getChatList, sendMessage, updateMessage } from "./chatHubActions";

const chatHubSlice = createSlice({
  name: "chatHub",
  initialState: {
    connection: null,
    chats: [],
    isPending: false,
    isLoadingChats: false,
  } as ChatHub,
  reducers: {
    setConnection(state, action) {
      state.connection = action.payload.connection;
    },
    clearConnection(state) {
      state.connection = null;
      state.chats = [];
    },
    setChats(state, action) {
      state.chats = action.payload.chats;
    },
    addChat(state, action) {
      state.chats.push(action.payload.chat);
    },
    addMessageToChat(state, action) {
      const { chatId, message } = action.payload;
      const chatIdx = state.chats.findIndex((c) => c.id === chatId);
      const chat = chatIdx !== -1 ? state.chats.splice(chatIdx, 1)[0] : null;

      if (chat) {
        chat.lastMessage = message.content;
        chat.lastMessageTime = message.createdAt;
        state.chats.push(chat);
      }
    },
    setEditingMessage(state, action) {
      state.editingMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatList.pending, (state) => {
        state.isLoadingChats = true;
      })
      .addCase(getChatList.fulfilled, (state) => {
        state.isLoadingChats = false;
      })
      .addCase(getChatList.rejected, (state) => {
        state.isLoadingChats = false;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateMessage.pending, (state) => {
        state.isPending = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(updateMessage.fulfilled, (state) => {
        state.isPending = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isPending = false;
      })
      .addCase(updateMessage.rejected, (state) => {
        state.isPending = false;
      });
  },
});

export const chatHubActions = chatHubSlice.actions;
export default chatHubSlice;
