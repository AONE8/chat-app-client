import { data, LoaderFunctionArgs, redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type GroupIncomingData } from "@/types/groupTypes";

import { getGroup } from "@api/services/groupService";

export const groupLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const groupId = params.chatId;

    if (!groupId) throw data("Group ID is required", { status: 404 });

    await queryClient.prefetchQuery<GroupIncomingData>({
      queryKey: ["groups", { groupId }],
      queryFn: async ({ signal }) => getGroup({ groupId: groupId, signal }),
    });

    const queryState = queryClient.getQueryState(["groups", { groupId }]);

    if (queryState?.status === "error") {
      toast.error(queryState.error!.message);
      return redirect("/user");
    }

    return data({ groupId }, { status: 200 });
  };
