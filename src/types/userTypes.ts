export interface ContactType {
  id: string;
  name: string;
  alias?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  name: string;
  alias: string;
  avatarUrl: string;
  email: string;
  phoneNumber: string;
  description: string;
  language: "en" | "uk";
  isOnline?: boolean;
  contacts: ContactType[] | null;
}

export type ActionType = {
  type:
    | "TOGGLE_USERNAME"
    | "TOGGLE_ALIAS"
    | "TOGGLE_EMAIL"
    | "TOGGLE_PHONE_NUMBER"
    | "TOGGLE_DESCRIPTION";
};

export interface IsError {
  username: boolean;
  alias: boolean;
  email: boolean;
  phoneNumber: boolean;
  description: boolean;
  avatar: boolean;
}

export interface UserData {
  name: string;
  alias?: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  phoneNumber?: string;
  chatId: string;
  isOnline?: boolean;
}
