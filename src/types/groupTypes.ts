export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  alias?: string;
  role: "owner" | "admin" | "user";
  isOnline?: boolean;
}

export interface GroupIncomingData {
  name: string;
  description?: string;
  avatarUrl?: string;
  alias?: string;
  chatId: string;
  members: Member[];
}
