import { HubConnection } from "@microsoft/signalr";

export interface ChatItem {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: string;
  isRemoved: boolean;
}

export interface ChatHub {
  connection: HubConnection | null;
  chats: ChatItem[];
  isPending: boolean;
  isLoadingChats: boolean;
  editingMessage?: { messageId: string; content: string };
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isUpdated: boolean;
}

export interface ChatRoom {
  name: string;
  users: ChatUser[];
  deletedUsers: ChatUser[];
  messages: ChatMessage[];
  profileId: string;
  isGroup: boolean;
  isOnline?: boolean;
}

export interface MessageReq {
  chatId: string;
  content: string;
}

export interface MessageResp {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
