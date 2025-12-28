import { data, LoaderFunctionArgs, redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

import { type ChatRoom } from "@/types/chatTypes";

import { getChatRoom } from "@api/services/chatService";
import toast from "react-hot-toast";

export const chatLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const chatId = params.chatId;

    if (!chatId) throw data("Chat ID is required", { status: 404 });

    await queryClient.prefetchQuery<ChatRoom | null>({
      queryKey: ["chats", { chatId }],
      queryFn: async ({ signal }) => getChatRoom({ chatId: chatId, signal }),
    });

    const queryState = queryClient.getQueryState<ChatRoom | null>([
      "chats",
      { chatId },
    ]);

    if (queryState?.status === "error") {
      const error = queryState.error as Error;
      toast.error(error.message);
      return redirect("/user");
    }

    return data({ chatId }, { status: 200 });
  };
