import { ThunkDispatch } from "@reduxjs/toolkit";
import { chatHubActions } from "../store/chatHubSlice";

export const getChatsAsync = async (
  url: string,
  bearStr: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, any>
) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearStr}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message ?? "Internal Server Error");
  }

  const data = await response.json();
  dispatch(chatHubActions.setChats({ chats: data.chats }));
};
