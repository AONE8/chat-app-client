import { data, LoaderFunctionArgs, redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getUserById } from "@api/services/userService";
import { UserData } from "@/types/userTypes";

export const userLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const userId = params.userId;

    if (!userId) throw data("User ID is required", { status: 404 });

    await queryClient.prefetchQuery({
      queryKey: ["user", userId],
      queryFn: async ({ signal }) => getUserById({ userId: userId, signal }),
    });

    const queryState = queryClient.getQueryState<
      UserData,
      Error & { status?: number }
    >(["user", userId]);

    if (queryState?.error?.status === 404) {
      toast.error(queryState.error.message);
      return redirect("/user");
    }

    if (queryState?.error?.status === 409) {
      return redirect("/user/profile");
    }

    return data({ userId }, { status: 200 });
  };
